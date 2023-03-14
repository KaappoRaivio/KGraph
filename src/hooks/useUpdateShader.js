import { useEffect } from "react";
import { createProgram } from "../webglHelper";
import vertexShader from "../graphing_vertex";
import fragmentShader from "../graphing_fragment";

export default (gl, input, sliders, currentProgram, setCurrentProgram) => {
  useEffect(() => {
    if (!gl) return;

    // console.log(JSON.stringify(sliders.map(slider => slider.name).filter(x => x.length)), input);
    // console.log(input);
    try {
      let fragment = fragmentShader(
        input,
        false,
        sliders.map(slider => slider.name).filter(x => x.length),
      );
      // console.log(fragment)
      const currentProgram = createProgram(gl, vertexShader, fragment);
      if (currentProgram != null) {
        gl.deleteProgram(null);
        gl.useProgram(currentProgram);
      }

      setCurrentProgram(currentProgram);
    } catch (error) {
      console.error(error);
    }
  }, [gl, JSON.stringify(input)]);
};
