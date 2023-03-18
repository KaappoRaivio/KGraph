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
  console.log(input);
  // const implicitFunctions = input.filter(x => x.type === "function");

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
    
    
    bool isPositive (vec2 position) {
        float x = position.x;
        float y = position.y;
    
        float value = ${input.glslSource.length > 0 ? input.glslSource : "1."};
        return value > 0.;
    }
    
    bool isLine(vec2 position, float step) {
        vec2 position1 = position + vec2(-step, -step);        
        vec2 position1_h = position + vec2(step, step);  

        int diff1 = abs(int(isPositive(position1)) - int(isPositive(position1_h)));

        vec2 position2 = position + vec2(step, -step);
        vec2 position2_h = position + vec2(-step, step);

        int diff2 = abs(int(isPositive(position2)) - int(isPositive(position2_h)));
        
        return max(diff1, diff2) == 1;
    }

    #define ANTIALIAS 5
    vec4 shade (vec2 position) {
          float result = 0.;
    
          for (int i = 0; i < ANTIALIAS; ++i) {
            float scaler = ppow(2., float(-i));
            float step = C * scaler;

            bool line = isLine(position, step);
            // result += float(line) / float(ANTIALIAS - i);            
            result += float(line) / float(ANTIALIAS);            
          }
    
          return result * ${hex2glsl(input.color)};
          // return result * vec4(0.0, 0.0, 0.0, 1.);
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
        vec2 uv = getUV(gl_FragCoord.xy); 
    
        float x = uv.x;
        float y = uv.y;
        
        vec4 funcColor = shade(uv);
        if (funcColor.w != 0.) fragColor = funcColor;
        else fragColor = vec4(0, 0, 0, 0);
    }
    `;
};
