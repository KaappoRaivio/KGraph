import React from "react";
// import { createRoot } from "react-dom/client";
import { render } from "react-dom";

import Main from "./Main";

import "./index.css";

import store from "./redux/store";
import { Provider } from "react-redux";
import About from "./content/about/About";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";

const isDev = store.getState().ui.isDev;

const router = createBrowserRouter(
  [
    {
      path: "/about",
      element: (
        <MathJaxContext>
          <About />
        </MathJaxContext>
      ),
    },

    {
      path: "/",
      element: (
        <Provider store={store}>
          <Main />
        </Provider>
      ),
    },
  ],
  { basename: isDev ? "/" : "/graph" },
);

render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root"),
);
// const root = createRoot(document.getElementById("root"));
// root.render(<Main />);
// render();
