import { useEffect } from "react";
import useDimensions from "./useDimensions";

export default (gl, isGlPresent, graphRootRef) => {
  const { width, height } = useDimensions(graphRootRef);
  useEffect(() => {
    if (isGlPresent) {
      console.log(width, height);

      const graphRoot = graphRootRef.current;

      // graphRoot.width = width;
      graphRoot.width = width * window.devicePixelRatio;
      // graphRoot.height = height;
      graphRoot.height = height * window.devicePixelRatio;
      gl.viewport(0, 0, width * window.devicePixelRatio, height * window.devicePixelRatio);
      // gl.viewport(0, 0, width, height);

      // graphRoot.style.width = `${width * window.devicePixelRatio}px`;
      // graphRoot.style.height = `${height}px`;
    }
  }, [gl, isGlPresent, width, height]);
};

export const useCanvasScaling = canvasRef => {
  const { width, height } = useDimensions(canvasRef);
  // console.log(canvasRef?.current?.getBoundingClientRect());
  useEffect(() => {
    console.log(width, height, window.devicePixelRatio);
    const graphRoot = canvasRef.current;

    graphRoot.width = width * window.devicePixelRatio;
    // graphRoot.width = 1080;
    graphRoot.height = height * window.devicePixelRatio;
    // graphRoot.height = 1920;
  }, [width, height, canvasRef.current]);
};
