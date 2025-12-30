import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_CATEGORY } from "../../constant/data";

const initialState = {
  countryId: 1,
  category: DEFAULT_CATEGORY,
  // language: localStorage.getItem("language"),
  language: localStorage.getItem("language") || "en",
  country_id:1,
  isEmployee: false
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserData: (state, action) => {
      return { ...state, ...action.payload };
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("isEmployee");
      return initialState;
    },
  },
});

export const { updateUserData, logout } = user.actions;

export const selectUser = (state) => state.user;

export default user.reducer;
