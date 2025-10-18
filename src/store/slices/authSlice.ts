import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/api';

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
    setCredentials(state, action: PayloadAction<{ user: User; token: string; superadminUser: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isSuperadmin = action.payload.user.username === action.payload.superadminUser;
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