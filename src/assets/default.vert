#version 300 es
precision highp float;

in vec2 a_position;

out vec2 v_texCoord;

void main() {
    // Pass through position directly (assuming quad vertices are in [-1,1] space)
    gl_Position = vec4(a_position, 0, 1);
    
    // Convert position from [-1,1] to [0,1] texture coordinates
    v_texCoord = a_position * 0.5 + 0.5;
}
