import { configureStore } from "@reduxjs/toolkit";
import ReduxQuerySync from "redux-query-sync";

import uiReducer, { mobileStatusChanged } from "./reducers/uiSlice";
import inputsReducer, { functionInputChanged, inputSet } from "./reducers/inputsSlice";
import cameraReducer, { cameraChanged } from "./reducers/cameraSlice";
import slidersReducer from "./reducers/slidersSlice";
import throttle from "lodash.throttle";
import getStateFromURL from "./persist";

const myReplaceState = throttle(state => {
  const params = new URLSearchParams();
  const { ui, ...rest } = state;
  params.set("d", btoa(JSON.stringify(rest)));

  window.history.replaceState(null, "", `?${params.toString()}`);
  setTimeout(() => {
    // console.log("late update");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, 400);
}, 400);

const store = configureStore({
  preloadedState: getStateFromURL(),
  reducer: {
    ui: uiReducer,
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
  store.dispatch(functionInputChanged(input));
}

window.addEventListener("resize", () => {
  const isMobilePrevious = store.getState().ui.isMobile;
  const isMobile = window.innerWidth < 600;

  if (isMobile !== isMobilePrevious) store.dispatch(mobileStatusChanged({ isMobile }));
});

export default store;
