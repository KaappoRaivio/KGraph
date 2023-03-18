import { useEffect, useLayoutEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

export default ref => {
  const { width, height } = useResizeDetector({ targetRef: ref });

  return { width: width ?? window.innerWidth, height: height ?? window.innerHeight };
  // const [size, setSize] = useState([ref.current?.clientWidth ?? -1, ref.current?.clientHeight ?? -1]);

  // const updateSize = _ => {
  //   if (ref.current) {
  //     const r = ref.current.getBoundingClientRect();
  //     // setSize([ref.current.clientWidth, ref.current.clientHeight]);
  //     setSize([r.right - r.left, r.bottom - r.top]);
  //   } else {
  //     // console.log("null!");
  //   }
  // };
  //
  // useEffect(() => {
  //   updateSize();
  //   window.addEventListener("resize", updateSize);
  //
  //   return () => window.removeEventListener("resize", updateSize);
  // }, []);
  //
  // useEffect(() => {
  //   updateSize(null);
  // }, [ref.current?.innerWidth, ref.current?.innerHeight]);

  // return { width: size[0], height: size[1] };
};
