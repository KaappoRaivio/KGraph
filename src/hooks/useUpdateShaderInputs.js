import { useEffect, useMemo } from "react";
import { getCameraMatrix } from "../cameraMath";

export default (gl, currentPrograms, width, height, camera, sliders, inputs) => {
  // console.log(inputs);
  useEffect(() => {
    if (currentPrograms == null || gl == null) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const currentProgram of currentPrograms) {
      if (currentProgram == null) continue;
      gl.useProgram(currentProgram);

      const resolutionLocation = gl.getUniformLocation(currentProgram, "resolution");
      const uCameraMatrixLocation = gl.getUniformLocation(currentProgram, "u_matrix");
      const uZoomLocation = gl.getUniformLocation(currentProgram, "zoom");
      const fragLocation = gl.getFragDataLocation(currentProgram, "fragColor");

      gl.uniform2f(resolutionLocation, width, height);
      gl.uniformMatrix3fv(uCameraMatrixLocation, false, getCameraMatrix(camera));
      gl.uniform1f(uZoomLocation, camera.zoom);

      sliders
        .filter(slider => slider.name.length)
        .forEach(slider => {
          const location = gl.getUniformLocation(currentProgram, slider.name);
          gl.uniform1f(location, slider.value);
        });

      // console.log("Drawing");
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // const timeLocation = gl.getUniformLocation(currentProgram, "time");
  }, [currentPrograms, width, height, camera, JSON.stringify(sliders), JSON.stringify(inputs)]);
};
