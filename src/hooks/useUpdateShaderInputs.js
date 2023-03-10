import { useEffect } from "react";
import { getCameraMatrix } from "../cameraMath";

export default (gl, currentProgram, width, height, camera, sliders) => {
  useEffect(() => {
    if (!currentProgram) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // const timeLocation = gl.getUniformLocation(currentProgram, "time");
    const resolutionLocation = gl.getUniformLocation(currentProgram, "resolution");
    const uCameraMatrixLocation = gl.getUniformLocation(currentProgram, "u_matrix");
    const uZoomLocation = gl.getUniformLocation(currentProgram, "zoom");

    gl.uniform2f(resolutionLocation, width, height);
    gl.uniformMatrix3fv(uCameraMatrixLocation, false, getCameraMatrix(camera));
    gl.uniform1f(uZoomLocation, camera.zoom);

    sliders
      .filter(slider => slider.name.length)
      .forEach(slider => {
        const location = gl.getUniformLocation(currentProgram, slider.name);
        gl.uniform1f(location, slider.value);
      });

    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(0);
  }, [currentProgram, width, height, camera, JSON.stringify(sliders)]);
};
