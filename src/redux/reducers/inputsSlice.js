import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toGlsl from "../../workers/toGlslPromise";
import { v4 as uuid } from "uuid";

const inputsSlice = createSlice({
  name: "inputs",
  initialState: [
    { name: "f(x)", rawInput: "", glslSource: "", type: "function", key: uuid(), color: "#ff7faf" },
    { name: "g(x)", rawInput: "", glslSource: "", type: "function", key: uuid(), color: "#af7fff" },
    { name: "a", max: 10, min: -10, value: 0, step: 0.01, type: "slider", key: uuid() },
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
      console.log("SliderChanged", index, value, name);
    },
    // sliderInputAdded: (state, action) => {},
    inputRemoved: (state, action) => {
      const { index } = action.payload;
      state.splice(index, 1);
    },
  },
  extraReducers: builder => {
    builder.addCase(functionInputChanged.fulfilled, (state, action) => {
      const { index, glslSource } = action.payload;
      console.log("InputChanged fulfilled", index, glslSource);
      if (glslSource != null) state[index].glslSource = glslSource;
    });
  },
});

const { functionInputAdded, functionRawInputChanged, inputSet, sliderChanged, inputRemoved } = inputsSlice.actions;
export { functionInputAdded, inputSet, sliderChanged, inputRemoved };
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
