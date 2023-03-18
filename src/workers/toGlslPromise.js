import { toGLSL } from "./glslUtils";

const worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
export default input => {
  return new Promise((resolve, reject) => {
    worker.onmessage = message => {
      if (message.data) {
        console.log("Got result: ", message.data);

        if (message.data != null) {
          resolve(message.data);
        } else {
          reject();
        }
      }
    };

    worker.postMessage({ input });
  }).catch(console.error);
};
