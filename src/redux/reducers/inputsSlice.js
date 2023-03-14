import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toGlsl from "../../workers/toGlslPromise";
import { v4 as uuid } from "uuid";
import randomcolor from "randomcolor";

const inputsSlice = createSlice({
  name: "inputs",
  initialState: [
    // { name: "f(x)", rawInput: "", glslSource: "", type: "function", key: uuid(), color: "#ff7faf" },
    // { name: "g(x)", rawInput: "", glslSource: "", type: "function", key: uuid(), color: "#af7fff" },
    { name: "a", max: 10, min: -10, value: 0, step: 0.01, type: "slider", key: uuid(), color: "#12f422" },
    { name: "fractallol", type: "fractal", selected: "julia", details: { ci: "0", cr: "0" }, key: uuid(), color: "#000000" },
  ],
  reducers: {
    inputSet: (state, action) => {
      state = action.payload;
    },
    functionInputAdded: (state, action) => {
      const { name } = action.payload;
      state.push({
        type: "function",
        name,
        rawInput: "",
        glslSource: "",
        color: randomcolor({ luminosity: "light" }),
        key: uuid(),
      });
    },
    functionRawInputChanged: (state, action) => {
      const { index, rawInput } = action.payload;
      state[index].rawInput = rawInput;
    },
    sliderChanged: (state, action) => {
      const { index, value, name, max, min, step } = action.payload;

      if (value != null) state[index].value = value;
      if (name != null) state[index].name = name;
      if (max != null) state[index].max = max;
      if (min != null) state[index].min = min;
      if (step != null) state[index].step = step;
      // console.log("SliderChanged", index, value, name);
    },
    sliderInputAdded: (state, action) => {
      const { name } = action.payload;

      state.push({ name, max: 10, min: -10, value: 0, step: 0.01, type: "slider", key: uuid(), color: randomcolor({ luminosity: "light" }) });
    },
    inputRemoved: (state, action) => {
      const { index } = action.payload;
      state.splice(index, 1);
    },
    fractalInputAdded: (state, action) => {
      state.push({
        type: "fractal",
        details: { ci: "0", cr: "0" },
        color: "#000000",
      });
    },
    fractalInputChanged: (state, action) => {
      const { index, details, selected } = action.payload;
      // console.log(index, details, selected);

      if (details != null) state[index].details = details;
      if (selected != null) state[index].selected = selected;
    },
  },
  extraReducers: builder => {
    builder.addCase(functionInputChanged.fulfilled, (state, action) => {
      const { index, glslSource } = action.payload;
      // console.log("InputChanged fulfilled", index, glslSource);
      if (glslSource != null) state[index].glslSource = glslSource;
    });
  },
});

const {
  functionInputAdded,
  functionRawInputChanged,
  inputSet,
  sliderChanged,
  inputRemoved,
  sliderInputAdded,
  fractalInputAdded,
  fractalInputChanged,
} = inputsSlice.actions;
export { functionInputAdded, inputSet, sliderChanged, inputRemoved, sliderInputAdded, fractalInputAdded, fractalInputChanged };
export const functionInputChanged = createAsyncThunk("inputs/functionInputChanged", async (input, { dispatch, getState }) => {
  dispatch(functionRawInputChanged(input));

  let glslSource;
  try {
    glslSource = await toGlsl(input.rawInput);
  } catch (e) {
    console.log("Caught");
    // glslSource = "";
  }
  return {
    glslSource,
    index: input.index,
  };
});

export default inputsSlice.reducer;
