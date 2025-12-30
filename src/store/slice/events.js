import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const events = createSlice({
  name: "events",
  initialState,
  reducers: {
    getEvents: (state, action) => {
      let data = action?.payload?.data?.filter((item) => item?.status);
      return { ...state, ...action?.payload, data };
    },
//    getEvents: (state, action) => {
//   const originalEvents =
//     action?.payload?.data?.filter((item) => item?.status) || [];
//   const fakeEvents = originalEvents.flatMap((item) => {
//     if (item?.category?.id === 1) {
//       return Array.from({ length: 11 }, (_, i) => {
//         const newId = i + 2; // 2..12
//         return {
//           ...item,
//           category: { ...item.category, id: newId },
//         };
//       });
//     }
//     return [];
//   });

//   const combinedData = [...originalEvents, ...fakeEvents];
//   // update state
//   return {
//     ...state,
//     ...action.payload,
//     data: combinedData,
//   };
// },

  },
});

export const { getEvents } = events.actions;

export const selectEventsData = (state) => state.events;

export default events.reducer;
