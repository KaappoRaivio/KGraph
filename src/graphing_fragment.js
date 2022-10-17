export default implicitFunction => `
uniform mat3 u_matrix;
uniform vec2 resolution;

float ppow( float x, float y ) {
  return x >= 0. ? pow(x, y) : (mod(y, 2.0) == 0. ? pow(-x, y) : -pow(-x, y)); 
}

vec4 color(vec2 position) {
    float x = position.x;
    float y = position.y;

    float value = ${implicitFunction};

    bool positive =  value > 0.;

    float red = positive ? 1. : 0.;
    float green = positive ? 1. : 0.;
    float blue = positive ? 1. : 0.;

    return vec4(red, green, blue, 1);
}


vec2 getUV(vec2 fragCoord) {   
    float overlapW = (resolution.x - resolution.y) / (2. * resolution.y);
    float overlapH = (resolution.y - resolution.x) / (2. * resolution.x);
    
    float scale = min(resolution.x, resolution.y);
    
    
    vec2 uv = (((fragCoord / scale) - vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.))) * 2.) + vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.));
    return (u_matrix * vec3(uv, 1.)).xy;
}

vec2 getCamera (vec2 uv) {
  return (u_matrix * vec3(uv, 1.)).xy;
}

vec4 shade (vec2 position) {
    const int step = 1;
    vec2 position1 = position + getUV(vec2(-step, -step));        
    vec2 position1_h = position + getUV(vec2(step, step));  
    
    vec4 diff1 = 1. - abs(color(position1) - color(position1_h));

    vec2 position2 = position + getUV(vec2(step, -step));
    vec2 position2_h = position + getUV(vec2(-step, step));

    vec4 diff2 = 1. - abs(color(position2) - color(position2_h));
    
    return min(diff2, diff1);
}

bool isAxis (vec2 coord) {
  return abs(coord.x) < 0.01 || abs(coord.y) < 0.01;
}

bool isAxisTick (vec2 coord) {
  float y = coord.y;
  float x = coord.x; 

  return abs(y) < 0.05 && abs(x - floor(x + 0.5)) < 0.02 
      || abs(x) < 0.05 && abs(y - floor(y + 0.5)) < 0.02;
}

void main( void ) {
    float scale = min(resolution.x, resolution.y);
    float offset = (max(resolution.x, resolution.y) - min(resolution.x, resolution.y)) / 2.;

    vec2 uv = getUV(gl_FragCoord.xy); 

    float x = uv.x;
    float y = uv.y;

    if (isAxis(uv + getUV(vec2(1, 1)))) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }
    
    if (isAxisTick(uv + getUV(vec2(1, 1)))) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }
    
    
    const int antialias = 2;
    
    // vec3 result = vec4(0., 0., 0., 1.);
    // for (int y = -antialias; y < antialias; ++y) {
    //   for (int x = -antialias; x < antialias; ++x) {
    //     result += shade(uv + getUV(vec2(y / (antialias * 2), x / (antialias * 2))));
    //   }
    // }
    
    gl_FragColor = shade(uv);
}
`;
