# Testing

This document explains how testing works in the GetPayInStore app.

## Testing Stack

- **Jest** - Testing framework
- **React Native Testing Library** - Component testing
- **@testing-library/react-native** - Testing utilities
- **GitHub Actions** - Automated CI/CD

## Running Tests

### Run All Tests
```bash
npm test
# or
yarn test
```

### Watch Mode
```bash
npm run test:watch
# or
yarn test:watch
```

### Coverage Report
```bash
npm run test:coverage
# or
yarn test:coverage
```

This generates a coverage report showing which code is tested.

## Test Files Location

Tests are located next to the code they test:

```
src/
├── components/
│   ├── AppButton.tsx
│   └── __tests__/
│       └── AppButton.test.tsx
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── __tests__/
│   │       └── authSlice.test.tsx
```

## Types of Tests

### 1. Component Tests

Testing React components to ensure they render correctly.

**Example: Testing AppButton**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import AppButton from '../AppButton';

describe('AppButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(<AppButton title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton title="Click Me" onPress={onPress} />
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <AppButton title="Click Me" loading />
    );
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
```

### 2. Redux Slice Tests

Testing Redux reducers and actions.

**Example: Testing authSlice**
```typescript
import authReducer, { setCredentials, clearCredentials } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
  };

  it('should handle setCredentials', () => {
    const user = { id: 1, username: 'test' };
    const state = authReducer(initialState, setCredentials(user));
    
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle clearCredentials', () => {
    const state = {
      user: { id: 1, username: 'test' },
      isAuthenticated: true,
    };
    const newState = authReducer(state, clearCredentials());
    
    expect(newState.user).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
  });
});
```

### 3. Hook Tests

Testing custom React hooks.

**Example: Testing useProducts**
```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../useProducts';

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useProducts', () => {
  it('fetches products successfully', async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toBeDefined();
    expect(result.current.data.products).toBeArray();
  });

  it('handles errors', async () => {
    // Mock API to return error
    api.get.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useProducts(), { wrapper });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
```

### 4. API Tests

Testing API calls and responses.

**Example: Testing API client**
```typescript
import api from '@/api/api';

describe('API Client', () => {
  it('adds auth token to requests', async () => {
    const token = 'test-token';
    // Set token in storage
    
    await api.get('/products');
    
    expect(api.defaults.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('handles 401 errors', async () => {
    api.get.mockRejectedValueOnce({
      response: { status: 401 }
    });
    
    await expect(api.get('/products')).rejects.toThrow();
  });
});
```

## Mocking

### Mocking API Calls

```typescript
jest.mock('@/api/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

// In test
api.get.mockResolvedValueOnce({
  data: { products: [...] }
});
```

### Mocking Navigation

```typescript
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));
```

### Mocking SecureStore

```typescript
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
```

### Mocking MMKV

```typescript
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  })),
}));
```

## Testing Best Practices

### ✅ Do:

1. **Test User Behavior** - Test what users do, not implementation details
2. **Use Descriptive Test Names** - Make it clear what's being tested
3. **Arrange-Act-Assert** - Organize tests clearly
4. **Mock External Dependencies** - Mock APIs, storage, etc.
5. **Test Error States** - Don't just test happy paths
6. **Keep Tests Simple** - One concept per test

### ❌ Don't:

1. **Test Implementation Details** - Focus on behavior, not internals
2. **Write Brittle Tests** - Avoid tests that break with minor changes
3. **Skip Edge Cases** - Test boundary conditions
4. **Ignore Async Code** - Use `waitFor` for async operations
5. **Test Everything** - Focus on critical logic

## Test Structure

```typescript
describe('Component/Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks, clear state, etc.
  });

  // Group related tests
  describe('when user is logged in', () => {
    it('should show user profile', () => {
      // Arrange
      const user = { id: 1, username: 'test' };
      
      // Act
      const { getByText } = render(<Profile user={user} />);
      
      // Assert
      expect(getByText('test')).toBeTruthy();
    });
  });

  describe('when user is logged out', () => {
    it('should show login button', () => {
      // Test...
    });
  });
});
```

## Coverage Goals

Aim for:
- **Critical Logic**: 80-100% coverage
- **UI Components**: 60-80% coverage
- **Utilities**: 80-100% coverage

Don't obsess over 100% coverage - focus on testing important code paths.

## Continuous Integration

### GitHub Actions

The project has automated testing via GitHub Actions.

**On every push and PR:**
1. Install dependencies
2. Run linter
3. Run tests
4. Generate coverage report

Located in `.github/workflows/test.yml`:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Debugging Tests

### Run Single Test File
```bash
npm test -- AppButton.test.tsx
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="login"
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
}
```

## Common Testing Issues

### Issue: Async Tests Timeout
**Solution:** Use `waitFor` and increase timeout:
```typescript
await waitFor(() => expect(result.current.isSuccess).toBe(true), {
  timeout: 5000
});
```

### Issue: Tests Pass Locally but Fail in CI
**Solution:** Check for timing issues, ensure mocks are properly set up

### Issue: Cannot Find Module
**Solution:** Check Jest moduleNameMapper in `jest.config.js`

## Next Steps

- Check [Troubleshooting](./troubleshooting.md) for common issues
- Review [API Integration](./api-integration.md) for API testing patterns
- Learn about [State Management](./state-management.md) for state testing
