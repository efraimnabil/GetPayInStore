# Architecture

This document explains how the GetPayInStore app is structured.

## Project Structure

```
GetPayInStore/
├── src/
│   ├── app/              # App screens (Expo Router - file-based routing)
│   ├── api/              # API client setup
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Theme, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Business logic & API services
│   ├── store/            # Redux state management
│   ├── theme/            # Design system, theme definitions & styled-components
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── android/              # Native Android code
├── ios/                  # Native iOS code
└── docs/                 # Documentation (you are here!)
```

## Key Folders Explained

### `/src/app/` - Screens (Expo Router)
Uses Expo Router for file-based navigation. **All screens live here**:
- `index.tsx` - Login screen (root entry point)
- `_layout.tsx` - Root layout with theme provider & authentication
- `(tabs)/` - Main app tabs (Products, Category, Account)
  - `products.tsx` - Products list screen
  - `account.tsx` - User account/profile screen with theme toggle
  - `category.tsx` - Categories screen
- `modal.tsx` - Modal screens

**Note**: With Expo Router, the file structure in `app/` defines the routes automatically.

### `/src/components/` - UI Components
Reusable components used throughout the app:
- `AppButton.tsx` - Styled button component
- `AppText.tsx` - Styled text component
- `FormInput.tsx` - Input fields for forms
- `ProductCard.tsx` - Product display card with theme support
- `LockScreenOverlay.tsx` - Biometric lock screen with gradient

### `/src/contexts/` - React Contexts
Global state management using React Context:
- `ThemeContext.tsx` - Theme provider with dark/light mode toggle
  - Manages theme state (light/dark)
  - Persists theme preference using MMKV
  - Provides `useTheme()` hook

### `/src/theme/` - Design System
Theme definitions and styled-components setup:
- `theme.ts` - Light and dark theme definitions (colors, spacing, shadows, etc.)
- `styled-components.d.ts` - TypeScript definitions for theme

### `/src/hooks/` - Custom Hooks
React hooks for specific functionality:
- `useSession.ts` - Manages user authentication session
- `useProducts.ts` - Fetches all products
- `useProductsByCategory.ts` - Fetches category products
- `useAutoLock.ts` - Handles auto-lock behavior
- `useLoginMutation.ts` - Login API call
- `useDeleteProductMutation.ts` - Delete product API call

### `/src/store/` - Redux Store
Local state management:
- `store.ts` - Redux store configuration
- `slices/authSlice.ts` - Authentication state
- `slices/lockSlice.ts` - App lock state

### `/src/services/` - Services
Business logic and utilities:
- `auth.ts` - Authentication helpers (token storage, logout)
- `queryClient.ts` - React Query configuration
- `queryPersister.ts` - MMKV cache persistence

### `/src/api/` - API Client
API communication:
- `api.ts` - Axios instance with interceptors
- `index.ts` - API endpoints

## How It Works

### 1. Authentication Flow

```
User Opens App
    ↓
Check Stored Token
    ↓
Token Exists? → Yes → Validate with /auth/me
    ↓                       ↓
    No                   Success → Show Lock Screen
    ↓                       ↓
Show Login              Biometric Auth
    ↓                       ↓
Login Success           Unlock → Show App
    ↓
Store Token
    ↓
Show App
```

### 2. State Management Strategy

The app uses **two separate state managers**:

**Redux Toolkit** (Local State):
- User authentication info
- Lock screen state
- App-level UI state

**React Query** (Server State):
- Product data from API
- Caching and synchronization
- Loading and error states

This separation is a modern best practice that keeps concerns separated and code cleaner.

### 3. Data Flow

```
API Request
    ↓
React Query
    ↓
MMKV Cache (persisted)
    ↓
UI Components
    ↓
User sees data instantly
```

### 4. Offline Support

The app works offline using:
1. **React Query** - Caches API responses in memory
2. **MMKV** - Persists cache to device storage
3. **NetInfo** - Detects network status
4. **Offline Banner** - Shows when disconnected

## Design Patterns

### Component Composition
Components are small and focused on one task. They compose together to build screens.

### Custom Hooks
Business logic is extracted into hooks for reusability and testability.

### Type Safety
TypeScript ensures type safety throughout the app, catching errors at compile time.

### Error Boundaries
Errors are caught and handled gracefully with user-friendly messages.

## Navigation

Uses **Expo Router** with file-based routing:
- Files in `/src/app/` become screens
- Folders with `()` are route groups
- `_layout.tsx` files define layouts
- Navigation is type-safe and automatic

## Styling

Uses **Styled Components** with a theme system:
- Centralized theme in `/src/theme/`
- Dark/Light mode support
- Consistent spacing and colors
- Type-safe styling

## Next Steps

- Learn about [Features](./features.md)
- Understand [State Management](./state-management.md) in detail
- Check [API Integration](./api-integration.md)
