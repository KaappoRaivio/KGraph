import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    isMobile: window.innerWidth < 600,
    isDev: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
    addInputPressed: false,
  },
  reducers: {
    sidebarToggled: (state, action) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    mobileStatusChanged: (state, action) => {
      console.log("IS MOBILE", action.payload.isMobile);
      state.isMobile = action.payload.isMobile;
    },
    addInputPressed: (state, action) => {
      const { pressed } = action.payload;
      state.addInputPressed = pressed;
    },
  },
});

export const { sidebarToggled, mobileStatusChanged, addInputPressed } = uiSlice.actions;
export default uiSlice.reducer;
