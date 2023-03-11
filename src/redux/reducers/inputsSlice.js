import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toGlsl from "../../workers/toGlslPromise";

const inputsSlice = createSlice({
  name: "inputs",
  initialState: [{ name: "f(x)", rawInput: "", glslSource: "" }],
  reducers: {
    inputSet: (state, action) => {
      state = action.payload;
    },
    inputAdded: (state, action) => {
      state.push({
        name: action.payload.name,
        rawInput: "",
        glslSource: "",
      });
    },
    rawInputChanged: (state, action) => {
      const { index, rawInput } = action.payload;
      state[index].rawInput = rawInput;
    },
  },
  extraReducers: builder => {
    builder.addCase(inputChanged.fulfilled, (state, action) => {
      const { index, glslSource } = action.payload;
      console.log("InputChanged fulfilled", index, glslSource);
      if (glslSource != null) state[index].glslSource = glslSource;
    });
  },
});

const { inputAdded, rawInputChanged, inputSet } = inputsSlice.actions;
export { inputAdded, inputSet };
export const inputChanged = createAsyncThunk("inputs/inputChanged", async (input, { dispatch, getState }) => {
  dispatch(rawInputChanged(input));

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
