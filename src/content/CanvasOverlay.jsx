import React, { useEffect, useRef, useState } from "react";

import styles from "./Content.module.css";
import { useCanvasScaling } from "../hooks/useGlScaling";
import { getCameraMatrix } from "../cameraMath";
import { useSelector } from "react-redux";

const useDraw = (ref, callback, dependencies) => {
  const [ctx, setCtx] = useState(null);
  useEffect(() => {
    if (ref.current) {
      setCtx(ref.current.getContext("2d"));
    }
  }, [ref.current]);

  useEffect(() => {
    if (ctx) {
      callback(ctx, dependencies);
    }
  }, [ctx, ...dependencies]);
};

const clipSpace2PxSpace =
  (ctx, camera) =>
  ({ x, y }) => {
    const resolution = { x: ctx.canvas.width, y: ctx.canvas.height };

    const scale = Math.min(resolution.x, resolution.y);

    return {
      x: (x - camera.x) * scale * Math.pow(2, camera.zoom) + resolution.x / 2,
      y: (y + camera.y) * scale * Math.pow(2, camera.zoom) + resolution.y / 2,
    };
  };

const pxSpaceToClipSpace =
  (ctx, camera) =>
  ({ x, y }) => {
    const resolution = { x: ctx.canvas.width, y: ctx.canvas.height };

    const scale = Math.min(resolution.x, resolution.y);

    return {
      x: (Math.pow(2, -camera.zoom) * (x - resolution.x / 2)) / scale + camera.x,
      y: (Math.pow(2, -camera.zoom) * (y - resolution.y / 2)) / scale + camera.y,
    };
  };

const drawAxes = (ctx, c2p, p2c, thickness) => {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  // x axis
  ctx.fillRect(0, c2p({ x: 0, y: 0 }).y - thickness / 2, W, thickness);

  // y axis
  ctx.fillRect(c2p({ x: 0, y: 0 }).x - thickness / 2, 0, thickness, H);
};

const drawTicks = (ctx, camera, c2p, p2c, thickness, height, gridThickness, drawOnlyGrid = false) => {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const percent = (window.devicePixelRatio * Math.min(W, H)) / 100;

  const topLeft = p2c({ x: 0, y: 0 });
  const bottomRight = p2c({ x: W, y: H });

  const visibleClipSpace = { w: bottomRight.x - topLeft.x, h: topLeft.y - bottomRight.y };

  const base = 2;
  const scale = Math.pow(base, Math.trunc(camera.zoom / Math.log2(base) - window.devicePixelRatio * 0.5));

  const tickPitch = 1 / scale / Math.pow(base, 4);

  const xMin = Math.round(topLeft.x / tickPitch) * tickPitch;
  const xMax = Math.round(bottomRight.x / tickPitch) * tickPitch;

  let longestNumberLength = 0;
  for (let xTick = xMin; xTick <= xMax; xTick += tickPitch) {
    longestNumberLength = Math.max(longestNumberLength, `${xTick}`.length);
  }
  const roomForText = c2p({ x: xMin + 2 * tickPitch }).x - c2p({ x: xMin + tickPitch }).x;

  const fontSize = Math.floor(roomForText / longestNumberLength);
  ctx.font = `${fontSize}px Courier New`;

  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  // x axis
  for (let xTick = xMin; xTick <= xMax; xTick += tickPitch) {
    let y = Math.min(Math.max(c2p({ x: 0, y: 0 }).y - height / 2, fontSize), H - height);
    if (!drawOnlyGrid) {
      ctx.fillRect(c2p({ x: xTick, y: 0 }).x - thickness / 2, y, thickness, height);
      if (xTick !== 0) ctx.fillText(xTick, c2p({ x: xTick, y: 0 }).x - thickness / 2, Math.min(Math.max(textY, fontSize), H - height));
    }

    ctx.fillRect(c2p({ x: xTick, y: 0 }).x - gridThickness / 2, 0, gridThickness, H);
    const textY =
      c2p({
        x: 0,
        y: 0,
      }).y -
      height / 2;
  }

  const yMin = -Math.round(bottomRight.y / tickPitch) * tickPitch;
  const yMax = -Math.round(topLeft.y / tickPitch) * tickPitch;

  ctx.textAlign = "start";
  ctx.textBaseline = "middle";
  // y axis
  for (let yTick = yMin; yTick < yMax; yTick += tickPitch) {
    if (!drawOnlyGrid) {
      ctx.fillRect(
        Math.min(Math.max(c2p({ x: 0, y: 0 }).x - height / 2, 0), W - height),
        c2p({ x: 0, y: yTick }).y - thickness / 2,
        height,
        thickness,
      );
      if (yTick !== 0) ctx.fillText(-yTick, Math.min(Math.max(textX, height), W * 0.98 - height), c2p({ x: 0, y: yTick }).y - thickness / 2);
    }
    ctx.fillRect(0, c2p({ x: 0, y: yTick }).y - gridThickness / 2, W, gridThickness);
    const textX =
      c2p({
        x: 0,
        y: 0,
      }).x +
      height / 2;
  }
};

const CanvasOverlay = () => {
  const camera = useSelector(state => state.camera.current);
  const canvasRef = useRef(null);
  const { width, height } = useCanvasScaling(canvasRef);

  useDraw(
    canvasRef,
    (ctx, [x, y, zoom]) => {
      ctx.fillStyle = "#4f4f4f";
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;

      ctx.clearRect(0, 0, W, H);
      const c2p = clipSpace2PxSpace(ctx, { x, y, zoom });
      const p2c = pxSpaceToClipSpace(ctx, { x, y, zoom });

      drawAxes(ctx, c2p, p2c, 5);
      drawTicks(ctx, { x, y, zoom }, c2p, p2c, 4, 20, 0.5);
      drawTicks(ctx, { x, y, zoom: zoom + 3 }, c2p, p2c, 4, 20, 0.125, true);

      const cameraMatrix = getCameraMatrix({ x, y, zoom });

      ctx.strokeStyle = "blue";
      ctx.lineWidth = Math.pow(2, zoom) * 10;

      const a = c2p({ x: 3, y: 3 });
      const b = c2p({ x: 1, y: 2 });
    },
    [camera.x, camera.y, camera.zoom, width, height],
  );
  return <canvas id={styles.overlay} ref={canvasRef}></canvas>;
};

export default CanvasOverlay;
