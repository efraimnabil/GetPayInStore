import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LockState {
  isLocked: boolean;
}

const initialState: LockState = {
  isLocked: false,
};

const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    setLocked(state, action: PayloadAction<boolean>) {
      state.isLocked = action.payload;
    },
  },
});

export const { setLocked } = lockSlice.actions;
export default lockSlice.reducer;