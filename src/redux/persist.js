import rison from "rison";

const demoState =
  "camera:(current:(x:0,y:0,zoom:-4)),inputs:!((color:#ffffff,max:1,min:0,name:a,step:0.01,type:slider,value:0),(color:#ff0000,glslSource:'',name:'f(x)',rawInput:'e+^+(sin(x+/+y)+++cos(y+*+x))+=+sin(e+^+(x+++y))+++a',type:function))";

import getColor from "esthetics/color";

const demoInputs = [
  { name: "a", max: 1, min: 0, value: 0, step: 0.01, type: "slider", color: "#ffffff" },
  {
    name: "f(x)",
    rawInput: "e ^ (sin(x / y) + cos(y * x)) = sin(e ^ (x + y)) + a",
    glslSource: "",
    type: "function",
    color: getColor(-1),
  },
];

const getStateFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  // console.log(window.location.search);
  if (params.has("demo") && params.get("demo") === "1") {
    // params.set("d", demoState);
    return { inputs: demoInputs };
  }
  console.log(params.get("d"));
  // console.log(window.location);
  try {
    // return JSON.parse(atob(params.get("d")));
    return rison.decode_object(params.get("d"));
  } catch (error) {
    return undefined;
  }
  // if (params.has("d")) {
  //   // console.log(params.get("d"));
  //   try {
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  // } else {
  //   return null;
  // }
};

export default getStateFromURL;
