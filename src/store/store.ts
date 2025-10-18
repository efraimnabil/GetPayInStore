import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import lockReducer from './slices/lockSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lock: lockReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;