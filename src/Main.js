import React, { useEffect, useRef, useState } from "react";

import vertexShader from "./graphing_vertex";
import fragmentShader from "./graphing_fragment";
import { createProgram } from "./webglHelper";
import { getCameraMatrix } from "./cameraMath";
import useDimensions from "./useDimensions";
import PinchPanZoomListener from "./PinchPanZoomListener";
import * as mathjs from "mathjs";
import algebrite from "algebrite";
import algebra from "algebra.js";

const toGLSLFriendly = parsed => {
  let result = parsed.cloneDeep();

  while (true) {
    // console.log("transforming!", previous);
    let transformed = mathjs.parse(result.toString()).transform((node, path, parent) => {
      if (node.type === "OperatorNode") {
        // console.log(node.op);
        // if (node.op === "*") {
        //   // console.log("multiplication");
        //   return new mathjs.OperatorNode("*", "multiply", node.args, false);
        // }
        if (node.op === "^") {
          // console.log("power");
          return new mathjs.FunctionNode("ppow", node.args);
          // return new mathjs.SymbolNode(`pow(${node.args[0]}, ${node.args[1]})`);
        }
      } else if (node.type === "ConstantNode") {
        // console.log("Constant: ", node);
        // return new mathjs.ConstantNode();
        // return new mathjs.SymbolNode(`${node.value}.`);
      }

      return node;
    });
    // console.log("Transformed:", result.toString(), "-->", transformed.toString());

    if (transformed.toString() === result.toString()) break;
    else {
      // previous = transformed;
      result = transformed;
    }
  }

  let transformed = result.toString({ implicit: "show", simplify: "false" });
  let addedPoints = transformed.replaceAll(/(?<![\d.])([0-9]+)(?![\d.])/g, "$1.");
  console.log("Transformed:", transformed);
  console.log("With decimal points:", addedPoints);
  return addedPoints;
};

const replaceWithFractions = input => {
  console.log(input.replaceAll(/[\d]+\.\d*/g, x => `(${algebra.parse(String(x)).constants[0].toString()})`));
  // console.log(...[...input.matchAll(/[\d]+\.\d*/g)].map(String).map(x => algebra.parse(x).constants[0].toString()));
  return input.replaceAll(/[\d]+\.\d*/g, x => `(${algebra.parse(String(x)).constants[0].toString()})`);
};

const toGLSL = input => {
  if (input.length && !input.includes("=")) {
    if (input.includes("y")) throw Error("Y without equals sign!");
    // input = `y = ${input.toLowerCase()} + P`;
    input = `${input.toLowerCase()} - y = P`;
  } else {
    input = `${input.toLowerCase()} + P`;
  }

  input = replaceWithFractions(input);
  console.log(input);

  const equalToZero = algebrite.run(`roots(${input}, P)`);

  const reparsed = mathjs.parse(equalToZero, { simplify: false });
  console.log("Reparsed:", reparsed.toString());

  return toGLSLFriendly(reparsed);
};

const Main = () => {
  const [camera, setCamera] = useState({ x: 0, y: 512, zoom: -3 });
  const [input, setInput] = useState("");
  // const [input, setInput] = useState("0.5x^2+ 0.31x = 1 / 2 y ^ (3.2)");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("input")) {
      setInput(params.get("input"));
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();

    if (input) {
      params.set("input", input);
    }
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [input]);

  const graphRootRef = useRef(null);
  const { width, height } = useDimensions(graphRootRef);

  const [currentProgram, setCurrentProgram] = useState(null);

  const parameters = {
    start_time: new Date().getTime(),
    time: 0,
    width,
    height,
  };

  const [gl, setGl] = useState(null);
  useEffect(() => {
    const graphRoot = graphRootRef.current;
    const gl = graphRoot.getContext("webgl");

    setGl(gl);
  }, []);

  useEffect(() => {
    if (gl) {
      const graphRoot = graphRootRef.current;

      gl.viewport(0, 0, width, height);
      graphRoot.width = width;
      graphRoot.height = height;
    }
  }, [gl, width, height]);

  useEffect(() => {}, [input]);
  useEffect(() => {
    if (!gl) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]), gl.STATIC_DRAW);

    // const currentProgram = createProgram(gl, vertexShader, fragmentShader("exp(sin(x) + cos(y)) - sin(exp(x+y))"));
    let GLSLSource;
    try {
      GLSLSource = toGLSL(input);
    } catch (err) {
      // console.error(err);
      return;
    }

    console.log("GLSLSource:", GLSLSource);

    const currentProgram = createProgram(gl, vertexShader, fragmentShader(GLSLSource));
    gl.useProgram(currentProgram);
    setCurrentProgram(currentProgram);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }, [gl, input]);

  useEffect(() => {
    if (!currentProgram) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const timeLocation = gl.getUniformLocation(currentProgram, "time");
    const resolutionLocation = gl.getUniformLocation(currentProgram, "resolution");
    const uCameraMatrixLocation = gl.getUniformLocation(currentProgram, "u_matrix");

    gl.uniform1f(timeLocation, parameters.time / 1000);
    gl.uniform2f(resolutionLocation, parameters.width, parameters.height);
    gl.uniformMatrix3fv(uCameraMatrixLocation, false, getCameraMatrix(camera));

    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(0);
  }, [currentProgram, width, height, camera]);

  const onPinchPanZoom = e => {
    console.log(e.state);
  };

  return (
    <>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <PinchPanZoomListener onChange={setCamera} initialCamera={camera}>
        <canvas id={"graphRoot"} ref={graphRootRef} />;
      </PinchPanZoomListener>
    </>
  );
};

export default Main;
