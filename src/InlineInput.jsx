import React from "react";

const InlineInput = ({ value, style, ...props }) => (
  <input autoCorrect={"off"} style={{ width: `${Math.max((value + "").length, 1)}ch`, display: "inline", ...style }} value={value} {...props} />
);

export default InlineInput;
