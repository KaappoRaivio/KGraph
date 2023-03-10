export default `#version 300 es
    in vec3 a_position;

    void main() {
        /*vec2 position = (u_matrix * vec3(a_position, 1)).xy;
        gl_Position = vec4( position, 0., 1.0 );*/
        gl_Position = vec4(a_position, 1.0);
    }
`;
