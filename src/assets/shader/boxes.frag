#version 300 es
precision highp float;

uniform vec2 u_resolution;

uniform sampler2D u_texture;
uniform vec2 u_atlasSize;    // Number of columns and rows (e.g., vec2(4,4) for 4x4 atlas)
uniform float u_tileSize;    // Size of each tile in screen space (0-1)
uniform float u_time;        // Optional for animated noise

in vec2 v_texCoord;
out vec4 fragColor;

const float SIZE = 20.0;

#define tileCount (u_atlasSize.x * u_atlasSize.y)

vec3 rgb(float r, float g, float b) {
    return vec3(r, g, b) / vec3(255);
}

vec3 rgb(int r, int g, int b) {
    return vec3(r, g, b) / vec3(255);
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 getSpriteUV(int idx, vec2 st) {

    vec2 tuv = st / u_atlasSize;
    vec2 spriteSize = 1.0 / u_atlasSize;

    float index = mod(float(idx), u_atlasSize.x * u_atlasSize.y);

    float dx = mod(index, u_atlasSize.x);
    float dy = floor(index / u_atlasSize.x);

    // texture coordinates origin is at bottom left, while index starts at top left
    dy = u_atlasSize.y - 1.0 - dy;

    return tuv + spriteSize * vec2(dx, dy);
}


float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float expStep( float x, float k, float n ){
    return exp( -k*pow(x,n) );
}

void main() {
    vec2 localUV = mod(gl_FragCoord.xy, SIZE) / SIZE;
    vec2 gridPos = floor(gl_FragCoord.xy / SIZE);

    vec2 offset = vec2(u_time * 0.01);
    int index = int(expStep(noise(gridPos / SIZE + offset), 5.4, 0.6) * tileCount);

    vec2 spriteUV = getSpriteUV(index, localUV);
    vec4 texture = texture(u_texture, vec2(spriteUV.x, 1.0 - spriteUV.y));

    vec3 bg = rgb(25, 23, 36);
    vec3 surface = rgb(235, 188, 186);

    vec3 color = bg * (1.0 - texture.a)
        + (surface * texture.rgb) * texture.a;

    fragColor = vec4(color, 1);
}