import React from "react";
import PinchPanZoomListener from "./PinchPanZoomListener";
import useSliders from "./hooks/useSliders";
import Sliders from "./Sliders";
import Content from "./content/Content";

import throttle from "lodash.throttle";
import { useDispatch, useSelector } from "react-redux";
import { inputChanged } from "./redux/reducers/inputsSlice";
import { cameraChanged } from "./redux/reducers/cameraSlice";

const Main = () => {
  const dispatch = useDispatch();
  const inputValue = useSelector(state => state.inputs[0].rawInput);

  return (
    <>
      <Sliders />
      <PinchPanZoomListener onChange={camera => dispatch(cameraChanged(camera))} initialCamera={useSelector(state => state.camera.current)}>
        <Content />
      </PinchPanZoomListener>
      <div id={"inputContainer"}>
        <input autoCorrect={"off"} value={inputValue} onChange={e => dispatch(inputChanged({ index: 0, rawInput: e.target.value }))} />
      </div>
    </>
  );
};

export default Main;
