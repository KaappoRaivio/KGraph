import { mat3 } from "gl-matrix";

export const getCameraMatrix = ({ x, y, zoom }) => {
  const mat = mat3.create();
  const zoomScale = Math.pow(2, zoom);
  const paska = 1 / Math.pow(2, Math.abs(zoom));

  const scale = Math.min(window.innerHeight, window.innerWidth);
  const bigger = Math.max(window.innerHeight, window.innerWidth);
  console.log(x.toFixed(2), zoom);

  // mat3.translate(mat, mat, [x, 0]);

  mat3.scale(mat, mat, [1 / zoomScale, 1 / zoomScale]);
  mat3.translate(mat, mat, [x * 2 + 1, y * 2 + (bigger - scale) / scale / 2]);

  return mat3.multiply([], mat3.create(), mat);

  // console.log(x);
  // if (zoom >= 0) {
  // } else {
  //   const zoomScale = Math.pow(2, zoom);
  //
  //   const scale = Math.min(window.innerHeight, window.innerWidth);
  //   // mat3.translate(mat, mat, [x, y]);
  //   console.log(x.toFixed(2), y.toFixed(2), zoom);
  //
  //   console.log(0.25 / zoomScale);
  //   mat3.translate(mat, mat, [0.25, 0]);
  //   mat3.scale(mat, mat, [1 / zoomScale, 1 / zoomScale]);
  //   mat3.translate(mat, mat, [x, 0]);
  //   // mat3.translate(mat, mat, [-1000 / zoomScale, -1000 / zoomScale]);
  //
  //   // mat3.translate(mat, mat, [-x, -y]);
  //   // mat3.translate(mat, mat, [x, y]);
  //
  //   // return mat3;
  //   return mat3.multiply([], mat3.create(), mat);
  // }
};
