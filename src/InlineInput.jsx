import React from "react";

const InlineInput = ({ value, style, ...props }) => (
  <input
    type={"text"}
    autoCorrect={"off"}
    autoCapitalize={"none"}
    style={{ width: `${Math.max((value + "").length, 1)}ch`, display: "inline", boxSizing: "initial", ...style }}
    value={value}
    {...props}
  />
);

export default InlineInput;
