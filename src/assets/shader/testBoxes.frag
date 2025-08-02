#version 300 es

precision mediump float;
precision mediump int;

out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;

const float u_sprite_columns = 8.0;
const float u_sprite_rows = 1.0;
const int u_sprite_count = int(4);

uniform sampler2D u_texture;

vec2 spriteUV(int index, vec2 baseUV) {
	 // Calculate which column and row this index is in
    int column = index % int(u_sprite_columns);
    float row = floor(float(index) / u_sprite_columns);
    
    // Calculate the size of each sprite in UV space
    vec2 spriteSize = vec2(1.0 / u_sprite_columns, 1.0 / u_sprite_rows);
    
    // Offset the UV coordinates to the correct sprite
    vec2 offset = vec2(column, u_sprite_rows - 1.0 - row) * spriteSize;
    
    // Scale the baseUV to fit within the sprite and add the offset
    return (baseUV * spriteSize) + offset;
}

void main() {
	
  fragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
