import { mat3 } from "gl-matrix";

export const getCameraMatrix = ({ x, y, zoom }) => {
  const mat = mat3.create();

  const zoomScale = Math.pow(2, zoom);

  mat3.translate(mat, mat, [x, y]);
  mat3.scale(mat, mat, [1 / zoomScale, 1 / zoomScale]);
  return mat3.multiply([], mat3.create(), mat);
};
