import { useEffect, useState } from "react";

export default canvasRef => {
  const [gl, setGl] = useState(null);
  useEffect(() => {
    // const graphRoot = graphRootRef.current;
    const gl = canvasRef.current.getContext("webgl");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    setGl(gl);
  }, []);

  return { gl, isGlPresent: gl != null };
};
