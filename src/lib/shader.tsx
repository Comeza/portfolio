import { useEffect, useRef } from "react"

interface ShaderCanvasProps {
    fs: string,
    vs?: string,
    uniforms: Record<string, UniformValue>
}

const defaultVertexShader = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_uv = vec2(a_position.x * 0.5 + 0.5, 1.0 - (a_position.y * 0.5 + 0.5));
  }
`;

type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

type UniformValue = number | Vec2 | Vec3 | Vec4 | HTMLImageElement;

export function ShaderCanvas({ fs, vs = defaultVertexShader, uniforms }: ShaderCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const texturesRef = useRef<WebGLTexture[]>([]);
    const nextTextureUnitRef = useRef(0);

    uniforms['u_time'] ||= 0;
    uniforms['u_resolution'] ||= [0, 0];

    const loadTextures = async (gl: WebGLRenderingContext, uniforms: Record<string, UniformValue>) => {
        texturesRef.current.forEach(texture => gl.deleteTexture(texture));
        texturesRef.current = [];
        nextTextureUnitRef.current = 0;

        const textureUniforms: Record<string, { location: WebGLUniformLocation | null, unit: number }> = {};
        const texturePromises: Promise<void>[] = [];

        for (const [name, value] of Object.entries(uniforms)) {
            if (value instanceof HTMLImageElement) {
                const unit = nextTextureUnitRef.current++;
                textureUniforms[name] = { location: null, unit };

                const promise = new Promise<void>((resolve) => {
                    const texture = gl.createTexture();
                    texturesRef.current.push(texture);

                    gl.activeTexture(gl.TEXTURE0 + unit);
                    gl.bindTexture(gl.TEXTURE_2D, texture);

                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    if (value instanceof HTMLImageElement) {
                        if (value.complete && value.naturalWidth !== 0) {
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, value);
                            resolve();
                        } else {
                            value.onload = () => {
                                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, value);
                                resolve();
                            };
                            value.onerror = () => {
                                console.error('Failed to load texture: ', name);
                                resolve();
                            };
                        }
                    } else {
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, value);
                        resolve();
                    }
                });

                texturePromises.push(promise);
            }
        }

        await Promise.all(texturePromises);
        return textureUniforms;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        const program = createShaderProgram(gl, vs, fs);
        if (!program) return;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);


        const uniformLocations: Record<string, WebGLUniformLocation> = {};
        for (const name of Object.keys(uniforms)) {
            uniformLocations[name] = gl.getUniformLocation(program, name)!;
        }

        let textureUniforms: Record<string, { location: WebGLUniformLocation | null, unit: number }> = {};
        loadTextures(gl, uniforms).then(result => { textureUniforms = result });

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const render = (time: number) => {
            if (!gl || !program) return;

            const { width, height } = canvas.getBoundingClientRect();

            canvas.width = width;
            canvas.height = height;

            gl.viewport(0, 0, width, height);
            gl.useProgram(program);

            for (const [name, value] of Object.entries(uniforms)) {
                const location = uniformLocations[name];

                if (typeof value === 'number') { gl.uniform1f(location, value); }

                if (!Array.isArray(value)) continue
                if (value.length === 2) { gl.uniform2fv(location, value); }
                else if (value.length === 3) { gl.uniform3fv(location, value); }
                else if (value.length === 4) { gl.uniform4fv(location, value); }
            }

            for (const [_, { location, unit }] of Object.entries(textureUniforms)) {
                if (!location) continue
                gl.uniform1i(location, unit);
            }


            if ('u_time' in uniformLocations) gl.uniform1f(uniformLocations['u_time'], time * 0.001);
            if ('u_resolution' in uniformLocations) gl.uniform2f(uniformLocations['u_resolution'], width, height);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        }

        const animationFrame = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrame);
            gl.deleteProgram(program);
            texturesRef.current.forEach(texture => gl.deleteTexture(texture));
            texturesRef.current = [];
        }
    }, [fs, vs, uniforms]);

    return <canvas ref={canvasRef} style={{ height: "100%", width: "100%", display: "block" }} />
}

function createShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Shader program linking error: ", gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Shader compile error: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
