import React, { useEffect, useRef, useState } from "react";

import useWebGl from "../hooks/useWebGl";
import useGlScaling from "../hooks/useGlScaling";
import useUpdateShader from "../hooks/useUpdateShader";
import useDimensions from "../hooks/useDimensions";
import useUpdateShaderInputs from "../hooks/useUpdateShaderInputs";
import { useDispatch, useSelector } from "react-redux";
import { webglSupportDetected } from "../redux/reducers/uiSlice";

const GPUPlot = ({ sliders, input, ...rest }) => {
  const dispatch = useDispatch();
  const camera = useSelector(state => state.camera.current);
  const graphRootRef = useRef(null);

  const { gl, isPresent, isSupported } = useWebGl(graphRootRef);
  useEffect(() => {
    dispatch(webglSupportDetected(isSupported));
  }, [isSupported]);

  useGlScaling(gl, isPresent, graphRootRef);

  const [currentPrograms, setCurrentPrograms] = useState([]);
  useUpdateShader(gl, input, sliders, currentPrograms, setCurrentPrograms);
  const { width, height } = useDimensions(graphRootRef);
  useUpdateShaderInputs(gl, currentPrograms, width, height, camera, sliders, input);

  return <canvas id={"graphRoot"} ref={graphRootRef} {...rest} />;
};

export default GPUPlot;
