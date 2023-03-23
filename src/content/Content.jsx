import React from "react";
import GPUPlot from "./gpuPlot";

import styles from "./Content.module.css";
import CanvasOverlay from "./CanvasOverlay";
import { useSelector } from "react-redux";

const Content = ({ forwardRef, ...rest }) => {
  const input = useSelector(state => state.inputs?.filter(input => input.type !== "slider"));
  const sliders = useSelector(state => state.inputs.filter(input => input.type === "slider"));
  return (
    <div ref={forwardRef} {...rest} id={styles.contentWrapper}>
      <GPUPlot input={input} sliders={sliders} />
      {/*<CanvasOverlay />*/}
    </div>
  );
};

export default Content;
