import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GLSLConversionManager, implicitEquationToGlsl, solidEquationToGlsl } from "../../workers/toGlslPromise";
import { v4 as uuid } from "uuid";
import getColor from "esthetics/color";

const conversionManager = new GLSLConversionManager();

const inputsSlice = createSlice({
  name: "inputs",
  initialState: [],
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
        color: getColor(state.length),
      });
    },
    functionRawInputChanged: (state, action) => {
      const { index, rawInput, color } = action.payload;

      if (rawInput != null) state[index].rawInput = rawInput;
      if (color != null) state[index].color = color;
    },
    powerSeriesRawInputChanged: (state, action) => {
      const { index, rawInput, color } = action.payload;

      if (rawInput != null) state[index].rawInput = rawInput;
      if (color != null) state[index].color = color;
    },
    sliderChanged: (state, action) => {
      const { index, value, name, max, min, step } = action.payload;

      if (value != null) state[index].value = value;
      if (name != null) state[index].name = name;
      if (max != null) state[index].max = max;
      if (min != null) state[index].min = min;
      if (step != null) state[index].step = step;
    },
    sliderInputAdded: (state, action) => {
      const { name } = action.payload;

      state.push({ name, max: 10, min: -10, value: 0, step: 0.01, type: "slider", color: getColor(state.length) });
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

      if (details != null) state[index].details = details;
      if (selected != null) state[index].selected = selected;
    },

    solidInputAdded: (state, action) => {
      const { name } = action.payload;
      state.push({
        type: "solid",
        name,
        rawInput: "",
        glslSource: "",
        color: getColor(state.length),
        min: "0",
        max: "1",
      });
    },
    solidRawInputChanged: (state, action) => {
      const { index, rawInput, min, max, color } = action.payload;

      if (rawInput != null) state[index].rawInput = rawInput;
      if (min != null) state[index].min = min;
      if (max != null) state[index].max = max;
      if (color != null) state[index].color = color;
    },
  },
  extraReducers: builder => {
    builder.addCase(functionInputChanged.fulfilled, (state, action) => {
      const { index, glslSource } = action.payload;
      if (glslSource != null) state[index].glslSource = glslSource;
    });
    builder.addCase(solidInputChanged.fulfilled, (state, action) => {
      const { index, glslSource } = action.payload;
      console.log("SolidInputChanged fulfilled", index, glslSource);
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
  solidInputAdded,
  solidRawInputChanged,
  powerSeriesRawInputChanged,
} = inputsSlice.actions;
export { functionInputAdded, inputSet, sliderChanged, inputRemoved, sliderInputAdded, fractalInputAdded, fractalInputChanged, solidInputAdded };
export const functionInputChanged = createAsyncThunk("inputs/functionInputChanged", async (input, { dispatch, getState }) => {
  dispatch(functionRawInputChanged(input));

  let glslSource;
  try {
    glslSource = await conversionManager.implicitEquationToGlsl(input.rawInput);
    console.log("GlslSource", glslSource);
  } catch (e) {
    glslSource = "";
  }

  return {
    glslSource,
    index: input.index,
  };
});

export const solidInputChanged = createAsyncThunk("inputs/solidInputChanged", async (input, { dispatch, getState }) => {
  dispatch(solidRawInputChanged(input));

  let glslSource;
  try {
    glslSource = await conversionManager.solidEquationToGlsl(input.rawInput);
  } catch (e) {
    glslSource = "";
  }

  return {
    glslSource,
    index: input.index,
  };
});

export const powerSeriesInputChanged = createAsyncThunk("inputs/powerSeriesInputChanged", async (input, { dispatch, getState }) => {
  dispatch(powerSeriesRawInputChanged(input));

  let glslSource;
  try {
    glslSource = await conversionManager.solidEquationToGlsl(input.rawInput);
  } catch (e) {
    glslSource = "";

    return {
      glslSource,
      index: input.index,
    };
  }
});

export default inputsSlice.reducer;
