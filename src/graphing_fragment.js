import { expressionToGLSL, toGLSLFriendly } from "./workers/glslConverter.worker";
import { exp, im } from "mathjs";

const hex2glsl = hex => {
  const color = hex.slice(1);
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  console.log(`vec4(${(r / 255).toFixed(10)}, ${(g / 255).toFixed(10)}, ${(b / 255).toFixed(10)}, 1.)`);
  return `vec4(${(r / 255).toFixed(10)}, ${(g / 255).toFixed(10)}, ${(b / 255).toFixed(10)}, 1.)`;
};

export default (input, eliminateVertical, sliders) => {
  const implicitFunctions = input.filter(x => x.type === "function");

  const fractals = input.filter(x => x.type === "fractal");
  // console.log(implicitFunctions);
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
    
    ${implicitFunctions
      .map(
        (implicitFunction, index) => `
    vec4 color${index} (vec2 position) {
        float x = position.x;
        float y = position.y;
    
        float value = ${implicitFunction.glslSource.length > 0 ? implicitFunction.glslSource : "1."};
        
        bool positive =  value > 0.;
    
        float red = positive ? 1. : 0.;
        float green = positive ? 1. : 0.;
        float blue = positive ? 1. : 0.;
    
        return vec4(red, green, blue, 1);
    }
    `,
      )
      .join("\n")}

    ${implicitFunctions
      .map((implicitFunction, index) => {
        // console.log(implicitFunction.color, hex2glsl(implicitFunction.color));
        return `vec4 shade${index} (vec2 position) {
          float step = 1. * C;

          vec2 position1 = position + vec2(-step, -step);        
          vec2 position1_h = position + vec2(step, step);  

          vec4 diff1 = abs(color${index}(position1) - color${index}(position1_h));

          vec2 position2 = position + vec2(step, -step);
          vec2 position2_h = position + vec2(-step, step);

          vec4 diff2 = abs(color${index}(position2) - color${index}(position2_h));

          return max(diff1, diff2).z * ${hex2glsl(implicitFunction.color)};
      }`;
      })
      .join("\n")}

    


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
        float smoothed = float(result) - log2(max(1.0, log2(length)));
        return smoothed;
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
        
        float scale = min(resolution.x, resolution.y) * ${window.devicePixelRatio.toFixed(10)};
        
        
        vec2 uv = (((fragCoord / scale) - vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.))) * 1.);
        
        // + vec2(0.5 + max(overlapW, 0.), 0.5 + max(overlapH, 0.));
        return (u_matrix * vec3(uv, 1.)).xy;
    }
    
    vec2 getCamera (vec2 uv) {
      return (u_matrix * vec3(uv, 1.)).xy;
    }

    
    out vec4 fragColor;
    void main( void ) {
        // fragColor = vec4(1, 0.5, 0.5, 1);
        // return;
        vec2 uv = getUV(gl_FragCoord.xy); 
    
        float x = uv.x;
        float y = uv.y;
          
        
        
        
        vec4 funcColor = (${
          implicitFunctions.length > 0 ? implicitFunctions.map((_, index) => `shade${index}(uv)`).join(" + ") : "vec4(0, 0, 0, 0)"
        });
        
        // fragColor = vec4(min(funcColor, 0.5).xyz, 1);
        // return;
        
        if (funcColor.z != 0.) {
            fragColor = funcColor;
            return;
        }
        
        // fragColor = vec4(1, 0, 1, 1);
        // return;
        
        ${fractals.map(fractal => {
          console.log(fractal);
          switch (fractal.selected) {
            case "mandelbrot":
            default:
              return `
              float iterations = mandel(vec2(0., 0.), uv);
              float a = iterations / float(MAX_ITERATIONS);
              fragColor = vec4(1. - a, 1. - a, 1. - a, 1);
              return;
              `;
            case "julia":
              return `
              float iterations = mandel(uv, vec2(${expressionToGLSL(fractal.details.cr)}, ${expressionToGLSL(fractal.details.ci)}));
              float a = iterations / float(MAX_ITERATIONS);
              fragColor = vec4(1. - a, 1. - a, 1. - a, 1);
              return;
              `;
          }
          // console.log(fractal);
          //       return `
          //   // float iterations = mandel(uv, ve
          // `;
        })}
        // float iterations = mandel(vec2(0., 0.), uv);
        // float iterations = mandel(uv, vec2(0.285, 0.01));
        // float a = iterations / float(MAX_ITERATIONS);
        // fragColor = vec4(1. - a, 1. - a, 1. - a, 1);
        // return;
        
        
        // bool isCurve = logistic(uv);
        // float a = float(isCurve) * 1.;
        // fragColor = vec4(a, a, a, 1);
        // return;
        
        // const int antialias = 4;
        //
        // vec4 result = vec4(0., 0., 0., 1.);
        // for (int y = -antialias; y < antialias; ++y) {
        //   for (int x = -antialias; x < antialias; ++x) {
        //     vec2 diff = vec2((y - antialias) / (antialias * 2), (x - antialias) / (antialias * 2)) / scale;
        //     result += 1. - shade(uv + diff);
        //   }
        // }
        
        // fragColor = result / 4.;
    }
    `;
};
