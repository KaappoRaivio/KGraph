import React from "react";
import GPUPlot from "./gpuPlot";

import styles from "./Content.module.css";
import CanvasOverlay from "./CanvasOverlay";
import { useSelector } from "react-redux";

const Content = ({ ...rest }) => {
  const input = useSelector(state => state.inputs[0]?.glslSource);
  const sliders = useSelector(state => state.sliders);
  return (
    <div {...rest} id={styles.contentWrapper}>
      <GPUPlot input={input} sliders={sliders} />
      <CanvasOverlay />
    </div>
  );
};

export default Content;
