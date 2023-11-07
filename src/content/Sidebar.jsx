import React, { useRef } from "react";
import styles from "./Sidebar.module.css";
import { useResizable } from "react-resizable-layout-mobile";
import { useDispatch, useSelector } from "react-redux";
import FunctionEntry from "./sidebar/FunctionEntry";
import {
  fractalInputChanged,
  functionInputChanged,
  inputRemoved,
  powerSeriesInputChanged,
  sliderChanged,
  solidInputChanged,
} from "../redux/reducers/inputsSlice";
import SliderEntry from "./sidebar/SliderEntry";
import AddEntry from "./sidebar/AddEntry";
import FractalEntry from "./sidebar/FractalEntry";
import SolidEntry from "./sidebar/SolidEntry";
import { helpOpened } from "../redux/reducers/uiSlice";
import PowerSeriesEntry from "./sidebar/PowerSeriesEntry";

const Sidebar = () => {
  const isMobile = useSelector(state => state.ui.isMobile);
  const inputs = useSelector(state => state.inputs);
  const dispatch = useDispatch();

  const sidebarRef = useRef();
  const { position, separatorProps } = useResizable({
    axis: isMobile ? "y" : "x",
    reverse: isMobile,
    initial: 200,
    containerRef: sidebarRef,
    min: 0,
  });

  const style = { flexBasis: position };

  return (
    <>
      <aside ref={sidebarRef} id={styles.sidebar} style={style}>
        {/*<hr />*/}
        <ol className={"no-bullets"}>
          {inputs.map((item, index) => {
            const { type, key, ...rest } = item;

            rest.onRemoval = () => dispatch(inputRemoved({ index }));

            switch (type) {
              case "function":
                return <FunctionEntry {...rest} index={index} onChange={stuff => dispatch(functionInputChanged({ index, ...stuff }))} />;
              case "solid":
                return <SolidEntry {...rest} index={index} onChange={stuff => dispatch(solidInputChanged({ index, ...stuff }))} />;
              case "slider":
                return <SliderEntry index={index} {...rest} onChange={stuff => dispatch(sliderChanged({ index, ...stuff }))} />;
              case "fractal":
                return <FractalEntry {...rest} index={index} onChange={c => dispatch(fractalInputChanged(c))} />;
              case "powerSeries":
                return <PowerSeriesEntry {...rest} index={index} onChange={stuff => dispatch(powerSeriesInputChanged({ index, ...stuff }))} />;
              default:
                throw new Error("Unknown type " + item.type + "!");
            }
          })}
          <AddEntry />
        </ol>
      </aside>
      <div id={styles.handle} className={isMobile ? "" : styles.vertical} {...separatorProps}>
        ...
        <div id={styles.topBar}>
          <button id={styles.help} onClick={() => dispatch(helpOpened())}>
            {" "}
            ?{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
