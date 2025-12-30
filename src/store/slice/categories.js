import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_CATEGORY } from "../../constant/data";

const initialState = [DEFAULT_CATEGORY];

export const categories = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getCategories: (state, action) => {
      let data = action.payload.filter((item) => item.status);
      return data; // overwrite previous state
    },

  },
});

export const { getCategories } = categories.actions;

export const selectCategories = (state) => state.categories;

export default categories.reducer;
