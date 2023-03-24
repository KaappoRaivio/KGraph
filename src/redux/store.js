import { configureStore } from "@reduxjs/toolkit";

import uiReducer, { mobileStatusChanged } from "./reducers/uiSlice";
import inputsReducer, { functionInputChanged, solidInputChanged } from "./reducers/inputsSlice";
import cameraReducer from "./reducers/cameraSlice";
import getStateFromURL from "./persist";
import rison from "rison";

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
      if (!action.type.endsWith("pending") && !window.location.pathname.endsWith("about/")) {
        // setTimeout(() => {
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
          // params.set("d", btoa(JSON.stringify(toSerialization)));
          params.set("d", rison.encode_object(toSerialization));
          console.log(JSON.stringify(toSerialization, null, 4));
          // console.log(btoa(JSON.stringify(rest)).length, btoa(JSON.stringify(toSerialization)).length);
          console.log(btoa(JSON.stringify(rest)).length, btoa(rison.encode_object(toSerialization)).length);
          // params.set("d", btoa(JSON.stringify(rest)));
          // console.log(rest);

          window.history.replaceState(null, "", `?${params.toString()}`);
          // window.history.replaceState(null, "", `?d=${rison.encode_object(toSerialization)}`);
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
