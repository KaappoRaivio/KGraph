import React from "react";
import PinchPanZoomListener from "./PinchPanZoomListener";
import Content from "./content/Content";
import { useDispatch, useSelector } from "react-redux";
import { cameraChanged } from "./redux/reducers/cameraSlice";

import styles from "./main.module.css";
import { useResizable } from "react-resizable-layout";
import Sidebar from "./content/Sidebar";

const Main = () => {
  const dispatch = useDispatch();
  const isMobile = useSelector(state => state.ui.isMobile);

  const inputValue = useSelector(state => state.inputs[0].rawInput);

  return (
    <div id={styles.topContainer} style={{ flexDirection: isMobile ? "column-reverse" : "row" }}>
      <Sidebar />
      <main id={styles.content}>
        <PinchPanZoomListener onChange={camera => dispatch(cameraChanged(camera))} initialCamera={useSelector(state => state.camera.current)}>
          <Content />
        </PinchPanZoomListener>
      </main>
    </div>
  );

  // return (
  //   <>
  //     <Sliders />
  //     <div id={"inputContainer"}>
  //       <input autoCorrect={"off"} value={inputValue} onChange={e => dispatch(inputChanged({ index: 0, rawInput: e.target.value }))} />
  //     </div>
  //   </>
  // );
};

export default Main;
