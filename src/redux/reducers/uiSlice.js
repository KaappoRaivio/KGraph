import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    isMobile: window.innerWidth < 600,
    isDev: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
    helpPressed: false,
    addInputPressed: false,
    webgl2Supported: true,
  },
  reducers: {
    sidebarToggled: (state, action) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    mobileStatusChanged: (state, action) => {
      state.isMobile = action.payload.isMobile;
    },
    addInputPressed: (state, action) => {
      const { pressed } = action.payload;
      state.addInputPressed = pressed;
    },
    helpOpened: (state, action) => {
      state.helpPressed = true;
    },
    helpClosed: (state, action) => {
      state.helpPressed = false;
    },
    webglSupportDetected: (state, action) => {
      state.webgl2Supported = action.payload;
    },
  },
});

export const { sidebarToggled, mobileStatusChanged, addInputPressed, helpClosed, helpOpened, webglSupportDetected } = uiSlice.actions;
export default uiSlice.reducer;
