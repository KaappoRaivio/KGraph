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
      if (y >= 0.) 
        return x >= 0. ? pow(x, y) : (mod(y, 2.0) == 0. ? pow(-x, y) : -pow(-x, y));
      else {
        float p = abs(y);
        float divisor = x >= 0. ? 
                      pow(x, p) : 
                      (mod(p, 2.0) == 0. ? 
                              pow(-x, p) : 
                              -pow(-x, p)
                       );
        
        return 1. / divisor;
      }
    }
    
    
    float getValue (vec2 position) {
        float x = position.x;
        float y = position.y;
    
        float value = ${input.glslSource.length > 0 ? input.glslSource : "1."};
        return value;
    }
    
    bool isLine(vec2 position, float step) {
        vec2 position1 = position + vec2(-step, -step);        
        vec2 position1_h = position + vec2(step, step);  
        
        float val1 = getValue(position1);
        float val1_h = getValue(position1_h);
        if (isnan(val1) || isnan(val1_h)) return false;
        
        int diff1 = abs(int(val1 > 0.) - int(val1_h > 0.));

        vec2 position2 = position + vec2(step, -step);
        vec2 position2_h = position + vec2(-step, step);
        
        float val2 = getValue(position2);
        float val2_h = getValue(position2_h);
        if (isnan(val2) || isnan(val2_h)) return false;

        int diff2 = abs(int(val2 > 0.) - int(val2_h > 0.));
        
        return max(diff1, diff2) == 1;
    }

    #define ANTIALIAS 2
    vec4 shade (vec2 position) {
          float result = 0.;
    
          for (int i = 0; i < ANTIALIAS; ++i) {
            float scaler = ppow(2., float(-i));
            float step = 1. * C * scaler;

            bool line = isLine(position, step);            
            result += float(line) / float(ANTIALIAS);            
          }
    
          return result * ${hex2glsl(input.color)};
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
        
        vec4 funcColor = shade(uv);
        if (funcColor.w != 0.) fragColor = funcColor;
        else fragColor = vec4(0, 0, 0, 0);
    }
    `;
};
