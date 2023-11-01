import { useEffect, useRef, useState } from "react";

export interface ShaderProps {
  fragmentShader: string;
  vertexShader: string;
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
}

function compileShader(
  gl: WebGL2RenderingContext,
  source: string,
  type: number
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    console.error("An error occurred compiling the shaders: " + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Helper function to link a shader program
function linkProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    console.error("Unable to initialize the shader program: " + error);
    return null;
  }

  return program;
}

export const Shader = (props: ShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<WebGL2RenderingContext | undefined>(undefined);

  useEffect(() => {
    if (!canvasRef.current) return;
    setGl(canvasRef.current.getContext("webgl2") ?? undefined);
  }, [canvasRef]);

  useEffect(() => {
    if (!gl || !canvasRef.current) return;

    const vertexShader = compileShader(
      gl,
      props.vertexShader,
      gl.VERTEX_SHADER
    );
    const fragmentShader = compileShader(
      gl,
      props.fragmentShader,
      gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) {
      console.error("Could not compile shaders: ", [
        vertexShader,
        fragmentShader,
      ]);
      return;
    }

    const program = linkProgram(gl, vertexShader, fragmentShader);

    if (!program) {
      console.error("Could not link shader program");
      return;
    }

    gl.useProgram(program);

    const vertexPositions = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

    const positionHandle = gl.getAttribLocation(program, "a_position");

    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

    const timeHandle = gl.getUniformLocation(program, "u_time");
    const dtHandle = gl.getUniformLocation(program, "u_dt");
    const resolutionHandle = gl.getUniformLocation(program, "u_resolution");

    gl.uniform2f(resolutionHandle, gl.canvas.width, gl.canvas.height);

    let time = performance.now() / 1000;

    const draw = () => {
      const now = performance.now() / 1000; // Get millis
      const dt = now - time;

      gl.uniform1f(timeHandle, now);
      gl.uniform1f(dtHandle, dt);

      time = now;

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(draw);
    };

    draw();
  }, [gl, props.fragmentShader, props.vertexShader]);

  return <canvas ref={canvasRef} {...props.canvasProps} />;
};
