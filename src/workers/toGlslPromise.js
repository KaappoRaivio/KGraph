import { implicitToGLSL } from "./glslUtils";
import pDefer from "p-defer";

export class GLSLConversionManager {
  constructor() {
    this.pendingPromises = {};
    this.worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
    this.worker.onmessage = message => {
      const { input, output } = message.data;

      if (output == null) {
        this.pendingPromises[input].reject("Error");
      } else {
        this.pendingPromises[input].resolve(output);
      }
      delete this.pendingPromises[input];
    };
  }

  implicitEquationToGlsl(input) {
    this.pendingPromises[input] = pDefer();
    this.worker.postMessage({ input, type: "implicit" });
    return this.pendingPromises[input].promise;
  }

  solidEquationToGlsl(input) {
    this.pendingPromises[input] = pDefer();
    this.worker.postMessage({ input, type: "solid" });
    return this.pendingPromises[input].promise;
  }

  powerSeriesEquationToGlsl(input) {
    this.pendingPromises[input] = pDefer();
    this.worker.postMessage({ input, type: "powerSeries" });
    return this.pendingPromises[input].promise;
  }
}
