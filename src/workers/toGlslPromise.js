import { implicitToGLSL } from "./glslUtils";
import pDefer from "p-defer";

export class GLSLConversionManager {
  constructor() {
    this.pendingPromises = {};
    this.worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
    this.worker.onmessage = message => {
      const { input, output } = message.data;
      console.log(input, output, this.pendingPromises);

      if (output == null) {
        this.pendingPromises[input].reject("Error");
      } else {
        this.pendingPromises[input].resolve(output);
      }
      delete this.pendingPromises[input];
    };
    console.log("NONO");
  }

  implicitEquationToGlsl(input) {
    console.log(this.worker);
    this.pendingPromises[input] = pDefer();
    this.worker.postMessage({ input, type: "implicit" });
    return this.pendingPromises[input].promise;
  }

  solidEquationToGlsl(input) {
    console.log(this.worker);
    this.pendingPromises[input] = pDefer();
    this.worker.postMessage({ input, type: "solid" });
    return this.pendingPromises[input].promise;
  }
}

// export const implicitEquationToGlsl = input => {
//   const worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
//   return new Promise((resolve, reject) => {
//     worker.onmessage = message => {
//       if (message.data) {
//         console.log("Got result: ", message.data);
//
//         if (message.data != null) {
//           resolve(message.data);
//         } else {
//           reject();
//         }
//         worker.terminate();
//       }
//     };
//
//     worker.postMessage({ input, type: "implicit" });
//   }).catch(console.error);
// };
//
// export const solidEquationToGlsl = input => {
//   const worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
//   return new Promise((resolve, reject) => {
//     worker.onmessage = message => {
//       if (message.data) {
//         console.log("Got result: ", message.data);
//
//         if (message.data != null) {
//           resolve(message.data);
//         } else {
//           reject();
//         }
//         worker.terminate();
//       }
//     };
//
//     worker.postMessage({ input, type: "solid" });
//   }).catch(console.error);
// };
