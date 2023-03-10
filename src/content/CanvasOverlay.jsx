import React, { useEffect, useRef, useState } from "react";

import styles from "./Content.module.css";
import { useCanvasScaling } from "../hooks/useGlScaling";
import { getCameraMatrix } from "../cameraMath";

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

    // const overlapW = Math.max(0, (resolution.x - resolution.y) / (2 * resolution.y));
    // const overlapH = Math.max(0, (resolution.y - resolution.x) / (2 * resolution.x));
    // const uv = { x: x * scale - (0.5 + Math.max(overlapW)), y: y * scale - (0.5 + Math.max(overlapH, 0.5)) };
    // const clipVec = vec3.fromValues(x, y, 0);

    // const res = vec3.transformMat3([], clipVec, mat3.transpose([], cameraMatrix));
    // return { x: res[0], y: res[1] };
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

    // const overlapW = Math.max(0, (resolution.x - resolution.y) / (2 * resolution.y));
    // const overlapH = Math.max(0, (resolution.y - resolution.x) / (2 * resolution.x));
    // const uv = { x: x * scale - (0.5 + Math.max(overlapW)), y: y * scale - (0.5 + Math.max(overlapH, 0.5)) };
    // const clipVec = vec3.fromValues(x, y, 0);

    // const res = vec3.transformMat3([], clipVec, mat3.transpose([], cameraMatrix));
    // return { x: res[0], y: res[1] };
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

const drawTicks = (ctx, camera, c2p, p2c, thickness, height, gridThickness) => {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const topLeft = p2c({ x: 0, y: 0 });
  const bottomRight = p2c({ x: W, y: H });

  const visibleClipSpace = { w: bottomRight.x - topLeft.x, h: topLeft.y - bottomRight.y };
  // console.log(visibleClipSpace);

  const base = 2;
  const scale = Math.pow(base, Math.trunc(camera.zoom / Math.log2(base) - window.devicePixelRatio * 0.5));

  const tickPitch = 1 / scale / Math.pow(base, 4);

  const xMin = Math.round(topLeft.x / tickPitch) * tickPitch;
  const xMax = Math.round(bottomRight.x / tickPitch) * tickPitch;

  ctx.font = `${12 * window.devicePixelRatio}px Courier New`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  // x axis
  for (let xTick = xMin; xTick <= xMax; xTick += tickPitch) {
    ctx.fillRect(c2p({ x: xTick, y: 0 }).x - thickness / 2, Math.min(Math.max(c2p({ x: 0, y: 0 }).y - height / 2, 12), H * 0.9), thickness, height);
    ctx.fillRect(c2p({ x: xTick, y: 0 }).x - gridThickness / 2, 0, gridThickness, H);
    const textY =
      c2p({
        x: 0,
        y: 0,
      }).y -
      height / 2;

    // console.log(H, textY);
    if (xTick !== 0) ctx.fillText(xTick.toFixed(2), c2p({ x: xTick, y: 0 }).x - thickness / 2, Math.min(Math.max(textY, 12), H * 0.9));
  }

  const yMin = -Math.round(bottomRight.y / tickPitch) * tickPitch;
  const yMax = -Math.round(topLeft.y / tickPitch) * tickPitch;

  ctx.textAlign = "start";
  ctx.textBaseline = "middle";
  // y axis
  for (let yTick = yMin; yTick < yMax; yTick += tickPitch) {
    // console.log(yTick);
    ctx.fillRect(Math.min(Math.max(c2p({ x: 0, y: 0 }).x - height / 2, 0), W - height), c2p({ x: 0, y: yTick }).y - thickness / 2, height, thickness);
    ctx.fillRect(0, c2p({ x: 0, y: yTick }).y - gridThickness / 2, W, gridThickness);
    const textX =
      c2p({
        x: 0,
        y: 0,
      }).x +
      height / 2;

    // console.log(H, textHeight);
    if (yTick !== 0)
      ctx.fillText((-yTick).toFixed(2), Math.min(Math.max(textX, height), W * 0.98 - height), c2p({ x: 0, y: yTick }).y - thickness / 2);
  }
};

const CanvasOverlay = ({ camera }) => {
  const canvasRef = useRef(null);
  useCanvasScaling(canvasRef);

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

      // const visibleClipSpaceTopLeft = p2c({ x: 0, y: 0 });
      // const visibleClipSpaceBottomRight = p2c({ x: W, y: H });
      // console.log(visibleClipSpaceTopLeft, visibleClipSpaceBottomRight);

      const cameraMatrix = getCameraMatrix({ x, y, zoom });
      // console.log(cameraMatrix);

      ctx.strokeStyle = "blue";
      ctx.lineWidth = Math.pow(2, zoom) * 10;

      const a = c2p({ x: 3, y: 3 });
      const b = c2p({ x: 1, y: 2 });
      // ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
    },
    [camera.x, camera.y, camera.zoom],
  );
  return <canvas id={styles.overlay} ref={canvasRef}></canvas>;
};

export default CanvasOverlay;
