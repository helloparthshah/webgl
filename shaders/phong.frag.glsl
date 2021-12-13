#version 300 es
precision mediump float;

// Data Structure Definitions
#define MAX_NUM_LIGHTS 10

struct PointLight {
    vec3 position;
    vec3 Is;
    vec3 Id;
    float k;
};

struct DirectionalLight {
    vec3 direction;
    vec3 Is;
    vec3 Id;
};

// Lighting Parameters
uniform vec3 Ia;
uniform int num_point_lights;
uniform PointLight point_lights[MAX_NUM_LIGHTS];
uniform int num_directional_lights;
uniform DirectionalLight directional_lights[MAX_NUM_LIGHTS];

// Material Parameters
uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float alpha;

// Camera Parameters
uniform vec3 u_camera_position;

uniform sampler2D u_texture;
uniform sampler2D u_normal_map;
uniform float t;
uniform float n;

// Passed in from the vertex shader
in vec3 v_position;
in vec3 v_normal;
in vec3 v_color;
in highp vec2 v_texture;
in mat3 v_TBN;

// Final color
out vec4 out_color;

void main() {

    vec3 position = v_position;
    vec3 N = v_normal;
    float a = alpha;
    if(alpha == 0.0)
        a = 0.0001;
    if(n == 1.0) {
        N = texture(u_normal_map, v_texture).rgb;
        N = N * 2.0 - 1.0;
        N = normalize(v_TBN * N);
    }

    vec3 V = normalize(u_camera_position - position);

    vec3 I = ka * Ia;
    for(int i = 0; i < num_point_lights; i++) {
        vec3 L = normalize(point_lights[i].position - position);
        vec3 R = normalize(reflect(-L, N));
        float d = distance(point_lights[i].position, position);
        float attenuation = 1.0 / (1.0 + point_lights[i].k * d * d);
        I += kd * max(dot(L, N), 0.0) * point_lights[i].Id * attenuation;
        I += ks * pow(max(dot(R, V), 0.0), a) * point_lights[i].Is * attenuation;
    }
    for(int i = 0; i < num_directional_lights; i++) {
        vec3 L = -normalize(directional_lights[i].direction);
        vec3 R = normalize(reflect(-L, N));
        I += kd * max(dot(L, N), 0.0) * directional_lights[i].Id;
        I += ks * pow(max(dot(R, V), 0.0), a) * directional_lights[i].Is;
    }
    if(t == 0.0) {
        out_color = vec4(v_color * I, 1.0);
    } else {
        out_color = vec4(texture(u_texture, v_texture).xyz * I, 1.0);
    }
    // out_color = vec4(v_color, 1.0);
}
