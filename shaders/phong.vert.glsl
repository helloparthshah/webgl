#version 300 es

in vec3 a_position;
in vec3 a_color;
in vec2 a_texture;
in vec3 a_normal;

in vec3 a_vertex_tangent;
in vec3 a_vertex_bitangent;

uniform mat4 u_m_matrix;
uniform mat4 u_v_matrix;
uniform mat4 u_p_matrix;

out vec3 v_position;
out vec3 v_color;
out vec3 v_normal;
out highp vec2 v_texture;
out mat3 v_TBN;

void main() {

    v_position = vec3(u_m_matrix * vec4(a_position, 1.0));
    v_normal = normalize(mat3(transpose(inverse(u_m_matrix))) * a_normal);

    v_texture = a_texture;
    v_texture.y = 1.0 - v_texture.y;

    vec3 T = normalize(vec3(u_m_matrix * vec4(a_vertex_tangent, 0.0)));
    vec3 B = normalize(vec3(u_m_matrix * vec4(a_vertex_bitangent, 0.0)));
    vec3 N = normalize(vec3(u_m_matrix * vec4(a_normal, 0.0)));
    v_TBN = mat3(T, B, N);

    v_color = a_color;

    // Multiply the position by the matrix.
    gl_Position = u_p_matrix * u_v_matrix * u_m_matrix * vec4(a_position, 1.0);
}