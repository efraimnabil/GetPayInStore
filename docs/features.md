# Features

This document describes all the features available in the GetPayInStore app.

## 🔐 Authentication

### Login
- Secure login using DummyJSON API
- Username and password authentication
- Token stored securely in device keychain
- Session persists across app restarts

### Biometric Authentication
- **Face ID** (iOS) or **Fingerprint** (Android)
- Falls back to password if biometric fails
- Demo password: `1234`
- Prompt appears on app launch if session exists

### Auto-Lock
The app automatically locks for security:
- After **10 seconds** of inactivity
- When app goes to background
- Requires biometric or password to unlock

### Logout
- Clears all stored credentials
- Removes cached data
- Returns to login screen

## 📦 Product Management

### All Products Screen
- Displays complete list of products
- Shows product image, title, and price
- **Pull-to-refresh** to update data
- Loads from cache instantly
- Updates in background

### Category Screen
- Shows products filtered by **smartphones** category
- Same features as All Products
- Pull-to-refresh enabled
- Offline support

### Product Details
Each product card shows:
- Product image
- Product name
- Price
- Delete button (superadmin only)

### Delete Products
- Only available to **superadmin** user (`emilys`)
- Tap delete button on any product
- Confirmation required
- Updates immediately

## 📱 Offline Support

### How It Works
1. App fetches data from API
2. Data is cached in memory (React Query)
3. Cache persisted to device (MMKV)
4. Next launch shows cached data instantly
5. Background update fetches fresh data

### Offline Indicators
- **Banner** appears at top when offline
- Shows on Products and Category screens
- Automatically dismisses when back online

### What Works Offline
✅ View all products (cached)
✅ View category products (cached)
✅ Navigate between screens
✅ Logout

❌ Login (requires network)
❌ Delete products (requires network)
❌ Refresh data (requires network)

## 🎨 User Interface

### Design System
- Custom theme with consistent colors
- Responsive layout
- Smooth animations
- Loading states
- Error handling

### Toast Notifications
User-friendly messages for:
- Login success/failure
- Network errors
- Delete confirmation
- API errors

### Loading States
- Spinner while fetching data
- Skeleton screens (optional)
- Pull-to-refresh indicator

### Error Handling
- Clear error messages
- Retry options
- Graceful degradation

## 👥 User Roles

### Superadmin (`emilys`)
- Can view all products
- Can delete any product
- Special privileges

### Regular Users
- Can view all products
- Cannot delete products
- Read-only access

## 🔔 Notifications

Toast messages appear for:
- Successful login
- Login errors
- Network issues
- Delete operations
- API failures

## 🌐 Network Features

### Connection Detection
- Monitors network status
- Shows offline banner when disconnected
- Automatically retries when reconnected

### API Integration
- REST API using Axios
- Automatic token injection
- Error interceptors
- Retry logic

## 🔒 Security Features

### Secure Storage
- Tokens stored in device keychain (iOS) or Keystore (Android)
- Never stored in plain text
- Cleared on logout

### Auto-Lock
- Prevents unauthorized access
- Configurable timeout (currently 10 seconds)
- Background lock

### Biometric Protection
- Device-level security
- No passwords stored in app
- Falls back to password if needed

## Next Steps

- Learn about [API Integration](./api-integration.md)
- Understand [State Management](./state-management.md)
- Check [Testing](./testing.md) guide
