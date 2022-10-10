import React, { useEffect, useRef, useState } from "react";

import vertexShader from "./graphing_vertex";
import fragmentShader from "./graphing_fragment";
import { createProgram } from "./webglHelper";
import { getCameraMatrix } from "./cameraMath";

const parameters = {
  start_time: new Date().getTime(),
  time: 0,
  screenWidth: 0,
  screenHeight: 0,
};

const HelloWorld = () => {
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: -2 });

  const graphRootRef = useRef();
  useEffect(() => {
    const graphRoot = graphRootRef.current;
    let gl = graphRoot.getContext("webgl");

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]), gl.STATIC_DRAW);

    let currentProgram = createProgram(gl, vertexShader, fragmentShader);

    let timeLocation = gl.getUniformLocation(currentProgram, "time");
    let resolutionLocation = gl.getUniformLocation(currentProgram, "resolution");
    let uCameraMatrixLocation = gl.getUniformLocation(currentProgram, "u_matrix");
    let aa = gl.getAttribLocation(currentProgram, "a_position");

    // console.log(graphRoot);
    gl.viewport(0, 0, graphRoot.clientWidth, graphRoot.clientHeight);
    graphRoot.width = graphRoot.clientWidth;
    graphRoot.height = graphRoot.clientHeight;
    parameters.screenWidth = graphRoot.clientWidth;
    parameters.screenHeight = graphRoot.clientHeight;

    // gl.enableVertexAttribArray()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(currentProgram);

    gl.uniform1f(timeLocation, parameters.time / 1000);
    gl.uniform2f(resolutionLocation, parameters.screenWidth, parameters.screenHeight);
    gl.uniformMatrix3fv(uCameraMatrixLocation, false, getCameraMatrix(camera));

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    let vertex_position;
    gl.vertexAttribPointer(vertex_position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertex_position);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(vertex_position);
    console.log(vertex_position);
  }, []);

  return (
    <div>
      <p>Moi</p>
      <canvas id={"graphRoot"} ref={graphRootRef}></canvas>
    </div>
  );
};

export default HelloWorld;
