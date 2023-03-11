import { configureStore } from "@reduxjs/toolkit";
import ReduxQuerySync from "redux-query-sync";

import inputsReducer, { inputChanged, inputSet } from "./reducers/inputsSlice";
import cameraReducer, { cameraChanged } from "./reducers/cameraSlice";
import slidersReducer from "./reducers/slidersSlice";
import throttle from "lodash.throttle";
import getStateFromURL from "./persist";

const myReplaceState = throttle(state => {
  const params = new URLSearchParams();
  params.set("d", btoa(JSON.stringify(state)));

  window.history.replaceState(null, "", `?${params.toString()}`);
  // console.log("Early update");
  setTimeout(() => {
    // console.log("Late update");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, 400);
}, 400);

const store = configureStore({
  preloadedState: getStateFromURL(),
  reducer: {
    sliders: slidersReducer,
    inputs: inputsReducer,
    camera: cameraReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(store => next => action => {
      if (!action.type.endsWith("pending")) {
        const state = store.getState();
        myReplaceState(state);
      }
      return next(action);
    }),
});

for (const input of store.getState().inputs) {
  store.dispatch(inputChanged(input));
}

export default store;
