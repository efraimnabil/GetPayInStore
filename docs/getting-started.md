# Getting Started

This guide will help you set up and run the GetPayInStore app.

## Prerequisites

Before you start, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **iOS Simulator** (Mac only) or **Android Emulator**
- **Xcode** (for iOS, Mac only)
- **Android Studio** (for Android)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GetPayInStore
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npm start
# or
yarn start
```

This will open the Expo development tools in your browser.

### 4. Run on Device/Simulator

**For iOS:**
```bash
npm run ios
# or
yarn ios
```

**For Android:**
```bash
npm run android
# or
yarn android
```

## First Time Login

When you first open the app:

1. You'll see the login screen
2. Use these credentials:
   - **Username:** `emilys`
   - **Password:** `emilyspass`
3. After login, you'll be asked to set up biometric authentication
4. Grant biometric permissions to use Face ID/Touch ID

## Default Users

The app uses DummyJSON API for demo data. Here are some users you can try:

- **Superadmin:** `emilys` / `emilyspass` (can delete products)
- **Regular User:** `michaelw` / `michaelwpass`

## Testing the App

Run the test suite:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Next Steps

- Read about [Features](./features.md) to see what the app can do
- Check out the [Architecture](./architecture.md) to understand how it works
- Learn about [API Integration](./api-integration.md) to see how data flows
