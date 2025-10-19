# State Management

This document explains how the app manages state.

## Two-State Strategy

The app uses **two separate state managers** for different types of state:

### 1. Redux Toolkit (Local/UI State)
For app-level state that doesn't come from an API:
- User authentication info
- Lock screen state
- UI preferences

### 2. React Query (Server State)
For data from the API:
- Products
- Categories
- Any API data

This separation is a **modern best practice** that:
- Keeps code organized
- Improves performance
- Makes testing easier
- Reduces complexity

## Redux Store

Location: `/src/store/`

### Store Configuration

```typescript
// store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    lock: lockReducer,
  },
});
```

### Auth Slice

Located in `/src/store/slices/authSlice.ts`

**State:**
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
}
```

**Actions:**
- `setCredentials(user)` - Save user info after login
- `clearCredentials()` - Clear user info on logout

**Example Usage:**
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';

function LoginScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const handleLogin = (userData) => {
    dispatch(setCredentials(userData));
  };
}
```

### Lock Slice

Located in `/src/store/slices/lockSlice.ts`

**State:**
```typescript
{
  isLocked: boolean,
}
```

**Actions:**
- `lockApp()` - Lock the app
- `unlockApp()` - Unlock the app

**Example Usage:**
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { lockApp, unlockApp } from '@/store/slices/lockSlice';

function useAutoLock() {
  const dispatch = useDispatch();
  const isLocked = useSelector((state) => state.lock.isLocked);
  
  const lock = () => dispatch(lockApp());
  const unlock = () => dispatch(unlockApp());
}
```

## React Query

Location: `/src/hooks/` and `/src/services/queryClient.ts`

### Query Client Setup

```typescript
// queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Keys

Query keys identify cached data:

```typescript
['products']                    // All products
['products', 'category', 'smartphones']  // Category products
['user']                        // Current user
```

### Fetching Data (Queries)

**All Products:**
```typescript
// useProducts.ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });
}

// Usage in component
function ProductsScreen() {
  const { data, isLoading, error, refetch } = useProducts();
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <ProductList products={data.products} />;
}
```

**Category Products:**
```typescript
// useProductsByCategory.ts
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const { data } = await api.get(`/products/category/${category}`);
      return data;
    },
  });
}
```

### Mutating Data (Mutations)

**Delete Product:**
```typescript
// useDeleteProductMutation.ts
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      // Refresh products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast('Product deleted');
    },
    onError: (error) => {
      showToast('Failed to delete product');
    },
  });
}

// Usage in component
function ProductCard({ product }) {
  const deleteMutation = useDeleteProductMutation();
  
  const handleDelete = () => {
    deleteMutation.mutate(product.id);
  };
  
  return (
    <Button 
      onPress={handleDelete}
      loading={deleteMutation.isPending}
    >
      Delete
    </Button>
  );
}
```

## Persistent Cache (MMKV)

Location: `/src/services/queryPersister.ts`

### Why MMKV?

- **Fast**: JSI-based, faster than AsyncStorage
- **Synchronous**: No async overhead
- **Persistent**: Survives app restarts
- **Efficient**: Optimized for React Native

### Setup

```typescript
import { MMKV } from 'react-native-mmkv';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const storage = new MMKV();

export const mmkvPersister = createSyncStoragePersister({
  storage: {
    setItem: (key, value) => storage.set(key, value),
    getItem: (key) => storage.getString(key) ?? null,
    removeItem: (key) => storage.delete(key),
  },
});
```

### Persisting Queries

```typescript
import { persistQueryClient } from '@tanstack/react-query-persist-client';

persistQueryClient({
  queryClient,
  persister: mmkvPersister,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

Now all queries are automatically cached to device storage!

## Data Flow

### Login Flow
```
User logs in
    ↓
API call (React Query)
    ↓
Token saved (SecureStore)
    ↓
User saved (Redux)
    ↓
Navigate to app
```

### Product Fetch Flow
```
Component mounts
    ↓
useProducts() hook
    ↓
Check cache (MMKV)
    ↓
Cache hit? → Return cached data (instant)
    ↓
Cache miss? → Fetch from API
    ↓
Update cache (MMKV)
    ↓
Render products
```

### Delete Product Flow
```
User taps delete
    ↓
useDeleteProductMutation()
    ↓
API call
    ↓
Success? → Invalidate cache
    ↓
React Query refetches
    ↓
UI updates automatically
```

## Best Practices

### ✅ Do:
- Use Redux for UI/app state
- Use React Query for API data
- Create custom hooks for data fetching
- Use proper query keys
- Handle loading and error states

### ❌ Don't:
- Store API data in Redux
- Make API calls in Redux actions
- Ignore cache invalidation
- Mix state management approaches

## Testing State

### Testing Redux
```typescript
import { store } from '@/store/store';
import { setCredentials } from '@/store/slices/authSlice';

test('auth state updates', () => {
  const user = { id: 1, username: 'test' };
  store.dispatch(setCredentials(user));
  expect(store.getState().auth.user).toEqual(user);
});
```

### Testing React Query
```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useProducts } from '@/hooks/useProducts';

test('fetches products', async () => {
  const { result } = renderHook(() => useProducts());
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data.products).toHaveLength(30);
});
```

## Next Steps

- Learn about [Testing](./testing.md)
- Check [API Integration](./api-integration.md)
- Review [Troubleshooting](./troubleshooting.md)
