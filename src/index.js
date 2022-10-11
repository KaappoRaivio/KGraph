import React from "react";
import { createRoot } from "react-dom/client";

import Main from "./Main";

import "./index.css";

// render(<HelloWorld />, document.getElementById("root"));
const root = createRoot(document.getElementById("root"));
root.render(<Main />);
// render();
