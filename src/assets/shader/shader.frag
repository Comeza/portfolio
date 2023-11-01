#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dt;

#define time u_time
#define res u_resolution


float random(vec2 pos) {
	return fract(1.0 * sin(pos.y + fract(80.0 * sin(pos.x))));
}

float noise(vec2 pos) {
	vec2 i = floor(pos);
	vec2 f = fract(pos);
	float a = random(i + vec2(0.0, 0.0));
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 rotate(vec3 item, float deg) {
	mat3 rot = mat3(cos(deg), sin(deg), 0, -sin(deg), cos(deg), 0, 0, 0, 1);
	return rot * item;
}

float fbm(vec2 pos) {
	float v = 0.0;
	float a = 0.5;
	float degree = 0.15;

	vec2 offset = vec2(100.0);

	for (int i=0; i < 12; i++) {
		v += a * noise(pos);
		pos = rotate(vec3(pos, 0), degree).xy * 2. + offset;
		a *= 0.55;
	}

	return v;
}

vec3 smoke() {
	vec2 pos = (gl_FragCoord.xy - res) / min(res.x, res.y);
	float f = fbm(pos * 7.0 * vec2(fbm(pos - (time / 32.0)), fbm(pos / 2.0 - (time / 8.0))));
	vec3 color = vec3(0.04, 0.5, 1.0) * (f * 0.5);
	
	return rotate(color, u_time * .1);
}

vec2 mod_vec2(vec2 v, float m) {
	return vec2(mod(v.x, m), mod(v.y, m));
}

vec3 ascii(vec3 color) {
	return color;
}

void main() {
	// gl_FragColor = vec4(ascii(vec3(0)), 1.0);
	// gl_FragColor = texture2D(u_texture, vec2(0));
	// gl_FragColor = vec4(gl_FragCoord.xy / res, 1.0, 1.0);
	gl_FragColor = vec4(smoke(), 1.0);
}
