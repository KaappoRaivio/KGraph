import React, { useEffect, useState } from "react";

const PinchPanZoomListener = ({ children, onChange, initialCamera = { x: 0, y: 0, zoom: 0 } }) => {
  const [panInProgress, setPanInProgress] = useState(false);
  const scale = Math.min(window.innerHeight, window.innerWidth);
  const [transform, setTransform] = useState({ x: initialCamera.x * -scale, y: initialCamera.y * scale, zoom: initialCamera.zoom });

  useEffect(() => {
    const { x, y, zoom } = transform;

    const scale = Math.min(window.innerHeight, window.innerWidth);

    onChange({ x: x / -scale, y: transform.y / scale, zoom });
  }, [transform.x, transform.y, transform.zoom]);

  return React.cloneElement(children[0], {
    onMouseMove: e => {
      if (panInProgress) {
        setTransform(oldPos => {
          const zoomScale = Math.pow(2, oldPos.zoom);

          return {
            x: oldPos.x + e.movementX / zoomScale,
            y: oldPos.y + e.movementY / zoomScale,
            zoom: oldPos.zoom,
          };
        });
      }
    },
    onWheel: e => {
      setTransform(old => ({
        x: old.x,
        y: old.y,
        zoom: old.zoom - Math.sign(e.deltaY),
      }));
    },
    onMouseDown: () => setPanInProgress(true),
    onMouseUp: () => setPanInProgress(false),
    onMouseLeave: () => setPanInProgress(false),

    onTouchStart: () => setPanInProgress(true),
    onTouchEnd: () => setPanInProgress(false),
    onTouchMove: () => e => {
      console.log(e.touches);
    },
  });
};

export default PinchPanZoomListener;
