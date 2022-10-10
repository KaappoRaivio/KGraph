export default `
uniform mat3 u_matrix;
uniform float time;
uniform vec2 resolution;

vec4 color(vec2 position) {
    float x = position.x;
    float y = position.y;


    //float value = abs(sin(pow(x, 2.) + 2. * x * y)) - sin(x - 2. * y);
    //float value = sin(pow(x, 2.)) - y;
    float value = exp(sin(x) + cos(y)) - sin(exp(x+y));
    //float value = pow(x, 2.) - y;
    //float value = pow(x, 2.) + pow(y, 2.) - 2.;

    bool positive =  value > 0.;

    float red = positive ? 1. : 0.;
    float green = positive ? 1. : 0.;
    float blue = positive ? 1. : 0.;

    return vec4(red, green, blue, 1);
}

void main( void ) {
    float scale = min(resolution.x, resolution.y);

    const int step = 1;

    vec2 position1 = 2. * (u_matrix * vec3((-0.5 + (gl_FragCoord.xy + vec2(-step, -step)) / scale), 1)).xy;
    vec2 position1_h = 2. * (u_matrix * vec3((-0.5 + (gl_FragCoord.xy + vec2(step, step)) / scale), 1)).xy;

    vec4 diff1 = 1. - abs(color(position1) - color(position1_h));

    vec2 position2 = 2. * (u_matrix * vec3((-0.5 + (gl_FragCoord.xy + vec2(step, -step)) / scale), 1)).xy;
    vec2 position2_h = 2. * (u_matrix * vec3((-0.5 + (gl_FragCoord.xy + vec2(-step, step)) / scale), 1)).xy;

    vec4 diff2 = 1. - abs(color(position2) - color(position2_h));

    //vec4 diff = abs(color(position) - color(position_h));

    float x = position1.x;
    float y = position1.y;

    if (abs(x) < 0.01) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }

    if (abs(y) < 0.01) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }

    if (abs(y) < 0.1 && abs(x - floor(x + 0.5)) < 0.02) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }

    if (abs(x) < 0.1 && abs(y - floor(y + 0.5)) < 0.02) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }

    gl_FragColor = (diff1 + diff2) / 2.;
    //gl_FragColor = vec4( red, green, blue, 1.0 );

}
`;
