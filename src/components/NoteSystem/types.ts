import type { MeasureEvent, TimeSignature } from '../Measure/types';

export type Clef = 'treble' | 'bass';

export type NoteSystemProps = Readonly<{
  events: readonly (readonly MeasureEvent[])[];
  timeSignature: TimeSignature;
  clef: Clef;
  sharps?: number;
  flats?: number;
}>;
