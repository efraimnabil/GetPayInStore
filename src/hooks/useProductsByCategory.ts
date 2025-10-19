import { getProductsByCategory } from '@/api/api';
import { ProductsResponse } from '@/types/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface UseProductsByCategoryOptions {
  limit?: number;
  skip?: number;
}

/**
 * Custom hook to fetch products by category using React Query
 * @param category - Category name to filter products
 * @param options - Optional pagination parameters (limit, skip)
 * @returns React Query result with products data for the specified category
 */
export const useProductsByCategory = (
  category: string,
  options: UseProductsByCategoryOptions = {}
): UseQueryResult<ProductsResponse, Error> => {
  const { limit = 30, skip = 0 } = options;

  return useQuery({
    queryKey: ['products', category, limit, skip],
    queryFn: () => getProductsByCategory(category, limit, skip),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!category, // Only run query if category is provided
  });
};