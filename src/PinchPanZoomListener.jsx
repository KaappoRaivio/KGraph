import React, { useEffect, useRef, useState } from "react";
import { calculateTransform } from "./pinchToZoomMath";
import { useResizeDetector } from "react-resize-detector";
import useDimensions from "./hooks/useDimensions";

const PinchPanZoomListener = ({ children, onChange, initialCamera = { x: 0, y: 0, zoom: 0 } }) => {
  const childRef = useRef(null);

  const { width, height } = useDimensions(childRef);
  const scale = Math.min(width, height);

  const [panInProgress, setPanInProgress] = useState(false);
  const [transform, setTransform] = useState({ x: initialCamera.x * -scale, y: initialCamera.y * scale, zoom: initialCamera.zoom });
  const [duringDragTransform, setDuringDragTransform] = useState({ x: 0, y: 0, zoom: 0 });
  const [touchOffset, setTouchOffset] = useState([]);

  useEffect(() => {
    const { x, y, zoom } = transform;
    const { x: dx, y: dy, zoom: dz } = duringDragTransform;

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

  return React.cloneElement(children, {
    forwardRef: childRef,
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
        zoom: old.zoom - Math.sign(e.deltaY) * 0.1,
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
