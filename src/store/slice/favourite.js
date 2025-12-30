import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const favourite = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    getFavourite: (state, action) => {
      let data = action?.payload?.filter((item) => item?.status);
      return data;
    },
  },
});

export const { getFavourite } = favourite.actions;

export const selectFavourite = (state) => state.favourite;

export default favourite.reducer;
