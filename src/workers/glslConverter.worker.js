// export default () => {
import { implicitToGLSL, solidToGLSL } from "./glslUtils";

self.onmessage = message => {
  // console.timeEnd("Worker");

  // // console.log("moi");
  const input = message?.data?.input;
  const type = message?.data?.type;
  if (input == null) return postMessage(null);
  console.log("Worker got input:", input, type);

  if (type === "implicit") {
    try {
      postMessage(implicitToGLSL(input));
      // console.log("got result");
    } catch (err) {
      console.error(err.message);
    }
  } else if (type === "solid") {
    try {
      postMessage(solidToGLSL(input));
      // console.log("got result");
    } catch (err) {
      console.error(err.message);
    }
  }
};
