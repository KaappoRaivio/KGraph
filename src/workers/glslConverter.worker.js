// export default () => {
import { toGLSL } from "./glslUtils";

self.onmessage = message => {
  // console.timeEnd("Worker");

  // // console.log("moi");
  const input = message?.data?.input;
  // const index = message.data.index;
  if (input == null) return postMessage(null);

  console.log("Worker got input:", input);

  try {
    postMessage(toGLSL(input));
    // console.log("got result");
  } catch (err) {
    console.error(err.message);
  }
};
