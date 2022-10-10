import React, { useRef } from "react";

const HelloWorld = () => {
  const graphRoot = useRef();

  return <canvas id={"graphRoot"}></canvas>;
};

export default HelloWorld;
