import React, { useEffect, useState } from "react";

const fpss = [];
let prevTime = new Date().getTime();
let diff = 0;
const update = () => {
  const time = new Date().getTime();
  diff = time - prevTime;
  prevTime = time;
  // // console.log(diff);
  if (diff !== 0) fpss.push(1000 / diff);
  if (fpss.length > 60) {
    fpss.splice(0, 1);
  }
  window.requestAnimationFrame(update);
};

const PerformanceMonitor = () => {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    window.requestAnimationFrame(update);
    const interval = setInterval(() => setFps(fpss.reduce((a, b) => a + b, 0) / fpss.length), 1000);
    return () => clearInterval(interval);
  }, []);

  return <div style={{ position: "absolute", top: 20, right: 20 }}>{fps.toFixed(2)}</div>;
};

export default PerformanceMonitor;
