import React from 'react';

import { render, screen } from '@testing-library/react-native';

import type { TranslationKey } from '@/src/localization';

import { Text } from './Text.view';

describe('Text Component', () => {
  it('should render string children', () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should render ReactNode children', () => {
    render(
      <Text>
        <Text>Nested Text</Text>
      </Text>
    );
    expect(screen.getByText('Nested Text')).toBeTruthy();
  });

  it('should translate string keys', () => {
    render(<Text>features.auth.button</Text>);
    expect(screen.getByText('features.auth.button')).toBeTruthy();
  });

  it('should translate object with id', () => {
    render(
      <Text>{{ id: 'features.auth.button' as unknown as TranslationKey }}</Text>
    );
    expect(screen.getByText('features.auth.button')).toBeTruthy();
  });

  it('should translate object with id and params', () => {
    render(
      <Text>
        {{
          id: 'features.auth.button' as unknown as TranslationKey,
          params: { name: 'John' },
        }}
      </Text>
    );
    expect(
      screen.getByText('features.auth.button_{"name":"John"}')
    ).toBeTruthy();
  });

  it('should apply custom style', () => {
    const customStyle = { fontSize: 20 };
    const { getByText } = render(<Text style={customStyle}>Styled Text</Text>);
    const textElement = getByText('Styled Text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toContainEqual(customStyle);
  });

  it('should handle empty children', () => {
    render(<Text>{''}</Text>);
    expect(screen.getByText('')).toBeTruthy();
  });

  it('should handle null children', () => {
    const { UNSAFE_root } = render(<Text>{null}</Text>);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle undefined children', () => {
    const { UNSAFE_root } = render(<Text>{undefined}</Text>);
    expect(UNSAFE_root).toBeTruthy();
  });
});
