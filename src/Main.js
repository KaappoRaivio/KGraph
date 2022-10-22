import React, { useEffect, useRef, useState } from "react";

import vertexShader from "./graphing_vertex";
import fragmentShader from "./graphing_fragment";
import { createProgram } from "./webglHelper";
import { getCameraMatrix } from "./cameraMath";
import useDimensions from "./useDimensions";
import PinchPanZoomListener from "./PinchPanZoomListener";
import useSliders from "./useSliders";

// const worker = new WorkerBuilder(glslConverterWorker);
const worker = new Worker(new URL("./workers/glslConverter.worker.js", import.meta.url));

const Main = () => {
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: -4 });
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ glsl: "", eliminateVertical: true });
  const { sliders, onSliderChange, addSlider, changes } = useSliders();

  useEffect(() => {
    worker.onmessage = message => {
      if (message) {
        if (message.data != null) {
          setOutput(message.data);
        }
      }
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("input")) {
      setInput(params.get("input"));
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();

    if (input) {
      params.set("input", input);
    }
    window.history.replaceState(null, "", `?${params.toString()}`);

    worker.postMessage(input);
  }, [input]);

  const graphRootRef = useRef(null);
  const { width, height } = useDimensions(graphRootRef);

  const [currentProgram, setCurrentProgram] = useState(null);

  const [gl, setGl] = useState(null);
  useEffect(() => {
    const graphRoot = graphRootRef.current;
    const gl = graphRoot.getContext("webgl", { antialias: true });

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

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }, [gl]);

  useEffect(() => {
    if (!gl) return;

    // let GLSLSource;
    // try {
    //   GLSLSource = toGLSL(output);
    // } catch (err) {
    //   // console.error(err);
    //   return;
    // }
    // console.timeEnd("Expression to GLSL");
    // console.log("GLSLSource:", GLSLSource);

    gl.deleteProgram(null);
    const currentProgram = createProgram(gl, vertexShader, fragmentShader(output.glsl, false, Object.keys(sliders)));
    gl.useProgram(currentProgram);
    setCurrentProgram(currentProgram);
  }, [gl, output, JSON.stringify(Object.keys(sliders))]);

  useEffect(() => {
    if (!currentProgram) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // const timeLocation = gl.getUniformLocation(currentProgram, "time");
    const resolutionLocation = gl.getUniformLocation(currentProgram, "resolution");
    const uCameraMatrixLocation = gl.getUniformLocation(currentProgram, "u_matrix");
    const uZoomLocation = gl.getUniformLocation(currentProgram, "zoom");

    // console.log(width, height, width / height);

    // gl.uniform1f(timeLocation, parameters.time / 1000);
    gl.uniform2f(resolutionLocation, width, height);
    gl.uniformMatrix3fv(uCameraMatrixLocation, false, getCameraMatrix(camera));
    gl.uniform1i(uZoomLocation, camera.zoom);

    Object.keys(sliders).forEach(key => {
      const location = gl.getUniformLocation(currentProgram, key);
      gl.uniform1f(location, sliders[key].value);
    });

    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(0);
  }, [currentProgram, width, height, camera, JSON.stringify(sliders)]);

  return (
    <>
      <div id={"inputContainer"}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        {Object.keys(sliders).map(key => (
          <input
            type={"range"}
            value={sliders[key].value}
            onChange={onSliderChange(key)}
            max={sliders[key].max}
            min={sliders[key].min}
            step={0.001}></input>
        ))}
      </div>
      <PinchPanZoomListener onChange={setCamera} initialCamera={camera}>
        <canvas id={"graphRoot"} ref={graphRootRef} />;
      </PinchPanZoomListener>
    </>
  );
};

export default Main;
