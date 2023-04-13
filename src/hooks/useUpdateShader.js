import { useEffect } from "react";
import { createProgram } from "../webglHelper";
import vertexShader from "../graphing_vertex";
import fragmentShaderFunction from "../graphing_fragment_function";
import fragmentShaderFractal from "../graphing_fragment_fractal";
import fragmentShaderSolid from "../graphing_fragment_solid";

export default (gl, inputs, sliders, currentPrograms, setCurrentPrograms) => {
  useEffect(() => {
    if (!gl) return;

    const programs = [];

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
          case "solid":
            fragment = fragmentShaderSolid(
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
        programs.push({ program, input });
      } catch (error) {
        console.error("Error templating shader", error);
      }
    }

    programs.sort((a, b) => {
      const values = {
        function: 1,
        fractal: 0,
        solid: -1,
      };

      const valA = values[a?.input.type];
      const valB = values[b?.input.type];
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    });

    setCurrentPrograms(programs.map(({ program, input }) => program));
  }, [gl, JSON.stringify(inputs.map(({ rawInput, ...rest }) => rest)), JSON.stringify(sliders.map(slider => slider.name)), window.devicePixelRatio]);
};
