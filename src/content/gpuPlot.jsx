import React, { useRef, useState } from "react";

import useWebGl from "../hooks/useWebGl";
import useGlScaling from "../hooks/useGlScaling";
import useUpdateShader from "../hooks/useUpdateShader";
import useDimensions from "../hooks/useDimensions";
import useUpdateShaderInputs from "../hooks/useUpdateShaderInputs";
import { useSelector } from "react-redux";

const GPUPlot = ({ sliders, input, ...rest }) => {
  const camera = useSelector(state => state.camera.current);
  const graphRootRef = useRef(null);

  const { gl, isGlPresent } = useWebGl(graphRootRef);
  useGlScaling(gl, isGlPresent, graphRootRef);

  const [currentPrograms, setCurrentPrograms] = useState([]);
  useUpdateShader(gl, input, sliders, currentPrograms, setCurrentPrograms);
  const { width, height } = useDimensions(graphRootRef);
  useUpdateShaderInputs(gl, currentPrograms, width, height, camera, sliders);

  return <canvas id={"graphRoot"} ref={graphRootRef} {...rest} />;
};

export default GPUPlot;
