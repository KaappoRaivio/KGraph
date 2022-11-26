import { useEffect } from "react";
import useDimensions from "./useDimensions";

export default (gl, isGlPresent, graphRootRef) => {
  const { width, height } = useDimensions(graphRootRef);
  useEffect(() => {
    if (isGlPresent) {
      const graphRoot = graphRootRef.current;

      gl.viewport(0, 0, width, height);
      graphRoot.width = width;
      graphRoot.height = height;
    }
  }, [gl, isGlPresent]);
};
