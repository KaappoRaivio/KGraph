import { useEffect } from "react";
import useDimensions from "./useDimensions";

export default (gl, isGlPresent, graphRootRef) => {
  const { width, height } = useDimensions(graphRootRef);
  useEffect(() => {
    if (isGlPresent) {
      if (width < 1 || height < 1) return;
      // // console.log("scaling");
      const graphRoot = graphRootRef.current;

      // graphRoot.width = width;
      let W = width * window.devicePixelRatio;
      let H = height * window.devicePixelRatio;
      graphRoot.width = W;
      // graphRoot.height = height;
      graphRoot.height = H;
      gl.viewport(0, 0, W, H);
      // gl.viewport(0, 0, width, height);

      // graphRoot.style.width = `${width * window.devicePixelRatio}px`;
      // graphRoot.style.height = `${height}px`;
    }
  }, [gl, isGlPresent, width, height, window.devicePixelRatio]);
};

export const useCanvasScaling = canvasRef => {
  const { width, height } = useDimensions(canvasRef);

  useEffect(() => {
    const graphRoot = canvasRef.current;

    if (width < 1 || height < 1) return;
    graphRoot.width = width * window.devicePixelRatio;
    graphRoot.height = height * window.devicePixelRatio;
  }, [width, height, canvasRef.current, window.devicePixelRatio]);

  return { width, height };
};
