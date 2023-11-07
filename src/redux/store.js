import { configureStore } from "@reduxjs/toolkit";

import uiReducer, { mobileStatusChanged } from "./reducers/uiSlice";
import inputsReducer, { functionInputChanged, powerSeriesInputChanged, solidInputChanged } from "./reducers/inputsSlice";
import cameraReducer from "./reducers/cameraSlice";
import getStateFromURL from "./persist";
import rison from "rison";

let timeout;

const store = configureStore({
  preloadedState: getStateFromURL(),
  reducer: {
    ui: uiReducer,
    inputs: inputsReducer,
    camera: cameraReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(store => next => action => {
      next(action);
      if (!action.type.endsWith("pending") && !window.location.pathname.endsWith("about/")) {
        if (timeout !== 0) clearTimeout(timeout);
        const state = store.getState();
        timeout = setTimeout(() => {
          const { ui, ...rest } = state;

          const { inputs, ...rest2 } = rest;
          const toSerialization = {
            ...rest2,
            inputs: inputs.map(({ type, glslSource, ...rest }) => (type === "function" ? { type, glslSource: "", ...rest } : { type, ...rest })),
          };

          const params = new URLSearchParams();
          params.set("d", rison.encode_object(toSerialization));

          window.history.replaceState(null, "", `?${params.toString()}`);
        }, 500);
      }
    }),
});

for (let index = 0; index < store.getState().inputs.length; index++) {
  const input = store.getState().inputs[index];
  if (input.type === "function") {
    store.dispatch(functionInputChanged({ index, ...input }));
  } else if (input.type === "solid") {
    store.dispatch(solidInputChanged({ index, ...input }));
  } else if (input.type === "powerSeries") {
    store.dispatch(powerSeriesInputChanged({ index, ...input }));
  } else {
    continue;
  }
}

window.addEventListener("resize", () => {
  const isMobilePrevious = store.getState().ui.isMobile;
  const isMobile = window.innerWidth < 600;

  if (isMobile !== isMobilePrevious) store.dispatch(mobileStatusChanged({ isMobile }));
});

export default store;
