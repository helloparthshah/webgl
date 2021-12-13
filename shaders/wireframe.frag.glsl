#version 300 es
precision mediump float;

in vec3 v_barycentric;

out vec4 fragColor;

float aastep(float threshold, float dist) {

    float afwidth = fwidth(dist) * 0.5;
    return smoothstep(threshold - afwidth, threshold + afwidth, dist);

}

vec4 getColorFromBarycentric(vec3 barycentric, vec4 color, float eps) {

    float d = min(min(barycentric.x, barycentric.y), barycentric.z);

    float edge = 1.0 - aastep(eps, d);

    return vec4(color.rgb, edge);

}

void main() {

    fragColor = getColorFromBarycentric(v_barycentric, vec4(0, 0, 0, 1), 0.01);

}
