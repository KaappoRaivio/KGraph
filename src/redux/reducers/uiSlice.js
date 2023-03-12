import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false, isMobile: window.innerWidth < 600 },
  reducers: {
    sidebarToggled: (state, action) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    mobileStatusChanged: (state, action) => {
      console.log("IS MOBILE", action.payload.isMobile);
      state.isMobile = action.payload.isMobile;
    },
  },
});

export const { sidebarToggled, mobileStatusChanged } = uiSlice.actions;
export default uiSlice.reducer;
