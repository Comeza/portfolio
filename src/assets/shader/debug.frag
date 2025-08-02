#version 300 es

precision highp float;

uniform sampler2D u_spriteAtlas;
uniform vec2 u_atlasSize;    // Number of columns and rows (e.g., vec2(4,4) for 4x4 atlas)
uniform float u_tileSize;    // Size of each tile in screen space (0-1)
uniform float u_time;        // Optional for animated noise

uniform vec2 u_resolution;

in vec2 v_texCoord;
out vec4 fragColor;


void main() {
    fragColor = texture2D(u_spriteAtlas, gl_FragCoord.xy / u_resolution);
} 