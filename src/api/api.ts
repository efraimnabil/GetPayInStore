import { store } from '@/store';
import { Category, LoginCredentials, LoginResponse, Product, ProductsResponse, User } from '@/types/api';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 unauthorized, network errors)
    if (error.response?.status === 401) {
      console.error('Unauthorized - Token may be invalid or expired');
    }
    return Promise.reject(error);
  }
);

// --- API Service Functions ---

/**
 * Login user with username and password
 * @param credentials - Username and password
 * @returns LoginResponse with user data and token
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * Get current authenticated user's information
 * @returns User data
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

/**
 * Get all products with optional pagination
 * @param limit - Number of products to fetch (default: 30)
 * @param skip - Number of products to skip (default: 0)
 * @returns ProductsResponse with products array and pagination info
 */
export const getAllProducts = async (
  limit: number = 30,
  skip: number = 0
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/products', {
    params: { limit, skip },
  });
  return response.data;
};

/**
 * Get products by category with optional pagination
 * @param category - Category name
 * @param limit - Number of products to fetch (default: 30)
 * @param skip - Number of products to skip (default: 0)
 * @returns ProductsResponse with products in the specified category
 */
export const getProductsByCategory = async (
  category: string,
  limit: number = 30,
  skip: number = 0
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    `/products/category/${category}`,
    {
      params: { limit, skip },
    }
  );
  return response.data;
};

/**
 * Get all available product categories
 * @returns Array of category names
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/products/categories');
  return response.data;
};

/**
 * Delete a product by ID
 * @param productId - ID of the product to delete
 * @returns Deleted product data
 */
export const deleteProduct = async (productId: number): Promise<Product> => {
  const response = await api.delete<Product>(`/products/${productId}`);
  return response.data;
};

/**
 * Search products by query
 * @param query - Search query string
 * @returns ProductsResponse with matching products
 */
export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/products/search', {
    params: { q: query },
  });
  return response.data;
};

/**
 * Get a single product by ID
 * @param productId - ID of the product
 * @returns Product data
 */
export const getProductById = async (productId: number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${productId}`);
  return response.data;
};

// Export the axios instance for custom requests if needed
export default api;
