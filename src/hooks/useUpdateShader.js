import { useEffect } from "react";
import { createProgram } from "../webglHelper";
import vertexShader from "../graphing_vertex";
import fragmentShaderFunction from "../graphing_fragment_function";
import fragmentShaderFractal from "../graphing_fragment_fractal";

export default (gl, inputs, sliders, currentPrograms, setCurrentPrograms) => {
  useEffect(() => {
    if (!gl) return;

    const programs = [];

    currentPrograms.filter(p => p != null).forEach(p => gl.deleteProgram(p));

    for (const input of inputs) {
      try {
        let fragment;
        switch (input.type) {
          default:
          case "function":
            fragment = fragmentShaderFunction(
              input,
              false,
              sliders.map(slider => slider.name).filter(x => x.length),
            );
            break;
          case "fractal":
            fragment = fragmentShaderFractal(
              input,
              false,
              sliders.map(slider => slider.name).filter(x => x.length),
            );
        }

        const program = createProgram(gl, vertexShader, fragment);
        programs.push(program);
      } catch (error) {
        console.error("Error templating shader", error);
      }
    }

    programs.sort((a, b) => {
      const valA = a?.type === "function" ? 1 : 0;
      const valB = b?.type === "function" ? 1 : 0;
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    });

    setCurrentPrograms(programs);
  }, [gl, JSON.stringify(inputs), JSON.stringify(sliders.map(slider => slider.name))]);
};
