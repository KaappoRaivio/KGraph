import { useEffect, useLayoutEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

export default ref => {
  const { width, height } = useResizeDetector({ targetRef: ref });

  return { width: width ?? window.innerWidth, height: height ?? window.innerHeight };
};
