import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const slides = createSlice({
  name: "slides",
  initialState,
  reducers: {
    getSlides: (state, action) => {
      let data = action.payload.filter((item) => item.status);
      return data;
    },
  },
});

export const { getSlides } = slides.actions;

export const selectSlides = (state) => state.slides;

export default slides.reducer;
