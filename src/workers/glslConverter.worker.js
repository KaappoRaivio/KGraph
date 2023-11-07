import { implicitToGLSL, solidToGLSL, powerSeriesToGLSL } from "./glslUtils";

self.onmessage = message => {
  console.log("Worker got message", message.data);

  const input = message?.data?.input;
  const type = message?.data?.type;
  if (input == null) return postMessage(null);
  console.log("Worker got input:", input, type);

  if (type === "implicit") {
    try {
      console.log("moi");
      postMessage({ output: implicitToGLSL(input), input });
    } catch (err) {
      console.error(err.message);
    }
  } else if (type === "solid") {
    try {
      postMessage({ output: solidToGLSL(input), input });
    } catch (err) {
      console.error(err.message);
    }
  } else if (type === "powerSeries") {
    try {
      postMessage({ output: powerSeriesToGLSL(input), input });
    } catch (err) {
      console.error(err.message);
    }
  }
};
