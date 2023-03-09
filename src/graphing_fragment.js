export default (implicitFunction, eliminateVertical, sliders) => `
precision highp float;


uniform mat3 u_matrix;
uniform vec2 resolution;
uniform int zoom;

${sliders.map(name => `uniform float ${name};`).join("\n")}


#define c 1. / ppow(2., float(zoom))
#define C  c / min(resolution.x, resolution.y)
#define MAX_ITERATIONS 500

float ppow( float x, float y )  {
  if (y >= 0.) 
    return x >= 0. ? pow(x, y) : (mod(y, 2.0) == 0. ? pow(-x, y) : -pow(-x, y));
  else {
    float p = abs(y);
    return 1. / (x >= 0. ? pow(x, p) : (mod(p, 2.0) == 0. ? pow(-x, p) : -pow(-x, p)));
  }
}

float round (float inp) {
  return floor(inp + 0.5);
}

vec4 color(vec2 position) {
    float x = position.x;
    float y = position.y;

    float value = ${implicitFunction};
    // float value = x;

    // return vec4((value + 0.5), (value + 0.5), (value + 0.5), 1);

    bool positive =  value > 0.;

    float red = positive ? 1. : 0.;
    float green = positive ? 1. : 0.;
    float blue = positive ? 1. : 0.;

    return vec4(red, green, blue, 1);
}

vec2 nextMandel (vec2 z, vec2 constant) {
    float zr = z.x * z.x - z.y * z.y;
    float zi = 2.0 * z.x * z.y;

    return vec2(zr, zi) + constant;
    // float zr = constant.x * constant.x - constant.y * constant.y;
    // float zi = 2.0 * constant.x * constant.y;
    //
    // return vec2(zr, zi) + z ;
}

float squared(vec2 v) {
    return v.x * v.x + v.y * v.y;
}

float mandel(vec2 z0, vec2 constant) {
    vec2 zn = z0;
    
    int result = MAX_ITERATIONS;
    float length = 0.;
    
    for (int iteration = 0; iteration < MAX_ITERATIONS; ++iteration) {
        zn = nextMandel(zn, constant);
        
        if (squared(zn) >= 4.0 && result == MAX_ITERATIONS) {
            result = iteration;
            length = sqrt(squared(zn));
        }
        // iteration++;
    }

    // float length = sqrt(squared(zn));
    float smooth = float(result) - log2(max(1.0, log2(length)));
    return smooth;
    // return result;
}


bool logistic (vec2 uv) {
    float r = uv.x;
    float res1 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS; ++iteration) {
        res1 = r * res1 * (1. - res1);
    }
    
    float res2 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS + 1; ++iteration) {
        res2 = r * res2 * (1. - res2);
    }
    
    float res3 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS + 2; ++iteration) {
        res3 = r * res3 * (1. - res3);
    }
    
    float res4 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS + 3; ++iteration) {
        res4 = r * res4 * (1. - res4);
    }
    
    float res5 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS + 4; ++iteration) {
        res5 = r * res5 * (1. - res5);
    }
    
    float res6 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS + 5; ++iteration) {
        res6 = r * res6 * (1. - res6);
    }
    
    float res7 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS + 6; ++iteration) {
        res7 = r * res7 * (1. - res7);
    }
    
    float res8 = .5;
    for (int iteration = 0; iteration < MAX_ITERATIONS + 7; ++iteration) {
        res8 = r * res8 * (1. - res8);
    }
    
    
    return abs(res1 - uv.y) < 0.001
    || abs(res2 - uv.y) < 0.001
    || abs(res3 - uv.y) < 0.001
    || abs(res4 - uv.y) < 0.001;
}



vec2 getUV(vec2 fragCoord) {   
    float overlapW = (resolution.x - resolution.y) / (2. * resolution.y);
    float overlapH = (resolution.y - resolution.x) / (2. * resolution.x);
    
    float scale = min(resolution.x, resolution.y) * ${window.devicePixelRatio};
    
    
    vec2 uv = (((fragCoord / scale) - vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.))) * 1.);
    
    // + vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.));
    return (u_matrix * vec3(uv, 1.)).xy;
}

vec2 getCamera (vec2 uv) {
  return (u_matrix * vec3(uv, 1.)).xy;
}

vec4 shade (vec2 position) {
    // float scale = min(resolution.x, resolution.y);
    float step = 1.5 * C;
    
    if (${eliminateVertical}) {
        // float stepV = 2. * C;
        float stepV = 0.1;
        float stepV2 = 1.;
    
        vec2 testVertical = position + vec2(stepV, stepV2);
        vec2 testVertical_h = position + vec2(-stepV, stepV2);
        
        vec4 testVerticalDiff = color(testVertical) - color(testVertical_h);
        
        vec2 testVertical1 = position + vec2(0, stepV);
        vec2 testVertical1_h = position + vec2(0, -stepV);
        vec4 testVerticalDiff1 = color(testVertical1) - color(testVertical1_h);
    
        if (abs(testVerticalDiff.x) > 0. && testVerticalDiff1.x == 0.) return vec4(1, 1, 1, 1); 
    }
   
   
    
    
    
   
   
    vec2 position1 = position + vec2(-step, -step);        
    vec2 position1_h = position + vec2(step, step);  
    
    // vec2 position1 = position + vec2(-step, 0);        
    // vec2 position1_h = position + vec2(step, 0);  


    vec4 diff1 = 1. - abs(color(position1) - color(position1_h));

    vec2 position2 = position + vec2(step, -step);
    vec2 position2_h = position + vec2(-step, step);
    
    // vec2 position2 = position + vec2(0, -step);
    // vec2 position2_h = position + vec2(0, step);

    vec4 diff2 = 1. - abs(color(position2) - color(position2_h));
    
    return min(diff2, diff1);
    // return color(position);
}

bool isAxis (vec2 coord) {
  return false;
  return abs(coord.x) < C || abs(coord.y) < C;
}

bool isAxisTick (vec2 coord, float pitch) {
  return false;
  float y = coord.y;
  float x = coord.x; 

  return abs(y) < C * 10. && abs(mod(x, pitch) - pitch) < 3. * C 
      || abs(x) < C * 10. && abs(mod(y, pitch) - pitch) < 3. * C;
}


bool isGrid (vec2 coord, float pitch) {
return false;
  return abs(mod(coord.x, pitch) - pitch) < 1. * C || abs(mod(coord.y, pitch) - pitch) < 1. * C;
  
  // return abs(x * scale - floor(x * scale + 0.5)) < 0.001 * C 
  //     || abs(y * scale - floor(y * scale + 0.5)) < 0.001 * C;
}

void main( void ) {
    vec2 uv = getUV(gl_FragCoord.xy); 

    float x = uv.x;
    float y = uv.y;

    if (isAxis(uv)) {
        gl_FragColor = vec4(1, 0, 0, 1);
        return;
    }
    
    
    
    vec4 functionColor = shade(uv);
    // vec4 functionColor = color(uv);
    if (functionColor != vec4(1, 1, 1, 1)) {
      gl_FragColor = functionColor;
      return;
    }
    
    float iterations = mandel(uv, vec2(a, b));
    float a = iterations / float(MAX_ITERATIONS);
    gl_FragColor = vec4(a, a, a, 1);
    return;
    
    
    // bool isCurve = logistic(uv);
    // float a = float(isCurve) * 1.;
    // gl_FragColor = vec4(a, a, a, 1);
    // return;
    
    
    float scalerMajor = 1. / ppow(2., floor(float(zoom))) / 8.;
    if (isGrid(uv, scalerMajor, 0.05)) {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 0.5);
        return;
    }
    
    float scalerMinor = 1. / ppow(2., floor(float(zoom))) / 32.;
    if (isGrid(uv, scalerMinor, 0.1)) {
        gl_FragColor = vec4(0.0001, 0.0001, 0.0001, 0.25);
        return;
    }
    
    if (isAxisTick(uv, scalerMajor * 1.)) {
        gl_FragColor = vec4(1, 0, 0, 1);
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
    
    // gl_FragColor = result / 4.;
}
`;
