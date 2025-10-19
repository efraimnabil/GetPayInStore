import { theme } from '@/theme/theme';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { ProductCard } from '../ProductCard';

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ProductCard', () => {
  const mockProduct = {
    thumbnail: 'https://example.com/image.jpg',
    title: 'Test Product',
    price: '$99.99',
  };

  it('should render product information', () => {
    renderWithTheme(
      <ProductCard
        thumbnail={mockProduct.thumbnail}
        title={mockProduct.title}
        price={mockProduct.price}
      />
    );

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('$99.99')).toBeTruthy();
  });

  it('should call onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    renderWithTheme(
      <ProductCard
        thumbnail={mockProduct.thumbnail}
        title={mockProduct.title}
        price={mockProduct.price}
        onPress={onPressMock}
      />
    );

    const card = screen.getByText('Test Product');
    fireEvent.press(card);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should show delete button when showDeleteButton is true', () => {
    const onDeleteMock = jest.fn();
    renderWithTheme(
      <ProductCard
        thumbnail={mockProduct.thumbnail}
        title={mockProduct.title}
        price={mockProduct.price}
        showDeleteButton={true}
        onDelete={onDeleteMock}
      />
    );

    // Check if delete button icon is rendered (Ionicons renders as Text)
    const deleteButton = screen.getByTestId('delete-button');
    expect(deleteButton).toBeTruthy();
  });

  it('should call onDelete when delete button is pressed', () => {
    const onDeleteMock = jest.fn();
    renderWithTheme(
      <ProductCard
        thumbnail={mockProduct.thumbnail}
        title={mockProduct.title}
        price={mockProduct.price}
        showDeleteButton={true}
        onDelete={onDeleteMock}
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.press(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('should not show delete button when showDeleteButton is false', () => {
    renderWithTheme(
      <ProductCard
        thumbnail={mockProduct.thumbnail}
        title={mockProduct.title}
        price={mockProduct.price}
        showDeleteButton={false}
      />
    );

    expect(screen.queryByTestId('delete-button')).toBeNull();
  });

  it('should render without price', () => {
    renderWithTheme(
      <ProductCard
        thumbnail={mockProduct.thumbnail}
        title={mockProduct.title}
      />
    );

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.queryByText('$99.99')).toBeNull();
  });
});
