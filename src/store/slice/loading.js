import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loader: false,
};

export const loading = createSlice({
  name: "loading",
  initialState,
  reducers: {
    updateLoader: (state, action) => {
      // return { ...state, ...action.payload };
      return false
    },
  },
});

export const { updateLoader } = loading.actions;

export const selectLoading = (state) => state.loading;

export default loading.reducer;
