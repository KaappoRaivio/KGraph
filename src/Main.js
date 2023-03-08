import React, { useEffect, useState } from "react";
import PinchPanZoomListener from "./PinchPanZoomListener";
import useSliders from "./hooks/useSliders";
import Sliders from "./Sliders";
import Content from "./content/Content";

// const worker = new WorkerBuilder(glslConverterWorker);
const worker = new Worker(new URL("./workers/glslConverter.worker.js", import.meta.url));

const Main = () => {
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: -4 });
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ glsl: "", eliminateVertical: false });
  const { sliders, onSliderChange, updateSlider, addSlider, deleteSlider, changes } = useSliders();

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

  return (
    <>
      <Sliders sliders={sliders} onSliderChange={onSliderChange} updateSlider={updateSlider} addSlider={addSlider} deleteSlider={deleteSlider} />
      <PinchPanZoomListener onChange={setCamera} initialCamera={camera}>
        <Content input={output} sliders={sliders} camera={camera} />
      </PinchPanZoomListener>
      <div id={"inputContainer"}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </div>
    </>
  );
};

export default Main;
