import React, { useEffect, useRef, useState } from "react";

import vertexShader from "./graphing_vertex";
import fragmentShader from "./graphing_fragment";
import { createProgram } from "./webglHelper";
import { getCameraMatrix } from "./cameraMath";
import useDimensions from "./hooks/useDimensions";
import PinchPanZoomListener from "./PinchPanZoomListener";
import useSliders from "./hooks/useSliders";
import Sliders from "./Sliders";
import useUpdateShaderInputs from "./hooks/useUpdateShaderInputs";
import useUpdateShader from "./hooks/useUpdateShader";
import useWebGl from "./hooks/useWebGl";
import useGlScaling from "./hooks/useGlScaling";

import throttle from "lodash.throttle"

// const worker = new WorkerBuilder(glslConverterWorker);
const worker = new Worker(new URL("./workers/glslConverter.worker.js", import.meta.url));

const myReplaceState = throttle(s => window.history.replaceState(null, "", s), 1000);


const planeToPx = (camera, width, height) => {
  const w = width / 10 * Math.pow(2, camera.zoom);
  const h = height / 10;
  return `${w}px ${h}px`;
}

const Main = () => {
  const [camera, setCamera] = useState(JSON.parse(new URLSearchParams(window.location.search).get("camera")) ?? { x: 0, y: 0, zoom: -4 });
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ glsl: "", eliminateVertical: false });
  const { sliders, onSliderChange, updateSlider, addSlider, deleteSlider, changes, setSliders } = useSliders();

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
    if (params.get("sliders")) {
      setSliders(JSON.parse(params.get("sliders")));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (input) {
      params.set("input", input);
    }

    if (sliders) {
      params.set("sliders", JSON.stringify(sliders))
    }

    if (camera) {
      params.set("camera", JSON.stringify(camera));
    }


    myReplaceState(`?${params.toString()}`);
    setTimeout(() => {
      myReplaceState(`?${params.toString()}`)
    }, [1000]);
    // myReplaceState(null, "", `?${params.toString()}`);

  }, [input, JSON.stringify(sliders), JSON.stringify(camera)]);

  useEffect(() => {
    worker.postMessage(input);
  }, [input])

  const graphRootRef = useRef(null);

  const { gl, isGlPresent } = useWebGl(graphRootRef);
  useGlScaling(gl, isGlPresent, graphRootRef);

  const [currentProgram, setCurrentProgram] = useState(null);
  useUpdateShader(gl, output, sliders, currentProgram, setCurrentProgram);
  const { width, height } = useDimensions(graphRootRef);
  useUpdateShaderInputs(gl, currentProgram, width, height, camera, sliders);

  // console.log(camera, )
  const cameraMatrix = getCameraMatrix(camera);
  return (
    <>
      <Sliders sliders={sliders} onSliderChange={onSliderChange} updateSlider={updateSlider} addSlider={addSlider} deleteSlider={deleteSlider} />
      <PinchPanZoomListener onChange={setCamera} initialCamera={camera}>
          <canvas id={"graphRoot"} ref={graphRootRef} />;
      </PinchPanZoomListener>
      {/*<div id={"overlay"} style={{*/}
      {/*  backgroundSize: `${planeToPx(camera, width, height)}`*/}
      {/*}}></div>*/}
      <div id={"inputContainer"}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </div>
    </>
  );
};

export default Main;
