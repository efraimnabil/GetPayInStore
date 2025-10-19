# API Integration

This document explains how the app communicates with the backend API.

## API Base URL

The app uses the **DummyJSON API** for demo purposes:
```
https://dummyjson.com
```

This is a free fake REST API for testing and prototyping.

## API Endpoints

### Authentication

#### Login
```
POST /auth/login
Body: { username, password }
Response: { token, id, username, email, ... }
```

#### Validate Session
```
GET /auth/me
Headers: { Authorization: Bearer <token> }
Response: { id, username, email, ... }
```

### Products

#### Get All Products
```
GET /products
Response: { products: [...], total, skip, limit }
```

#### Get Products by Category
```
GET /products/category/smartphones
Response: { products: [...], total, skip, limit }
```

#### Delete Product
```
DELETE /products/{id}
Response: { id, isDeleted, ... }
```

## How API Calls Work

### 1. Axios Client Setup

Located in `/src/api/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});
```

### 2. Token Interceptor

Automatically adds auth token to requests:

```typescript
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Error Interceptor

Handles API errors gracefully:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    // Show user-friendly error messages
    return Promise.reject(error);
  }
);
```

## React Query Integration

The app uses **React Query** to manage API calls.

### Why React Query?

- **Automatic Caching** - No need to store API data in Redux
- **Background Updates** - Keeps data fresh
- **Offline Support** - Works with cached data
- **Loading States** - Automatic loading/error handling
- **Deduplication** - Prevents duplicate requests

### Example: Fetching Products

In `/src/hooks/useProducts.ts`:

```typescript
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
}
```

### Example: Deleting a Product

In `/src/hooks/useDeleteProductMutation.ts`:

```typescript
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      // Refresh products list
      queryClient.invalidateQueries(['products']);
    },
  });
}
```

## Caching Strategy

### Memory Cache (React Query)
- Stores API responses in memory
- Fast access during app session
- Lost when app closes

### Persistent Cache (MMKV)
- Saves cache to device storage
- Survives app restarts
- Loads instantly on launch

### Cache Duration

```typescript
{
  staleTime: 5 * 60 * 1000,   // Data fresh for 5 minutes
  gcTime: 10 * 60 * 1000,     // Keep in cache for 10 minutes
}
```

## Offline Behavior

### When Offline

1. **Read Operations** - Use cached data
2. **Write Operations** - Show error message
3. **Network Banner** - Alert user they're offline

### When Back Online

1. React Query automatically refetches
2. Cache updates with fresh data
3. UI updates automatically

## Error Handling

### Network Errors
```typescript
if (error.code === 'NETWORK_ERROR') {
  showToast('No internet connection');
}
```

### API Errors
```typescript
if (error.response?.status === 401) {
  // Unauthorized - logout user
}
if (error.response?.status === 404) {
  showToast('Product not found');
}
```

### Timeout Errors
```typescript
timeout: 10000 // 10 seconds
```

## API Response Types

TypeScript types in `/src/types/api.ts`:

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
```

## Testing API Calls

### Mock API in Tests

```typescript
jest.mock('@/api/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));
```

### Test API Hooks

```typescript
test('useProducts fetches products', async () => {
  const { result } = renderHook(() => useProducts());
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

## Best Practices

✅ **Do:**
- Use React Query for all API calls
- Handle errors gracefully
- Show loading states
- Cache data appropriately
- Type API responses

❌ **Don't:**
- Store API data in Redux
- Make API calls directly in components
- Ignore error states
- Skip loading indicators

## Next Steps

- Learn about [State Management](./state-management.md)
- Check [Testing](./testing.md) guide
- Review [Troubleshooting](./troubleshooting.md)
