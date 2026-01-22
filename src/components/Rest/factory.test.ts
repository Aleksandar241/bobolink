import { createRest, RestFactoryDot } from '@/src/components/Rest/factory';

describe('components/Rest/createRest()', () => {
  it('creates rest model with ticks', () => {
    expect(createRest(4)).toEqual({ kind: 'rest', value: 4, ticks: 4 });
    expect(createRest(8)).toEqual({ kind: 'rest', value: 8, ticks: 2 });
    expect(createRest(16)).toEqual({ kind: 'rest', value: 16, ticks: 1 });
  });

  it('supports dotted rests', () => {
    const dotted = RestFactoryDot(8);
    expect(dotted.withDot).toBe(true);
    expect(dotted.ticks).toBe(3);
  });

  it('throws on invalid value', () => {
    expect(() =>
      createRest(3 as unknown as Parameters<typeof createRest>[0])
    ).toThrow(/Invalid rest value/);
  });
});
