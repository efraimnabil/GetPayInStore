import { AppText, ProductCard } from '@/components';
import { useDeleteProductMutation } from '@/hooks/useDeleteProductMutation';
import { useProducts } from '@/hooks/useProducts';
import { RootState } from '@/store/store';
import { Product } from '@/types/api';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const ContentContainer = styled(View)`
  flex: 1;
  padding: ${({ theme }: any) => theme.spacing.md}px;
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
 * Products Screen
 * Displays all products in a FlatList with delete functionality for superadmins
 */
export default function ProductsScreen() {
  const { isSuperadmin } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isError, error, refetch } = useProducts();
  const deleteProductMutation = useDeleteProductMutation();

  const handleDeleteProduct = (productId: number, productTitle: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProductMutation.mutate(productId);
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      thumbnail={item.thumbnail}
      title={item.title}
      price={`$${item.price.toFixed(2)}`}
      onPress={() => {
        // TODO: Navigate to product details
        console.log('Product pressed:', item.id);
      }}
      showDeleteButton={isSuperadmin}
      onDelete={
        isSuperadmin ? () => handleDeleteProduct(item.id, item.title) : undefined
      }
    />
  );

  const renderHeader = () => (
    <HeaderContainer>
      <AppText variant="headline" bold>
        All Products
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
            Loading products...
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
            There are no products available at the moment.
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
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </Container>
  );
}
