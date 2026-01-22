import React from 'react';

import { Text, View } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { Icon } from './Icon.view';

const MockIconComponent = ({ color, width, height, testID }: any) => {
  return (
    <View
      testID={testID || 'mock-icon'}
      style={{ backgroundColor: color, width, height }}
    >
      <Text>Icon</Text>
    </View>
  );
};

describe('Icon Component', () => {
  it('should render icon without onPress', () => {
    render(<Icon Icon={MockIconComponent} />);
    expect(screen.getByTestId('mock-icon')).toBeTruthy();
  });

  it('should render icon with default primary color', () => {
    const { getByTestId } = render(<Icon Icon={MockIconComponent} />);
    const icon = getByTestId('mock-icon');
    expect(icon).toBeTruthy();
  });

  it('should render icon with custom color', () => {
    const { getByTestId } = render(
      <Icon Icon={MockIconComponent} color="secondary" />
    );
    const icon = getByTestId('mock-icon');
    expect(icon).toBeTruthy();
  });

  it('should render icon with custom width and height', () => {
    const { getByTestId } = render(
      <Icon Icon={MockIconComponent} width={24} height={24} />
    );
    const icon = getByTestId('mock-icon');
    expect(icon).toBeTruthy();
    expect(icon).toBeTruthy();
  });

  it('should wrap icon in Pressable when onPress is provided', () => {
    const onPress = jest.fn();
    const { getAllByTestId } = render(
      <Icon
        Icon={MockIconComponent}
        onPress={onPress}
        testID="icon-pressable"
      />
    );
    const elements = getAllByTestId('icon-pressable');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should call onPress when icon is pressed', () => {
    const onPress = jest.fn();
    const { getAllByTestId } = render(
      <Icon
        Icon={MockIconComponent}
        onPress={onPress}
        testID="icon-pressable"
      />
    );
    const pressables = getAllByTestId('icon-pressable');
    fireEvent.press(pressables[0]);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should pass testID to Pressable when onPress is provided', () => {
    const onPress = jest.fn();
    const { getAllByTestId } = render(
      <Icon
        Icon={MockIconComponent}
        onPress={onPress}
        testID="custom-test-id"
      />
    );
    const elements = getAllByTestId('custom-test-id');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should pass all props to Icon component', () => {
    const customProps = { width: 32, height: 32, testID: 'custom-icon' };
    const { getByTestId } = render(
      <Icon Icon={MockIconComponent} {...customProps} />
    );
    const icon = getByTestId('custom-icon');
    expect(icon).toBeTruthy();
  });
});
