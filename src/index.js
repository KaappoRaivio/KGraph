import React from "react";
import { createRoot } from "react-dom/client";

import HelloWorld from "./HelloWorld";

import "./index.css";

// render(<HelloWorld />, document.getElementById("root"));
const root = createRoot(document.getElementById("root"));
root.render(<HelloWorld />);
// render();
