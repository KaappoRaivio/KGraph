import { useEffect } from "react";
import useDimensions from "./useDimensions";

export default (gl, isGlPresent, graphRootRef) => {
  const { width, height } = useDimensions(graphRootRef);
  useEffect(() => {
    if (isGlPresent) {
      if (width < 1 || height < 1) return;
      const graphRoot = graphRootRef.current;

      let W = width * window.devicePixelRatio;
      let H = height * window.devicePixelRatio;
      graphRoot.width = W;

      graphRoot.height = H;
      gl.viewport(0, 0, W, H);
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
