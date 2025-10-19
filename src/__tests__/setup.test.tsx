import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

// Simple component for testing
const TestComponent = () => {
  return <Text>Hello, Testing!</Text>;
};

describe('Testing Environment', () => {
  it('should render correctly', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello, Testing!')).toBeTruthy();
  });

  it('should have Jest configured properly', () => {
    expect(jest).toBeDefined();
  });
});
