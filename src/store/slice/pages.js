import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const pages = createSlice({
  name: "pages",
  initialState,
  reducers: {
    getPages: (state, action) => {
      console.log("getting pages")
      let data = action.payload.filter((item) => item.status);
      return data;
    },
  },
});

export const { getPages } = pages.actions;

export const selectPages = (state) => state.pages;

export default pages.reducer;
