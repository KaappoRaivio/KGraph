export default class WorkerBuilder extends Worker {
  constructor(worker) {
    super(worker);
    const code = worker.toString();
    const blob = new Blob([`(${code})()`]);

    // console.log(code);
    // console.log("aaa", URL.createObjectURL(blob));
    return new Worker(new URL("./glslConverter.worker.js", import.meta.url));
  }
}
