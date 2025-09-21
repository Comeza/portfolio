import rawFragShader from "default.frag?raw";
import rawVertShader from "default.vert?raw";

import "main.css";
import "fonts/hoover.css"

let mousePosition = { x: 0, y: 0 };

document.addEventListener("mousemove", (event) => {
  mousePosition = { x: event.clientX, y: event.clientY };
});

function display(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("no webgl2 :(");
    return;
  }

  const program = setupProgram(gl);
  if (!program) return;

  gl.useProgram(program);

  const resolutionHandle = gl.getUniformLocation(program, "u_resolution");
  const timeHandle = gl.getUniformLocation(program, "u_time");
  const mouseHandle = gl.getUniformLocation(program, "u_mouse");

  const vertexPositions = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

  const positionHandle = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionHandle);
  gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 0, 0);

  const draw = () => {
    gl.uniform2f(resolutionHandle, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(timeHandle, performance.now() / 1000);
    gl.uniform2f(mouseHandle, mousePosition.x, gl.canvas.height - mousePosition.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
  };

  draw();
}

function setupProgram(gl: WebGL2RenderingContext) {
  const vertShader = createShader(gl, "vertex", rawVertShader);
  const fragShader = createShader(gl, "fragment", rawFragShader);

  if (!vertShader) return null;
  if (!fragShader) return null;

  const program = linkProgram(gl, vertShader, fragShader);
  if (!program) return null;

  return program;
}

function linkProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Could not create shader program",
      gl.getProgramInfoLog(program),
    );
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function createShader(
  gl: WebGL2RenderingContext,
  type: "vertex" | "fragment",
  code: string,
) {
  const shader = gl.createShader(
    type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER,
  );

  if (!shader) {
    console.error("Could not create shader");
    return null;
  }

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

const canvas = document.getElementById("canvas")!! as HTMLCanvasElement;
resizeCanvasToDisplaySize(canvas);
display(canvas);

window.onresize = ((_) => {
  resizeCanvasToDisplaySize(canvas);
})
