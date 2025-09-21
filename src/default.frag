#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform sampler2D u_water;

out vec4 fragColor;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;

    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

// 4x4 Bayer matrix for ordered dithering
const mat4 bayer4x4 = mat4(
        0.0, 8.0, 2.0, 10.0,
        12.0, 4.0, 14.0, 6.0,
        3.0, 11.0, 1.0, 9.0,
        15.0, 7.0, 13.0, 5.0
    ) / 16.0;

float smoke(vec2 pos, float time) {
    return fbm(pos * 7.0 * vec2(fbm(pos - (time / 32.0)), fbm(pos / 2.0 - (time / 8.0))));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy * 10.0;

    float dist = clamp(length(u_mouse - gl_FragCoord.xy) / 200.0, 0.0, 1.0);
    float depth = smoke(st / 6.0, u_time);
    depth = mix(depth, dist, 0.3);

    float dither = bayer4x4[int(mod(gl_FragCoord.x, 4.0))][int(mod(gl_FragCoord.y, 4.0))];
    float levels = 3.0;
    float dithered_depth = depth + dither / levels;
    float quantized_depth = floor(dithered_depth * levels) / levels;

    fragColor = vec4(vec3(quantized_depth), 1.0);
}
