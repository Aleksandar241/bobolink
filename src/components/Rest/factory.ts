import type { RestValue } from './types';

export type RestModel = Readonly<{
  kind: 'rest';
  value: RestValue;
  ticks: number;
  withDot?: boolean;
}>;

const BASE_TICKS = 16;

function assertRestValue(value: number): asserts value is RestValue {
  if (
    value !== 1 &&
    value !== 2 &&
    value !== 4 &&
    value !== 8 &&
    value !== 16
  ) {
    throw new Error(
      `Invalid rest value "${value}". Allowed values are 1, 2, 4, 8, 16.`
    );
  }
}

function valueToTicks(value: RestValue) {
  return BASE_TICKS / value;
}

function createRestModel(valueInput: number, withDot?: boolean): RestModel {
  assertRestValue(valueInput);

  const normalizedWithDot = withDot ? true : undefined;
  const ticks = valueToTicks(valueInput) * (normalizedWithDot ? 1.5 : 1);

  return Object.freeze({
    kind: 'rest',
    value: valueInput,
    ticks,
    withDot: normalizedWithDot,
  });
}

export function createRest(value: RestValue): RestModel {
  return createRestModel(value);
}

export const RestFactory = createRest;

export function RestFactoryDot(value: RestValue): RestModel {
  return createRestModel(value, true);
}
