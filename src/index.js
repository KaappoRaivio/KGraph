import React from "react";
// import { createRoot } from "react-dom/client";
import { render } from "react-dom";

import Main from "./Main";

import "./index.css";

import store from "./redux/store";
import { Provider } from "react-redux";

render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("root"),
);
// const root = createRoot(document.getElementById("root"));
// root.render(<Main />);
// render();
