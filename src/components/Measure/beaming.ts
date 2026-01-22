import { NoteModel } from '../Note';

import {
  BeamingContext,
  BeamingState,
  MeasureEvent,
  TimeSignature,
} from './types';

const BASE_TICKS = 16;

function assertValidTimeSignature(ts: TimeSignature): void {
  if (!Number.isFinite(ts.beats) || ts.beats <= 0) {
    throw new Error(`Invalid timeSignature.beats "${ts.beats}". Expected > 0.`);
  }
  if (!Number.isFinite(ts.beatValue) || ts.beatValue <= 0) {
    throw new Error(
      `Invalid timeSignature.beatValue "${ts.beatValue}". Expected > 0.`
    );
  }
}

function getBeatTicks(ts: TimeSignature): number {
  return BASE_TICKS / ts.beatValue;
}

function getMeasureTicks(ts: TimeSignature): number {
  return ts.beats * getBeatTicks(ts);
}

function createBeamingContext(timeSignature: TimeSignature): BeamingContext {
  assertValidTimeSignature(timeSignature);
  return {
    measureTicks: getMeasureTicks(timeSignature),
    beatTicks: getBeatTicks(timeSignature),
  };
}

function createInitialState(): BeamingState {
  return { posInMeasure: 0, currentGroupStart: null, groups: [] };
}

function isBeamableEvent(e: MeasureEvent): e is NoteModel {
  return e.kind === 'note' && (e.value === 8 || e.value === 16);
}

function indicesRange(start: number, endInclusive: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= endInclusive; i += 1) out.push(i);
  return out;
}

function getEventTicks(e: MeasureEvent): number {
  return e.ticks;
}

function getPosInBeat(posInMeasure: number, beatTicks: number): number {
  return posInMeasure % beatTicks;
}

function wouldOverflowMeasure(
  posInMeasure: number,
  durTicks: number,
  measureTicks: number
): boolean {
  return posInMeasure + durTicks > measureTicks;
}

function resetMeasureIfOverflow(
  state: BeamingState,
  eventIndex: number,
  durTicks: number,
  measureTicks: number
): void {
  if (!wouldOverflowMeasure(state.posInMeasure, durTicks, measureTicks)) return;
  closeOpenGroup(state, eventIndex - 1);
  state.posInMeasure = 0;
}

function wouldCrossBeatBoundary(
  posInBeat: number,
  durTicks: number,
  beatTicks: number
): boolean {
  return posInBeat + durTicks > beatTicks;
}

function shouldBeamWithNeighbor(e: MeasureEvent, crossesBeatBoundary: boolean) {
  if (crossesBeatBoundary) return false;
  return isBeamableEvent(e);
}

function openGroupIfNeeded(state: BeamingState, startIndex: number): void {
  if (state.currentGroupStart !== null) return;
  state.currentGroupStart = startIndex;
}

function closeOpenGroup(state: BeamingState, endIndexInclusive: number): void {
  if (state.currentGroupStart === null) return;
  const len = endIndexInclusive - state.currentGroupStart + 1;
  if (len >= 2) {
    state.groups.push(indicesRange(state.currentGroupStart, endIndexInclusive));
  }
  state.currentGroupStart = null;
}

function closeGroupUnlessBeamable(
  state: BeamingState,
  eventIndex: number,
  shouldBeam: boolean
): void {
  if (shouldBeam) return;
  closeOpenGroup(state, eventIndex - 1);
}

function advancePosition(state: BeamingState, durTicks: number): void {
  state.posInMeasure += durTicks;
}

function isAtBeatEnd(posInMeasure: number, beatTicks: number): boolean {
  return posInMeasure % beatTicks === 0;
}

function closeGroupAtBeatEnd(
  state: BeamingState,
  eventIndex: number,
  beatTicks: number
): void {
  if (!isAtBeatEnd(state.posInMeasure, beatTicks)) return;
  closeOpenGroup(state, eventIndex);
}

function isAtMeasureEnd(posInMeasure: number, measureTicks: number): boolean {
  return posInMeasure === measureTicks;
}

function closeGroupAtMeasureEnd(
  state: BeamingState,
  eventIndex: number,
  measureTicks: number
): void {
  if (!isAtMeasureEnd(state.posInMeasure, measureTicks)) return;
  closeOpenGroup(state, eventIndex);
  state.posInMeasure = 0;
}

export function getMeasureBeamingGroups(
  events: readonly MeasureEvent[],
  timeSignature: TimeSignature
): number[][] {
  const ctx = createBeamingContext(timeSignature);
  const state = createInitialState();

  for (let i = 0; i < events.length; i += 1) {
    const e = events[i]!;
    const durTicks = getEventTicks(e);

    resetMeasureIfOverflow(state, i, durTicks, ctx.measureTicks);

    const posInBeat = getPosInBeat(state.posInMeasure, ctx.beatTicks);
    const crossesBeat = wouldCrossBeatBoundary(
      posInBeat,
      durTicks,
      ctx.beatTicks
    );
    const shouldBeam = shouldBeamWithNeighbor(e, crossesBeat);

    closeGroupUnlessBeamable(state, i, shouldBeam);
    if (shouldBeam) openGroupIfNeeded(state, i);

    advancePosition(state, durTicks);
    closeGroupAtBeatEnd(state, i, ctx.beatTicks);
    closeGroupAtMeasureEnd(state, i, ctx.measureTicks);
  }

  closeOpenGroup(state, events.length - 1);
  return state.groups;
}

export function getMeasureBeamedFlags(
  events: readonly MeasureEvent[],
  timeSignature: TimeSignature
): boolean[] {
  const flags = Array(events.length).fill(false) as boolean[];
  const groups = getMeasureBeamingGroups(events, timeSignature);
  for (const group of groups) {
    for (const idx of group) flags[idx] = true;
  }
  return flags;
}
