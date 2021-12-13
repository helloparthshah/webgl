#version 300 es
precision mediump float;

// Passed in from the vertex shader
in vec3 v_color;

// Final color
out vec4 out_color;

void main() {
    out_color = vec4(v_color, 1.0);
}
