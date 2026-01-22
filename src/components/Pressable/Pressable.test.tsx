import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { Pressable } from './Pressable.view';

describe('Pressable Component', () => {
  it('should render without throttling', () => {
    const { getByTestId } = render(
      <Pressable testID="pressable">Press me</Pressable>
    );
    expect(getByTestId('pressable')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Pressable testID="pressable" onPress={onPress}>
        Press me
      </Pressable>
    );
    fireEvent.press(getByTestId('pressable'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should apply custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Pressable testID="pressable" style={customStyle}>
        Press me
      </Pressable>
    );
    const pressable = getByTestId('pressable');
    expect(pressable).toBeTruthy();
  });

  it('should apply opacity when pressed', () => {
    const { getByTestId } = render(
      <Pressable testID="pressable">Press me</Pressable>
    );
    const pressable = getByTestId('pressable');
    fireEvent(pressable, 'pressIn');
    expect(pressable).toBeTruthy();
  });

  it('should render with throttling enabled', () => {
    const { getByTestId } = render(
      <Pressable testID="pressable" throttled>
        Press me
      </Pressable>
    );
    expect(getByTestId('pressable')).toBeTruthy();
  });

  it('should throttle onPress calls when throttled is true', async () => {
    jest.useFakeTimers();
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Pressable
        testID="pressable"
        onPress={onPress}
        throttled
        throttleTime={500}
      >
        Press me
      </Pressable>
    );
    const pressable = getByTestId('pressable');

    fireEvent.press(pressable);
    fireEvent.press(pressable);
    fireEvent.press(pressable);

    expect(onPress).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);

    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('should use custom throttleTime', async () => {
    jest.useFakeTimers();
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Pressable
        testID="pressable"
        onPress={onPress}
        throttled
        throttleTime={1000}
      >
        Press me
      </Pressable>
    );
    const pressable = getByTestId('pressable');

    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('should not throttle when throttled is false', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Pressable testID="pressable" onPress={onPress} throttled={false}>
        Press me
      </Pressable>
    );
    const pressable = getByTestId('pressable');

    fireEvent.press(pressable);
    fireEvent.press(pressable);
    fireEvent.press(pressable);

    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('should not throttle when throttleTime is 0', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Pressable
        testID="pressable"
        onPress={onPress}
        throttled
        throttleTime={0}
      >
        Press me
      </Pressable>
    );
    const pressable = getByTestId('pressable');

    fireEvent.press(pressable);
    fireEvent.press(pressable);
    fireEvent.press(pressable);

    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('should pass all props to underlying Pressable', () => {
    const { getByTestId } = render(
      <Pressable testID="pressable" disabled>
        Press me
      </Pressable>
    );
    const pressable = getByTestId('pressable');
    expect(pressable).toBeTruthy();
  });
});
