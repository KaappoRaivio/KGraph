import React, { useEffect, useRef, useState } from "react";

import vertexShader from "./graphing_vertex";
import fragmentShader from "./graphing_fragment";
import { createProgram } from "./webglHelper";
import { getCameraMatrix } from "./cameraMath";
import useDimensions from "./useDimensions";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import PinchPanZoomListener from "./PinchPanZoomListener";

const Main = () => {
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0 });
  const [input, setInput] = useState("");

  const graphRootRef = useRef(null);
  const { width, height } = useDimensions(graphRootRef);

  const [currentProgram, setCurrentProgram] = useState(null);

  const parameters = {
    start_time: new Date().getTime(),
    time: 0,
    width,
    height,
  };

  const [gl, setGl] = useState(null);
  useEffect(() => {
    const graphRoot = graphRootRef.current;
    const gl = graphRoot.getContext("webgl");

    setGl(gl);
  }, []);

  useEffect(() => {
    if (gl) {
      const graphRoot = graphRootRef.current;

      gl.viewport(0, 0, width, height);
      graphRoot.width = width;
      graphRoot.height = height;
    }
  }, [gl, width, height]);

  useEffect(() => {
    if (!gl) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]), gl.STATIC_DRAW);

    // const currentProgram = createProgram(gl, vertexShader, fragmentShader("exp(sin(x) + cos(y)) - sin(exp(x+y))"));
    const currentProgram = createProgram(gl, vertexShader, fragmentShader(input));
    gl.useProgram(currentProgram);
    setCurrentProgram(currentProgram);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }, [gl, input]);

  useEffect(() => {
    if (!currentProgram) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const timeLocation = gl.getUniformLocation(currentProgram, "time");
    const resolutionLocation = gl.getUniformLocation(currentProgram, "resolution");
    const uCameraMatrixLocation = gl.getUniformLocation(currentProgram, "u_matrix");

    gl.uniform1f(timeLocation, parameters.time / 1000);
    gl.uniform2f(resolutionLocation, parameters.width, parameters.height);
    gl.uniformMatrix3fv(uCameraMatrixLocation, false, getCameraMatrix(camera));

    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(0);
  }, [currentProgram, width, height, camera]);

  const onPinchPanZoom = e => {
    console.log(e.state);
  };

  return (
    <>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <PinchPanZoomListener onChange={setCamera} initialCamera={camera}>
        <canvas id={"graphRoot"} ref={graphRootRef} />;
      </PinchPanZoomListener>
    </>
  );
};

export default Main;
