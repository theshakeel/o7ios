// store/slice/ui.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    authModalOpen: false,
  },
  reducers: {
    openAuthModal: (state) => {
      state.authModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false;
    },
  },
});

export const { openAuthModal, closeAuthModal } = uiSlice.actions;
export default uiSlice.reducer;
