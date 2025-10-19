// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  const storage = new Map();
  
  const MMKV = {
    set: jest.fn((key, value) => {
      storage.set(key, value);
    }),
    getString: jest.fn((key) => {
      return storage.get(key) || undefined;
    }),
    getNumber: jest.fn((key) => {
      const value = storage.get(key);
      return typeof value === 'number' ? value : undefined;
    }),
    getBoolean: jest.fn((key) => {
      const value = storage.get(key);
      return typeof value === 'boolean' ? value : undefined;
    }),
    delete: jest.fn((key) => {
      storage.delete(key);
    }),
    clearAll: jest.fn(() => {
      storage.clear();
    }),
    contains: jest.fn((key) => {
      return storage.has(key);
    }),
  };
  
  return { MMKV: jest.fn(() => MMKV) };
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

// Mock expo-local-authentication
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1])),
  SecurityLevel: {
    NONE: 0,
    SECRET: 1,
    BIOMETRIC_WEAK: 2,
    BIOMETRIC_STRONG: 3,
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  },
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSegments: jest.fn(() => []),
  useLocalSearchParams: jest.fn(() => ({})),
  useGlobalSearchParams: jest.fn(() => ({})),
  Link: jest.fn(({ children }) => children),
  Redirect: jest.fn(() => null),
}));