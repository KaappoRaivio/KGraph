import { expressionToGLSL } from "./workers/glslUtils";

const hex2glsl = hex => {
  try {
    const color = hex.slice(1);
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    return `vec4(${(r / 255).toFixed(10)}, ${(g / 255).toFixed(10)}, ${(b / 255).toFixed(10)}, 1.)`;
  } catch (error) {
    console.error("hex2glsl");
    throw error;
  }
};

export default (input, eliminateVertical, sliders) => {
  return `#version 300 es
    precision highp float;
    
    in vec4 position;
    
    uniform mat3 u_matrix;
    uniform vec2 resolution;
    uniform float zoom;
    
    ${sliders.map(name => `uniform float ${name};`).join("\n")}
    
    
    #define c 1. / ppow(2., float(zoom))
    #define C  c / min(resolution.x, resolution.y)
    #define MAX_ITERATIONS 200
    
    float ppow( float x, float y )  {
      if (y >= 0.) 
        return x >= 0. ? pow(x, y) : (mod(y, 2.0) == 0. ? pow(-x, y) : -pow(-x, y));
      else {
        float p = abs(y);
        return 1. / (x >= 0. ? pow(x, p) : (mod(p, 2.0) == 0. ? pow(-x, p) : -pow(-x, p)));
      }
    }

    vec2 nextMandel (vec2 z, vec2 constant) {
        float zr = z.x * z.x - z.y * z.y;
        float zi = 2.0 * z.x * z.y;
    
        return vec2(zr, zi) + constant;
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
        }

        float smoothed = float(result) - log2(max(1.0, log2(length)));
        return smoothed;
    }
    
    
    bool logistic (vec2 uv) {
        float r = uv.x;
        float res1 = .5;
        
        bool isCurve = false;
        
        for (int iteration = 0; iteration < MAX_ITERATIONS * 1; ++iteration) {
            res1 = r * res1 * (1. - res1);
            if (iteration > int(float(MAX_ITERATIONS) * 0.9) && abs(res1 - uv.y) < C* 1.) {
                isCurve = true;
            };
        }
        
        return isCurve;
    }
    
    vec2 getUV(vec2 fragCoord) {   
        float overlapW = (resolution.x - resolution.y) / (2. * resolution.y);
        float overlapH = (resolution.y - resolution.x) / (2. * resolution.x);
        
        float scale = min(resolution.x, resolution.y) * ${window.devicePixelRatio.toFixed(10)};
        
        
        vec2 uv = (((fragCoord / scale) - vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.))) * 1.);
        
        return (u_matrix * vec3(uv, 1.)).xy;
    }
    
    vec2 getCamera (vec2 uv) {
      return (u_matrix * vec3(uv, 1.)).xy;
    }

    out vec4 fragColor;
    void main( void ) {
        vec2 uv = getUV(gl_FragCoord.xy); 
    
        float x = uv.x;
        float y = uv.y;

        
        ${(fractal => {
          switch (fractal.selected) {
            case "mandelbrot":
            default:
              return `
              float iterations = mandel(vec2(0., 0.), uv);
              float a = iterations / float(MAX_ITERATIONS);
              if (a != 0.) fragColor = vec4(0., 0., 0., a);
              else fragColor = vec4(0, 0, 0, 0);
              return;
              `;
            case "julia":
              return `
              float iterations = mandel(uv, vec2(${expressionToGLSL(fractal.details.cr)}, ${expressionToGLSL(fractal.details.ci)}));
              float a = iterations / float(MAX_ITERATIONS);
              if (a != 0.) fragColor = vec4(0., 0., 0., a);
              else fragColor = vec4(0, 0, 0,0);
              return;
              `;
            case "feigenbaum":
              return `
              bool isCurve = logistic(uv);
              float a = float(isCurve) * 1.;
              fragColor = vec4(0, 0, 0, a);
              return;
              `;
          }
        })(input)}
    }
    `;
};
