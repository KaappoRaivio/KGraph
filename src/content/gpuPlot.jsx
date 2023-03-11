import React, { useRef, useState } from "react";

import useWebGl from "../hooks/useWebGl";
import useGlScaling from "../hooks/useGlScaling";
import useUpdateShader from "../hooks/useUpdateShader";
import useDimensions from "../hooks/useDimensions";
import useUpdateShaderInputs from "../hooks/useUpdateShaderInputs";
import { useSelector } from "react-redux";

const GPUPlot = ({ sliders, camera, ...rest }) => {
  const input = useSelector(state => state.inputs[0]?.glslSource);
  const graphRootRef = useRef(null);

  const { gl, isGlPresent } = useWebGl(graphRootRef);
  useGlScaling(gl, isGlPresent, graphRootRef);

  const [currentProgram, setCurrentProgram] = useState(null);
  useUpdateShader(gl, input, sliders, currentProgram, setCurrentProgram);
  const { width, height } = useDimensions(graphRootRef);
  useUpdateShaderInputs(gl, currentProgram, width, height, camera, sliders);

  return <canvas id={"graphRoot"} ref={graphRootRef} {...rest} />;
};

export default GPUPlot;
