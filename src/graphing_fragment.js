export default implicitFunction => `
uniform mat3 u_matrix;
uniform vec2 resolution;
uniform int zoom;

#define C  1. / ppow(2., float(zoom))

float ppow( float x, float y )  {
  if (y >= 0.) 
    return x >= 0. ? pow(x, y) : (mod(y, 2.0) == 0. ? pow(-x, y) : -pow(-x, y));
  else {
    float p = abs(y);
    return 1. / (x >= 0. ? pow(x, p) : (mod(p, 2.0) == 0. ? pow(-x, p) : -pow(-x, p)));
  }
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
    
    
    vec2 uv = (((fragCoord / scale) - vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.))) * 1.);// + vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.));
    return (u_matrix * vec3(uv, 1.)).xy;
}

vec2 getCamera (vec2 uv) {
  return (u_matrix * vec3(uv, 1.)).xy;
}

vec4 shade (vec2 position) {
    float scale = min(resolution.x, resolution.y);

   
    float step = 1. * C;
    vec2 position1 = position + vec2(-step, -step) / scale;        
    vec2 position1_h = position + vec2(step, step) / scale;  
    
    vec4 diff1 = 1. - abs(color(position1) - color(position1_h));

    vec2 position2 = position + vec2(step, -step) / scale;
    vec2 position2_h = position + vec2(-step, step) / scale;

    vec4 diff2 = 1. - abs(color(position2) - color(position2_h));
    
    return min(diff2, diff1);
    // return color(position);
}

bool isAxis (vec2 coord) {
  return abs(coord.x) < 0.0025 * C || abs(coord.y) < 0.0025 * C;
}

bool isAxisTick (vec2 coord) {
  float y = coord.y;
  float x = coord.x; 

  return abs(y) < 0.01 * C && abs(x - floor(x + 0.5)) < 0.005 * C 
      || abs(x) < 0.01 * C && abs(y - floor(y + 0.5)) < 0.005 * C;
}

bool isMajorGrid (vec2 coord) {
  float y = coord.y;
  float x = coord.x; 
  
  return abs(x - floor(x + 0.5)) < 0.001 * C 
      || abs(y - floor(y + 0.5)) < 0.001 * C;
}

void main( void ) {
    float scale = min(resolution.x, resolution.y);
    float offset = (max(resolution.x, resolution.y) - min(resolution.x, resolution.y)) / 2.;

    vec2 uv = getUV(gl_FragCoord.xy); 

    float x = uv.x;
    float y = uv.y;

    if (isAxis(uv)) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }
    
    if (isAxisTick(uv)) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }
    
    if (isMajorGrid(uv)) {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1);
        return;
    }
    
    
    // const int antialias = 4;
    //
    // vec4 result = vec4(0., 0., 0., 1.);
    // for (int y = -antialias; y < antialias; ++y) {
    //   for (int x = -antialias; x < antialias; ++x) {
    //     vec2 diff = vec2((y - antialias) / (antialias * 2), (x - antialias) / (antialias * 2)) / scale;
    //     result += 1. - shade(uv + diff);
    //   }
    // }
    
    gl_FragColor = shade(uv);
    // gl_FragColor = result / 4.;
}
`;
