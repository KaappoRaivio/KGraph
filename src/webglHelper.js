export const createShader = (gl, src, type) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error((type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + " SHADER:\n" + gl.getShaderInfoLog(shader));
    console.error(src);
    // alert();
    return null;
  }

  return shader;
};

export const createProgram = (gl, vertex, fragment) => {
  const program = gl.createProgram();

  const vs = createShader(gl, vertex, gl.VERTEX_SHADER);
  const fs = createShader(gl, fragment, gl.FRAGMENT_SHADER);
  const fs2 = createShader(
    gl,
    `#version 300 es
    precision highp float;
    
    in vec4 position;
    out vec4 fragColor;
    void main(void) { fragColor = vec4(1, 0, 1, 1); }
  `,
    gl.FRAGMENT_SHADER,
  );

  if (vs == null || fs == null) {
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  // gl.attachShader(program, fs2);

  gl.deleteShader(vs);
  gl.deleteShader(fs);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "ERROR:\n" +
        "VALIDATE_STATUS: " +
        gl.getProgramParameter(program, gl.VALIDATE_STATUS) +
        "\n" +
        "ERROR: " +
        gl.getError() +
        "\n\n" +
        "- Vertex Shader -\n" +
        vertex +
        "\n\n" +
        "- Fragment Shader -\n" +
        fragment,
    );

    return null;
  }

  return program;
};
