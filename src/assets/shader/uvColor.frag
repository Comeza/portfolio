#version 300 es

precision mediump float;

out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 color = texture(u_texture, vec2(st.x, 0.5-st.y));
  fragColor = vec4(color.rgb, 1.0);
}
