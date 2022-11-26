import { useEffect } from "react";
import { createProgram } from "../webglHelper";
import vertexShader from "../graphing_vertex";
import fragmentShader from "../graphing_fragment";

export default (gl, output, sliders, currentProgram, setCurrentProgram) => {
  useEffect(() => {
    if (!gl) return;

    const currentProgram = createProgram(
      gl,
      vertexShader,
      fragmentShader(
        output.glsl,
        false,
        sliders.map(slider => slider.name).filter(x => x.length),
      ),
    );
    if (currentProgram != null) {
      gl.deleteProgram(null);
      gl.useProgram(currentProgram);
    }

    setCurrentProgram(currentProgram);
  }, [gl, output, JSON.stringify(sliders.map(slider => slider.name).filter(x => x.length))]);
};
