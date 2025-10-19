import { deleteProduct } from '@/api/api';
import { Product } from '@/types/api';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

/**
 * Custom hook to delete a product using React Query mutation
 * Invalidates the products query on success
 * @returns React Query mutation result
 */
export const useDeleteProductMutation = (): UseMutationResult<
  Product,
  Error,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: () => {
      // Invalidate all products queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      Alert.alert('Delete Failed', error.message || 'Failed to delete product');
    },
  });
};