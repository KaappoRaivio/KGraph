import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false, isMobile: window.innerWidth < 600, addInputPressed: false },
  reducers: {
    sidebarToggled: (state, action) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    mobileStatusChanged: (state, action) => {
      console.log("IS MOBILE", action.payload.isMobile);
      state.isMobile = action.payload.isMobile;
    },
    addInputPressed: (state, action) => {
      // console.log("Pressed");
      const { pressed } = action.payload;
      state.addInputPressed = pressed;
    },
  },
});

export const { sidebarToggled, mobileStatusChanged, addInputPressed } = uiSlice.actions;
export default uiSlice.reducer;
