// export default () => {
import { implicitToGLSL, solidToGLSL } from "./glslUtils";

self.onmessage = message => {
  // console.timeEnd("Worker");
  console.log("Worker got message", message.data);

  // // console.log("moi");
  const input = message?.data?.input;
  const type = message?.data?.type;
  // const type = message?.data?.type;
  if (input == null) return postMessage(null);
  console.log("Worker got input:", input, type);

  if (type === "implicit") {
    try {
      console.log("moi");
      postMessage({ output: implicitToGLSL(input), input });
      // console.log("got result");
    } catch (err) {
      console.error(err.message);
    }
  } else if (type === "solid") {
    try {
      postMessage({ output: solidToGLSL(input), input });
      // console.log("got result");
    } catch (err) {
      console.error(err.message);
    }
  }
};
