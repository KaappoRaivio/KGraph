import { createSlice } from "@reduxjs/toolkit";

const cameraSlice = createSlice({
  name: "camera",
  initialState: { current: { x: 0, y: 0, zoom: -4 } },
  reducers: {
    cameraChanged: (state, action) => {
      state.current = action.payload;
    },
    zoomChanged: (state, action) => {
      state.current.zoom += action.payload;
    },
  },
});

export const { cameraChanged, zoomChanged } = cameraSlice.actions;
export default cameraSlice.reducer;
