precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {
  // Sample texture with some distortion
  vec2 uv = v_uv;
  vec4 texColor = texture2D(u_texture, uv);
  
  // Add some color cycling
  gl_FragColor = vec4(texColor.rgba);
}
