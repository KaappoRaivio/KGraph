import { useEffect, useLayoutEffect, useState } from "react";

export default ref => {
  const [size, setSize] = useState([ref.current?.clientWidth ?? -1, ref.current?.clientHeight ?? -1]);

  useEffect(() => {
    const updateSize = _ => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        // setSize([ref.current.clientWidth, ref.current.clientHeight]);
        setSize([r.right - r.left, r.bottom - r.top]);
      } else {
        console.log("null!");
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return { width: size[0], height: size[1] };
};