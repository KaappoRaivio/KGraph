import React from "react";
import GPUPlot from "./gpuPlot";

import styles from "./Content.module.css";
import CanvasOverlay from "./CanvasOverlay";
import { useSelector } from "react-redux";

const Content = ({ input, sliders, camera, ...rest }) => {
  // console.log(inputs, "moi");
  return (
    <div {...rest} id={styles.contentWrapper}>
      <GPUPlot input={input} sliders={sliders} camera={camera} />
      <CanvasOverlay camera={camera} />
    </div>
  );
};

export default Content;
