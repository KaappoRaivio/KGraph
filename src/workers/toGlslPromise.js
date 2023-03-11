import { toGLSL } from "./glslConverter.worker";

export default input => {
  return new Promise((resolve, reject) => {
    try {
      // let a = 0;
      // while (a < 100000000000000000) {
      //   ++a;
      // }
      resolve(toGLSL(input));
    } catch (err) {
      console.log("asdasd");
      reject(err);
    }
  });
  // return new Promise((resolve, reject) => {
  //   const worker = new Worker(new URL("./glslConverter.worker.js", import.meta.url));
  //   worker.onmessage = message => {
  //     if (message.data) {
  //       console.log("Got result: ", message.data);
  //
  //       if (message.data != null) {
  //         resolve(message.data);
  //       } else {
  //         reject();
  //       }
  //     }
  //   };
  //   console.log("Posting", input);
  //   // console.time("Worker");
  //   worker.postMessage({ input });
  // }).catch(console.error);
};
