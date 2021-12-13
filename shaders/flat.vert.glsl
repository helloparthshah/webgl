#version 300 es

in vec3 a_position;
in vec3 a_color;

uniform mat4 u_m_matrix;
uniform mat4 u_v_matrix;
uniform mat4 u_p_matrix;

out vec3 v_color;

void main() {

    v_color = a_color;

    // Multiply the position by the matrix.
    gl_Position = u_p_matrix * u_v_matrix * u_m_matrix * vec4(a_position, 1.0);
}