import React, { useRef } from "react";
import styles from "./Sidebar.module.css";
import { useResizable } from "react-resizable-layout-mobile";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const isMobile = useSelector(state => state.ui.isMobile);

  const sidebarRef = useRef();
  const { position, separatorProps } = useResizable({ axis: isMobile ? "y" : "x", reverse: isMobile, initial: 300, containerRef: sidebarRef });

  // const style = isMobile ? { display: sidebarOpen ? "block" : "none" } : { flexBasis: position };
  const style = { flexBasis: position };

  console.log(separatorProps);

  const original = separatorProps.onMouseDown;
  separatorProps.onMouseDown = e => {
    console.log("Hi");
    original(e);
  };

  return (
    <>
      <aside ref={sidebarRef} id={styles.sidebar} style={style}>
        Contentaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      </aside>
      <div id={styles.handle} className={isMobile ? "" : styles.vertical} {...separatorProps}>
        ...
      </div>
    </>
  );
};

export default Sidebar;
