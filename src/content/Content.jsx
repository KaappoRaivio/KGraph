import React from "react";
import GPUPlot from "./gpuPlot";

import styles from "./Content.module.css";
import CanvasOverlay from "./CanvasOverlay";

const Content = ({ input, sliders, camera, ...rest }) => {
  return (
    <div {...rest} id={styles.contentWrapper}>
      <GPUPlot input={input} sliders={sliders} camera={camera} />
      <CanvasOverlay camera={camera} />
    </div>
  );
};

export default Content;
