import { useEffect } from "react";
import { createProgram } from "../webglHelper";
import vertexShader from "../graphing_vertex";
import fragmentShader from "../graphing_fragment";

export default (gl, output, sliders, currentProgram, setCurrentProgram) => {
  useEffect(() => {
    if (!gl) return;

    console.log(JSON.stringify(sliders.map(slider => slider.name).filter(x => x.length)), output);

    let fragment = fragmentShader(
      output,
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
  }, [gl, output, JSON.stringify(sliders.map(slider => slider.name).filter(x => x.length))]);
};
