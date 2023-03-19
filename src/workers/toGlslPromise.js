import { implicitToGLSL } from "./glslUtils";

export const implicitEquationToGlsl = input => {
  const worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
  return new Promise((resolve, reject) => {
    worker.onmessage = message => {
      if (message.data) {
        console.log("Got result: ", message.data);

        if (message.data != null) {
          resolve(message.data);
        } else {
          reject();
        }
        worker.terminate();
      }
    };

    worker.postMessage({ input, type: "implicit" });
  }).catch(console.error);
};

export const solidEquationToGlsl = input => {
  const worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
  return new Promise((resolve, reject) => {
    worker.onmessage = message => {
      if (message.data) {
        console.log("Got result: ", message.data);

        if (message.data != null) {
          resolve(message.data);
        } else {
          reject();
        }
        worker.terminate();
      }
    };

    worker.postMessage({ input, type: "solid" });
  }).catch(console.error);
};
