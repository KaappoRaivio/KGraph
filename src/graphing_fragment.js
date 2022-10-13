export default implicitFunction => `
uniform mat3 u_matrix;
uniform float time;
uniform vec2 resolution;

vec4 color(vec2 position) {
    float x = position.x;
    float y = position.y;


    //float value = abs(sin(pow(x, 2.) + 2. * x * y)) - sin(x - 2. * y);
    //float value = sin(pow(x, 2.)) - y;
    //float value = exp(sin(x) + cos(y)) - sin(exp(x+y));
    float value = ${implicitFunction};
    //float value = pow(x, 2.) - y;
    //float value = pow(x, 2.) + pow(y, 2.) - 2.;

    bool positive =  value > 0.;

    float red = positive ? 1. : 0.;
    float green = positive ? 1. : 0.;
    float blue = positive ? 1. : 0.;

    return vec4(red, green, blue, 1);
}

vec2 getUV(vec2 fragCoord) {
    float scale = min(resolution.x, resolution.y);

    
    return ((fragCoord / scale) - 0.5) * 2.;
}

void main( void ) {
    float scale = min(resolution.x, resolution.y);
    float offset = (max(resolution.x, resolution.y) - min(resolution.x, resolution.y)) / 2.;

    const int step = 1;
    
    const float mul = 2.;
    const float add = -0.5;

    vec2 uv = getUV(gl_FragCoord.xy); 
    
    vec2 position1 = (u_matrix * vec3(uv + getUV(vec2(-step, -step)), 1)).xy;
    vec2 position1_h = (u_matrix * vec3(uv + getUV(vec2(step, step)), 1)).xy;  
    
    vec4 diff1 = 1. - abs(color(position1) - color(position1_h));

    vec2 position2 = (u_matrix * vec3(uv + getUV(vec2(step, -step)), 1)).xy;
    vec2 position2_h = (u_matrix * vec3(uv + getUV(vec2(-step, step)), 1)).xy;

    vec4 diff2 = 1. - abs(color(position2) - color(position2_h));

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

    gl_FragColor = (diff1 + diff2) / 1.;
    // gl_FragColor = vec4( uv.x, uv.y - uv.x, uv.x + uv.y, 1.0 );

}
`;
