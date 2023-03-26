import React from "react";
import PinchPanZoomListener from "./PinchPanZoomListener";
import Content from "./content/Content";
import { useDispatch, useSelector } from "react-redux";
import { cameraChanged } from "./redux/reducers/cameraSlice";

import styles from "./main.module.css";
import { useResizable } from "react-resizable-layout";
import Sidebar from "./content/Sidebar";
import PerformanceMonitor from "./content/PerformanceMonitor";
import Modal from "react-modal";
import Instructions from "./esthetics/Instructions";

// window.devicePixelRatio = 1;

const Main = () => {
  const dispatch = useDispatch();
  const isMobile = useSelector(state => state.ui.isMobile);
  const isDev = useSelector(state => state.ui.isDev);
  const isHelpOpen = useSelector(state => state.ui.helpPressed);
  const isWebgl2Supported = useSelector(state => state.ui.webgl2Supported);
  const initialCamera = useSelector(state => state.camera.current);

  return (
    <div id={styles.topContainer} style={{ flexDirection: isMobile ? "column-reverse" : "row" }}>
      <Modal isOpen={isHelpOpen} style={{ content: { maxWidth: "800px" } }}>
        <Instructions />
      </Modal>
      <Sidebar />
      {isWebgl2Supported ? (
        <main id={styles.content}>
          <PinchPanZoomListener onChange={camera => dispatch(cameraChanged(camera))} initialCamera={initialCamera}>
            <Content />
          </PinchPanZoomListener>
        </main>
      ) : (
        <p>Your browser doesn't support webgl2</p>
      )}
      {isDev && <PerformanceMonitor />}
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
