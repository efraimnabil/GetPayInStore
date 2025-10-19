import { AppText, ProductCard } from '@/components';
import { useProductsByCategory } from '@/hooks/useProductsByCategory';
import { Product } from '@/types/api';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
`;

const ErrorContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
`;

const HeaderContainer = styled(View)`
  padding: ${({ theme }: any) => theme.spacing.md}px;
  padding-bottom: ${({ theme }: any) => theme.spacing.sm}px;
`;

/**
 * Category Screen
 * Displays products from a specific category (smartphones) with pull-to-refresh
 */
export default function CategoryScreen() {
  const category = 'smartphones'; // Hardcoded category
  const { data, isLoading, isError, error, refetch, isRefetching } = useProductsByCategory(category);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      thumbnail={item.thumbnail}
      title={item.title}
      price={`$${item.price.toFixed(2)}`}
      onPress={() => {
        // TODO: Navigate to product details
        console.log('Product pressed:', item.id);
      }}
    />
  );

  const renderHeader = () => (
    <HeaderContainer>
      <AppText variant="headline" bold>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </AppText>
      {data && (
        <AppText variant="caption" color="secondary" style={{ marginTop: 4 }}>
          Showing {data.products.length} of {data.total} products
        </AppText>
      )}
    </HeaderContainer>
  );

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" />
          <AppText variant="body" color="secondary" style={{ marginTop: 16 }}>
            Loading {category}...
          </AppText>
        </LoadingContainer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorContainer>
          <AppText variant="headline" color="error" center>
            Error Loading Products
          </AppText>
          <AppText variant="body" color="secondary" center style={{ marginTop: 16 }}>
            {error?.message || 'Failed to fetch products'}
          </AppText>
        </ErrorContainer>
      </Container>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <Container>
        <EmptyContainer>
          <AppText variant="headline" center>
            No Products Found
          </AppText>
          <AppText variant="body" color="secondary" center style={{ marginTop: 16 }}>
            No products available in this category.
          </AppText>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={data.products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
      />
    </Container>
  );
}
