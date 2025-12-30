import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  oldTickets: [],
  upcomingTickets: [],
  ticketDetail: {},
};

export const user = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    getOldTicketsData: (state, action) => {
      return { ...state, oldTickets: action.payload };
    },
  },
});

export const { getOldTicketsData, logout } = user.actions;

export const selectUser = (state) => state.tickets;

export default user.reducer;
