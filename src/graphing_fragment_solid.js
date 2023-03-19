import { expressionToGLSL } from "./workers/glslUtils";

const hex2glsl = hex => {
  const color = hex.slice(1);
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  return `vec4(${(r / 255).toFixed(10)}, ${(g / 255).toFixed(10)}, ${(b / 255).toFixed(10)}, 1.)`;
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
      // if (x < 0. || x == 0. && y <= 0.) {
      //   return NaN;
      // }
      if (y >= 0.)
        return pow(x, y); 
        // return x >= 0. ? pow(x, y) : (mod(y, 2.0) == 0. ? pow(-x, y) : -pow(-x, y));
      else {
        float p = abs(y);
        return 1. / pow(2., p);
        // return 1. / (x >= 0. ? pow(x, p) : (mod(p, 2.0) == 0. ? pow(-x, p) : -pow(-x, p)));
      }
    }
    
    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
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
    
    float gamma = 1. / 2.4;
    vec3 toLinear (vec3 color) {
      return vec3(pow(color.x, gamma), pow(color.y, gamma), pow(color.z, gamma));
    }
    
    vec3 toGamma (vec3 color) {
      return vec3(pow(color.x, 1. / gamma), pow(color.y, 1. / gamma), pow(color.z, 1. / gamma));
    }

    out vec4 fragColor;
    void main( void ) {
        vec2 uv = getUV(gl_FragCoord.xy); 
    
        float x = uv.x;
        float y = uv.y;
        
        // float gamma = 1. / 2.4;
        
        float z = clamp(map(${input.glslSource.length > 0 ? input.glslSource : "0"}, ${expressionToGLSL(input.min)}, ${expressionToGLSL(
    input.max,
  )}, 0., 1.), 0., 1.);
        
        vec3 color = ${hex2glsl(input.color)}.xyz;
        vec3 color_gamma = toLinear(color) * z;
        
        vec3 background_gamma = toLinear(vec3(1., 1., 1.)) * (1. - z);
        
        vec3 blend = toGamma(color_gamma + background_gamma);  
        fragColor = vec4(blend, 1.);
        // fragColor = vec4(${hex2glsl(input.color)}.xyz, pow(z, 2.4));
        
        
        // vec4 funcColor = shade(uv);
        // if (funcColor.w != 0.) fragColor = funcColor;
        // else fragColor = vec4(0, 0, 0, 0);
    }
    `;
};
