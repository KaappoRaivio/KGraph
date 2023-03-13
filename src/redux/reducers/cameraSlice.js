import { createSlice } from "@reduxjs/toolkit";

const cameraSlice = createSlice({
  name: "camera",
  initialState: { current: { x: 0, y: 0, zoom: -4 }, dragInProgress: false },
  reducers: {
    cameraChanged: (state, action) => {
      state.current = action.payload;
      state.dragInProgress = false;
    },

    // cameraDragged: (state, action) => {
    //   state.dragInProgress = true;
    //   state.drag = action.payload;
    // },
  },
});

export const { cameraChanged, cameraDragged } = cameraSlice.actions;
export default cameraSlice.reducer;