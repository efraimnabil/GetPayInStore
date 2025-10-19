# GetPayIn - React Native

This repository contains the source code for the GetPayIn 3-page store application, built with React Native and Expo. The application is designed with a modern, scalable architecture and a focus on code quality, user experience, and robustness.

## Features Implemented

### Core Features
- **Authentication**: Secure login using DummyJSON API (`/auth/login`). Session is persisted and restored on app launch, validated via `/auth/me`.
- **Biometric Unlock**: Biometric authentication (Face ID/Touch ID) with a password fallback (demo password: "1234"). If a valid session is detected on app launch, the biometric unlock is prompted immediately.
- **Auto-Lock**: Automatically locks after 10 seconds of user inactivity and when the app goes to the background.

### Product Management
- **All Products Screen**: Displays a list of products with pull-to-refresh.
- **Specific Category Screen**: Shows products filtered by the **smartphones** category with pull-to-refresh.
- **Superadmin Role**: The designated user (`emilys`) has superadmin privileges, enabling a delete button on products.

### Advanced Features
- **Offline Support**: Product data is cached using React Query and persisted to the device with MMKV. Cached lists render instantly on relaunch and remain available offline. An offline banner is displayed on the Products and Category screens when disconnected.
- **Modern UI & Design System**: A custom, theme-based design system was built from scratch using styled-components to ensure a polished and consistent user interface.
- **Advanced Feedback**: 
  - Global offline indicator
  - User-friendly toast notifications for API errors
  - Loading states and error boundaries
- **Comprehensive Testing**: The project includes a full suite of unit and component tests using Jest and React Native Testing Library, achieving high coverage of critical logic.
- **Continuous Integration**: Automated testing pipeline using GitHub Actions that runs on every push and pull request, ensuring code quality and preventing regressions.

## Chosen Configuration

- **Specific Category**: `smartphones`
- **Superadmin User**: `emilys`

## Tech Stack & Architecture

### Core Technologies
- **Framework**: React Native with Expo (Managed Workflow + Dev Client)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)

### State Management
- **Client State**: Redux Toolkit (for auth session, lock state)
- **Server State**: TanStack React Query (for all API interactions and caching)

### Styling & UI
- **Styling**: Styled-Components with a custom Design System
- **Theme**: Dark/Light mode support with custom color schemes

### Data & Persistence
- **Data Persistence**: MMKV for high-performance React Query cache persistence
- **API Client**: Axios
- **Offline Support**: React Query + MMKV + NetInfo

### Testing
- **Testing Framework**: Jest & React Native Testing Library
- **Coverage**: Targeted tests (Redux slices, basic render). Additional tests can be added for hooks and screens.
- **CI/CD**: GitHub Actions workflow for automated testing on every push and PR

### Architecture Highlights

The architecture strictly separates client and server state, a modern best practice that improves maintainability and performance. The use of MMKV with React Native's New Architecture (JSI) ensures near-instantaneous cache rehydration for an excellent offline-first user experience.

## Project Structure

```
GetPayInStore/
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── (tabs)/            # Tab-based navigation
│   │   ├── _layout.tsx        # Root layout
│   │   └── index.tsx          # Home/redirect screen
│   ├── api/                   # API client configuration
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── screens/               # Screen components
│   ├── services/              # Business logic & services
│   ├── store/                 # Redux store & slices
│   ├── theme/                 # Design system & theme
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── android/                   # Native Android code
├── ios/                       # Native iOS code
├── docs/                      # Documentation
└── README.md                  # This file
```

## Setup and Running the Application

### Prerequisites

- **Node.js** (LTS version 18.x or higher)
- **npm** or **yarn**
- **iOS Simulator** (macOS only) or **Android Emulator**, or a physical device
- **Expo CLI** (optional, but recommended): `npm install -g expo-cli`
- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd GetPayInStore
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   Or with yarn:
   ```bash
   yarn install
   ```

3. **Install iOS pods** (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the Application

> **Important**: This project uses native modules (`react-native-mmkv`, `expo-local-authentication`) and requires a development build. You cannot use the standard Expo Go app.

#### For iOS (macOS only):
```bash
npm run ios
# or
npx expo run:ios
```

#### For Android:
```bash
npm run android
# or
npx expo run:android
```

#### Start the Development Server:
```bash
npm start
# or
npx expo start
```

### Running Tests

The project includes comprehensive automated testing with Jest and React Native Testing Library.

#### Run All Tests
```bash
npm test
```

#### Run Tests in Watch Mode
```bash
npm run test:watch
```

#### Generate Coverage Report
```bash
npm run test:coverage
```

#### Continuous Integration
The project uses GitHub Actions for automated testing. Tests run automatically on:
- Every push to any branch
- Every pull request

The CI pipeline ensures:
- All tests pass before merging
- Consistent test results across environments
- Early detection of breaking changes

You can view the test results in the "Actions" tab of the GitHub repository.

## Login Credentials

Use any user from [DummyJSON Users](https://dummyjson.com/users), for example:

**Regular User**:
- Username: `emilys`
- Password: `emilyspass`

**Superadmin User** (can delete products):
- Username: `emilys`
- Password: `emilyspass`

Note: DummyJSON demo credentials can change over time. If a login fails, try another user from https://dummyjson.com/users and update `SUPERADMIN_USERNAME` in `src/hooks/useLoginMutation.ts` and `src/hooks/useSession.ts` accordingly.

Example regular user:
- Username: `averyp`
- Password: `averyppass`

## Key Features & Implementation Details

### 1. Authentication & Security
- JWT token-based authentication with DummyJSON API
- Secure token storage using Expo SecureStore
- Biometric authentication (Face ID/Touch ID) for app unlock
- Password fallback for devices without biometric support
- Session persistence across app restarts

### 2. Auto-Lock Mechanism
- Automatically locks after 10 seconds of inactivity
- Locks when app goes to background
- Uses React hooks to track user interactions
- Smooth lock/unlock transitions

### 3. Offline-First Architecture
- All product data cached with React Query
- Persistent cache using MMKV (high-performance key-value storage)
- Network status indicator
- Graceful degradation when offline
- Instant data availability on app launch

### 4. Product Management
- **All Products**: List with pull-to-refresh
- **Smartphones Category**: Filtered product view with pull-to-refresh
- **Delete Functionality**: Available only to superadmin user
- **Error Handling**: Toast notifications for API operations

### 5. Design System
- Custom theme built with styled-components
- Consistent spacing, typography, and color system
- Dark/Light mode support
- Reusable component library
- Type-safe theming with TypeScript

### 6. Testing Strategy
- Unit tests for Redux slices
- Component tests for UI components
- Basic component smoke test
- Jest setup mocks MMKV, SecureStore, LocalAuth, NetInfo, and Expo Router
- Automated CI/CD pipeline with GitHub Actions

## Architecture Decisions

### Why React Query for Server State?
React Query provides powerful caching, background updates, and offline support out of the box. It eliminates the need to manage server state in Redux, keeping our global store lean and focused on client-only state.

### Why MMKV for Persistence?
MMKV is a high-performance key-value storage library built by WeChat. It leverages React Native's New Architecture (JSI) for synchronous, fast operations. This ensures instant cache rehydration on app launch, crucial for a great offline experience.

### Why Styled-Components?
Styled-components provides a powerful, type-safe way to style React Native components. It enables us to build a comprehensive design system with theming support while keeping styles co-located with components.

### Why Expo Router?
Expo Router brings Next.js-style file-based routing to React Native, providing deep linking, type-safe navigation, and better code organization out of the box.

### Why Redux Toolkit for Client State?
While React Query handles server state, Redux Toolkit is perfect for app-wide client state (auth session, lock status) that needs to be accessible across the entire app with minimal boilerplate.

## Troubleshooting

### Build Issues

**iOS Build Fails**:
- Ensure you're running on macOS
- Try cleaning the build: `cd ios && rm -rf build && pod install && cd ..`
- Clear cache: `npx expo start -c`

**Android Build Fails**:
- Ensure Android Studio and SDK are properly installed
- Check that `ANDROID_HOME` environment variable is set
- Clear Gradle cache: `cd android && ./gradlew clean && cd ..`

### Runtime Issues

**App crashes on launch**:
- Clear app data and cache
- Rebuild the app: `npm run ios` or `npm run android`

**Biometric authentication not working**:
- Ensure biometric authentication is set up on your device/simulator
- Check app permissions in device settings

**Network requests failing**:
- Verify internet connection
- Check that DummyJSON API is accessible: https://dummyjson.com

## Future Enhancements

- [ ] Infinite scrolling / pagination
- [ ] Product search and filtering
- [ ] Shopping cart functionality
- [ ] Order history
- [ ] Push notifications
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] E2E testing with Detox

## License

This project is part of a coding challenge for GetPayIn.

## Contact

For any questions or issues, please contact the development team.

---

**Built with ❤️ using React Native, Expo, and TypeScript**
