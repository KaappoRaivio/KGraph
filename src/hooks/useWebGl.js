import { useEffect, useState } from "react";

export default canvasRef => {
  const [gl, setGl] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  useEffect(() => {
    const gl = canvasRef.current.getContext("webgl2", { preserveDrawingBuffer: true });
    if (gl == null) return setIsSupported(false);

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE_MINUS_CONSTANT_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    setGl(gl);
  }, []);

  return { gl, isPresent: gl != null, isSupported };
};
