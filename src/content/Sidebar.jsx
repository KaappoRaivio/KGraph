import React, { useRef } from "react";
import styles from "./Sidebar.module.css";
import { useResizable } from "react-resizable-layout-mobile";
import { useDispatch, useSelector } from "react-redux";
import FunctionEntry from "./sidebar/FunctionEntry";
import { fractalInputChanged, functionInputChanged, inputRemoved, sliderChanged } from "../redux/reducers/inputsSlice";
import SliderEntry from "./sidebar/SliderEntry";
import AddEntry from "./sidebar/AddEntry";
import FractalEntry from "./sidebar/FractalEntry";

const Sidebar = () => {
  const isMobile = useSelector(state => state.ui.isMobile);
  const inputs = useSelector(state => state.inputs);
  const dispatch = useDispatch();

  const sidebarRef = useRef();
  const { position, separatorProps } = useResizable({
    axis: isMobile ? "y" : "x",
    reverse: isMobile,
    initial: 300,
    containerRef: sidebarRef,
    min: 0,
  });

  // const style = isMobile ? { display: sidebarOpen ? "block" : "none" } : { flexBasis: position };
  const style = { flexBasis: position, overflow: "scroll" };

  return (
    <>
      <aside ref={sidebarRef} id={styles.sidebar} style={style}>
        <ol className={"no-bullets"}>
          {inputs.map((item, index) => {
            const { type, key, ...rest } = item;

            rest.onRemoval = () => dispatch(inputRemoved({ index }));

            switch (type) {
              case "function":
                return <FunctionEntry {...rest} index={index} onChange={e => dispatch(functionInputChanged({ index, rawInput: e.target.value }))} />;
              case "slider":
                return <SliderEntry index={index} {...rest} onChange={stuff => dispatch(sliderChanged({ index, ...stuff }))} />;
              case "fractal":
                return <FractalEntry {...rest} index={index} onChange={c => dispatch(fractalInputChanged(c))} />;
              default:
                throw new Error("Unknown type " + item.type + "!");
            }
          })}
          <AddEntry />
        </ol>
      </aside>
      <div id={styles.handle} className={isMobile ? "" : styles.vertical} {...separatorProps}>
        ...
      </div>
    </>
  );
};

export default Sidebar;
