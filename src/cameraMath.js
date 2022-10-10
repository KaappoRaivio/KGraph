import { mat3 } from "gl-matrix";

export const getCameraMatrix = ({ x, y, zoom }) => {
  const mat = mat3.create();

  // const zoomScale = 1 / Math.pow(2, camera.zoom + duringDragCamera.scale);

  const zoomScale = 1 / Math.pow(2, zoom);

  mat3.translate(mat, mat, [x, y + y]);
  mat3.scale(mat, mat, [zoomScale, zoomScale]);

  // return mat3;
  return mat3.multiply([], mat3.create(), mat);
};
