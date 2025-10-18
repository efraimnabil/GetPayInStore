import { User } from '@/types/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: User | null;
  isSuperadmin: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isSuperadmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User | null; token: string; superadminUser?: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Only update isSuperadmin if user exists and superadminUser is provided
      if (action.payload.user && action.payload.superadminUser) {
        state.isSuperadmin = action.payload.user.username === action.payload.superadminUser;
      } else if (!action.payload.user) {
        // If user is null (during session restoration), keep isSuperadmin as is
        // It will be updated when the full user data is set
        state.isSuperadmin = false;
      }
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isSuperadmin = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;