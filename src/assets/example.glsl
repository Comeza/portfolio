precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 color = vec3(uv.x, uv.y, sin(u_time));
  gl_FragColor = vec4(color, 1.0);
}
