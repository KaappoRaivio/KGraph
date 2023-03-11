import inputsReducer from "./reducers/inputsSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    inputs: inputsReducer,
  },
});

export default store;
