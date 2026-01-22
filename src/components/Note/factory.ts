export type NoteValue = 1 | 2 | 4 | 8 | 16;

export type Accidental = '#' | 'b' | null;

export type ParsedPitch = {
  letter: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
  accidental: Accidental;
  octave: number;
};

export type NoteModel = Readonly<{
  kind: 'note';
  pitch: string;
  value: NoteValue;
  ticks: number;
  withDot?: boolean;
  withTriplet?: boolean;
  midi: number;
  letter: ParsedPitch['letter'];
  accidental: Accidental;
  octave: number;
}>;

const LETTER_TO_SEMITONE: Record<ParsedPitch['letter'], number> = {
  c: 0,
  d: 2,
  e: 4,
  f: 5,
  g: 7,
  a: 9,
  b: 11,
};

function assertNoteValue(value: number): asserts value is NoteValue {
  if (
    value !== 1 &&
    value !== 2 &&
    value !== 4 &&
    value !== 8 &&
    value !== 16
  ) {
    throw new Error(
      `Invalid note value "${value}". Allowed values are 1, 2, 4, 8, 16.`
    );
  }
}

export function parsePitch(input: string): ParsedPitch {
  const s = input.trim();
  const match = /^([a-gA-G])([#bB])?(-?\d+)$/.exec(s);
  if (!match) {
    throw new Error(
      `Invalid pitch "${input}". Expected formats like "c3", "C#4", "db-1".`
    );
  }

  const letter = match[1]!.toLowerCase() as ParsedPitch['letter'];
  const accidentalRaw = match[2] ?? null;
  const accidental = accidentalRaw
    ? (accidentalRaw.toLowerCase() as '#' | 'b')
    : null;
  const octave = Number(match[3]);
  if (!Number.isFinite(octave)) {
    throw new Error(`Invalid octave in pitch "${input}".`);
  }

  return { letter, accidental, octave };
}

export function pitchToMidi(pitch: ParsedPitch): number {
  const base = LETTER_TO_SEMITONE[pitch.letter];
  const accidentalOffset =
    pitch.accidental === '#' ? 1 : pitch.accidental === 'b' ? -1 : 0;
  const semitone = base + accidentalOffset;
  return (pitch.octave + 1) * 12 + semitone;
}

function normalizePitch(pitch: ParsedPitch): string {
  const letter = pitch.letter.toUpperCase();
  const accidental = pitch.accidental ?? '';
  return `${letter}${accidental}${pitch.octave}`;
}

function createNoteModel({
  pitchInput,
  valueInput,
  withDot,
  withTriplet,
}: Readonly<{
  pitchInput: string;
  valueInput: number;
  withDot?: boolean;
  withTriplet?: boolean;
}>): NoteModel {
  assertNoteValue(valueInput);
  const parsed = parsePitch(pitchInput);
  const midi = pitchToMidi(parsed);

  const normalizedWithDot = withDot ? true : undefined;
  const normalizedWithTriplet = withTriplet ? true : undefined;

  let durationMultiplier = 1;
  if (normalizedWithTriplet) durationMultiplier = 2 / 3;
  else if (normalizedWithDot) durationMultiplier = 1.5;

  const ticks = (16 / valueInput) * durationMultiplier;

  return Object.freeze({
    kind: 'note',
    pitch: normalizePitch(parsed),
    value: valueInput,
    ticks,
    withDot: normalizedWithDot,
    withTriplet: normalizedWithTriplet,
    midi,
    letter: parsed.letter,
    accidental: parsed.accidental,
    octave: parsed.octave,
  });
}

export function createNote(
  pitch: string,
  value: NoteValue,
  triplet?: number
): NoteModel {
  const isTriplet = triplet === 3;
  return createNoteModel({
    pitchInput: pitch,
    valueInput: value,
    withDot: false,
    withTriplet: isTriplet,
  });
}

export const NoteFactory = createNote;

export function NoteFactoryDot(pitch: string, value: NoteValue): NoteModel {
  return createNoteModel({
    pitchInput: pitch,
    valueInput: value,
    withDot: true,
  });
}

export const createNoteDot = NoteFactoryDot;

export function createNoteTriplet(pitch: string, value: NoteValue): NoteModel {
  return createNote(pitch, value, 3);
}

export const NoteFactoryTriplet = createNoteTriplet;
