import { createSlice } from "@reduxjs/toolkit";

const slidersSlice = createSlice({
  name: "sliders",
  initialState: [{ max: 10, min: -10, value: 0, name: "a", step: 0.01 }],
  reducers: {
    sliderAdded: (state, action) => {
      const { name, max = 10, min = -10, step = 0.1 } = action.payload;
      state.push({ name, max, min, step, value: 0 });
    },
    sliderDeleted: (state, action) => {
      const { index } = action.payload;
      state.splice(index, 1);
    },
  },
});

export const { sliderAdded, sliderDeleted } = slidersSlice.actions;
export default slidersSlice.reducer;
