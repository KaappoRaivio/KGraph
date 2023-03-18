import { implicitToGLSL } from "./glslUtils";

const worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
export const implicitEquationToGlsl = input => {
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

    worker.postMessage({ input, type: "implicit" });
  }).catch(console.error);
};

export const solidEquationToGlsl = input => {
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

    worker.postMessage({ input, type: "solid" });
  }).catch(console.error);
};
