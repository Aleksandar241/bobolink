import { createNote, createNoteDot } from '@/src/components/Note/factory';

describe('components/Note/createNote()', () => {
  it('creates a note from c3', () => {
    const n = createNote('c3', 8);
    expect(n.pitch).toBe('C3');
    expect(n.value).toBe(8);
    expect(n.ticks).toBe(2);
    expect(n.kind).toBe('note');
    expect(n.midi).toBe(48);
  });

  it('supports accidentals (C#4)', () => {
    const n = createNote('C#4', 4);
    expect(n.pitch).toBe('C#4');
    expect(n.ticks).toBe(4);
    expect(n.midi).toBe(61);
  });

  it('supports dotted notes', () => {
    const dotted = createNoteDot('c3', 8);
    expect(dotted.withDot).toBe(true);
    expect(dotted.ticks).toBe(3);
  });

  it('supports eighth note triplets', () => {
    const triplet = createNote('c3', 8, 3);
    expect(triplet.withTriplet).toBe(true);
    expect(triplet.ticks).toBeCloseTo(2 * (2 / 3), 5);
  });

  it('supports quarter note triplets', () => {
    const triplet = createNote('c3', 4, 3);
    expect(triplet.withTriplet).toBe(true);
    expect(triplet.ticks).toBeCloseTo(4 * (2 / 3), 5);
  });

  it('supports sixteenth note triplets', () => {
    const triplet = createNote('c3', 16, 3);
    expect(triplet.withTriplet).toBe(true);
    expect(triplet.ticks).toBeCloseTo(1 * (2 / 3), 5);
  });

  it('supports half note triplets', () => {
    const triplet = createNote('c3', 2, 3);
    expect(triplet.withTriplet).toBe(true);
    expect(triplet.ticks).toBeCloseTo(8 * (2 / 3), 5);
  });

  it('throws on invalid pitch', () => {
    expect(() => createNote('nope', 8)).toThrow(/Invalid pitch/);
  });

  it('throws on invalid note value', () => {
    expect(() =>
      createNote('c3', 3 as unknown as Parameters<typeof createNote>[1])
    ).toThrow(/Invalid note value/);
  });
});

describe('components/Note/pitch parsing', () => {
  it('parses flats and negative octaves (db-1)', () => {
    const n = createNote('db-1', 4);
    expect(n.pitch).toBe('Db-1');
    expect(Number.isFinite(n.midi)).toBe(true);
  });
});
