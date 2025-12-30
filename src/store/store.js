import { configureStore } from "@reduxjs/toolkit";
import {
  user,
  slides,
  countries,
  events,
  categories,
  loading,
  tickets,
  favourite,
  pages,
} from "./slice";
import uiReducer from "./slice/ui";
export const store = configureStore({
  reducer: {
    user,
    slides,
    ui: uiReducer,
    countries,
    events,
    categories,
    loading,
    tickets,
    favourite,
    pages,
  },
});
