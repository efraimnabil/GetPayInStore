import { getAllProducts } from '@/api/api';
import { ProductsResponse } from '@/types/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface UseProductsOptions {
  limit?: number;
  skip?: number;
}

/**
 * Custom hook to fetch all products using React Query
 * @param options - Optional pagination parameters (limit, skip)
 * @returns React Query result with products data
 */
export const useProducts = (
  options: UseProductsOptions = {}
): UseQueryResult<ProductsResponse, Error> => {
  const { limit = 30, skip = 0 } = options;

  return useQuery({
    queryKey: ['products', limit, skip],
    queryFn: () => getAllProducts(limit, skip),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};