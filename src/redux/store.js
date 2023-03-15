import { configureStore } from "@reduxjs/toolkit";
import ReduxQuerySync from "redux-query-sync";

import uiReducer, { mobileStatusChanged } from "./reducers/uiSlice";
import inputsReducer, { functionInputChanged, inputSet } from "./reducers/inputsSlice";
import cameraReducer, { cameraChanged } from "./reducers/cameraSlice";
import slidersReducer from "./reducers/slidersSlice";
import throttle from "lodash.throttle";
import getStateFromURL from "./persist";

let timeout;

const store = configureStore({
  preloadedState: getStateFromURL(),
  reducer: {
    ui: uiReducer,
    // sliders: slidersReducer,
    inputs: inputsReducer,
    camera: cameraReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(store => next => action => {
      next(action);
      if (!action.type.endsWith("pending")) {
        // setTimeout(() => {
        if (timeout !== 0) clearTimeout(timeout);
        const state = store.getState();
        timeout = setTimeout(() => {
          const { ui, ...rest } = state;

          const params = new URLSearchParams();
          params.set("d", btoa(JSON.stringify(rest)));

          window.history.replaceState(null, "", `?${params.toString()}`);
        }, 500);
      }
    }),
});

for (let index = 0; index < store.getState().inputs.length; index++) {
  const input = store.getState().inputs[index];
  if (input.type !== "function") continue;
  else store.dispatch(functionInputChanged({ index, ...input }));
}

window.addEventListener("resize", () => {
  const isMobilePrevious = store.getState().ui.isMobile;
  const isMobile = window.innerWidth < 600;

  if (isMobile !== isMobilePrevious) store.dispatch(mobileStatusChanged({ isMobile }));
});

export default store;
