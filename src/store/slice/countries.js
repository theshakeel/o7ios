import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const countries = createSlice({
  name: "countries",
  initialState,
  reducers: {
    getCountries: (state, action) => {
      return action.payload;
    },
  },
});

export const { getCountries } = countries.actions;

export const selectCountries = (state) => state.countries;

export default countries.reducer;
