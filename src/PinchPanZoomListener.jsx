import React, { useEffect, useState } from "react";
import { calculateTransform } from "./pinchToZoomMath";

const PinchPanZoomListener = ({ children, onChange, initialCamera = { x: 0, y: 0, zoom: 0 } }) => {
  const [panInProgress, setPanInProgress] = useState(false);
  const scale = Math.min(window.innerHeight, window.innerWidth);
  const [transform, setTransform] = useState({ x: initialCamera.x * -scale, y: initialCamera.y * scale, zoom: initialCamera.zoom });

  const [duringDragTransform, setDuringDragTransform] = useState({ x: 0, y: 0, zoom: 0 });

  const [touchOffset, setTouchOffset] = useState([]);

  useEffect(() => {
    const { x, y, zoom } = transform;
    const { x: dx, y: dy, zoom: dz } = duringDragTransform;

    const scale = Math.min(window.innerHeight, window.innerWidth);

    onChange({ x: (x + dx) / -scale, y: (y + dy) / scale, zoom: zoom + dz });
  }, [transform.x, transform.y, transform.zoom, duringDragTransform.x, duringDragTransform.y, duringDragTransform.zoom]);

  const endDrag = touches => {
    const { x: dx, y: dy, zoom: dz } = duringDragTransform;

    setTransform(({ x, y, zoom }) => ({ x: x + dx, y: y + dy, zoom: zoom + dz }));
    setDuringDragTransform({ x: 0, y: 0, zoom: 0 });
    setTouchOffset([]);
  };

  const startDrag = touches => {
    setTouchOffset(touches);
  };

  // console.log(children[0]);
  return React.cloneElement(children, {
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
        zoom: old.zoom - 0.2 * Math.sign(e.deltaY),
      }));
    },
    onMouseDown: () => setPanInProgress(true),
    onMouseUp: () => setPanInProgress(false),
    onMouseLeave: () => setPanInProgress(false),

    onTouchStart: e => {
      const touches = [...e.touches].map(touch => ({ x: touch.pageX, y: touch.pageY, id: touch.identifier }));
      endDrag(touches);
      startDrag(touches);
    },
    onTouchEnd: e => {
      const touches = [...e.touches].map(touch => ({ x: touch.pageX, y: touch.pageY, id: touch.identifier }));
      endDrag(touches);
      startDrag(touches);
    },
    onTouchMove: e => {
      const touches = [...e.touches].map(touch => ({ x: touch.pageX, y: touch.pageY, id: touch.identifier }));

      const zoomTransform = calculateTransform(touches, touchOffset, 0);

      setDuringDragTransform(oldDuringDragTransform => {
        const zoomScale = Math.pow(2, oldDuringDragTransform.zoom + transform.zoom);

        return { zoom: Math.log2(zoomTransform.scale), x: zoomTransform.translation.x / zoomScale, y: zoomTransform.translation.y / zoomScale };
      });
    },
  });
};

export default PinchPanZoomListener;
