import * as mathjs from "mathjs";
import algebra from "algebra.js";
import algebrite from "algebrite";

const toGLSLFriendly = parsed => {
  let result = parsed.cloneDeep();

  while (true) {
    // console.log("transforming!", previous);
    let transformed = mathjs.parse(result.toString()).transform((node, path, parent) => {
      if (node.type === "OperatorNode") {
        // console.log(node.op);
        // if (node.op === "*") {
        //   // console.log("multiplication");
        //   return new mathjs.OperatorNode("*", "multiply", node.args, false);
        // }
        if (node.op === "^") {
          // console.log("power");
          return new mathjs.FunctionNode("ppow", node.args);
          // return new mathjs.SymbolNode(`pow(${node.args[0]}, ${node.args[1]})`);
        }
      } else if (node.type === "ConstantNode") {
        // console.log("Constant: ", node);
        // return new mathjs.ConstantNode();
        // return new mathjs.SymbolNode(`${node.value}.`);
      }

      return node;
    });
    // console.log("Transformed:", result.toString(), "-->", transformed.toString());

    if (transformed.toString() === result.toString()) break;
    else {
      // previous = transformed;
      result = transformed;
    }
  }

  let transformed = result.toString({ implicit: "show", simplify: "false" });
  let addedPoints = transformed.replaceAll(/(?<![\d.])([0-9]+)(?![\d.])/g, "$1.");
  // console.log("Transformed:", transformed);
  // console.log("With decimal points:", addedPoints);
  return addedPoints;
};

const replaceWithFractions = input => {
  // console.log(input.replaceAll(/[\d]+\.\d*/g, x => `(${algebra.parse(String(x)).constants[0].toString()})`));
  // console.log(...[...input.matchAll(/[\d]+\.\d*/g)].map(String).map(x => algebra.parse(x).constants[0].toString()));
  return input.replaceAll(/[\d]+\.\d*/g, x => `(${algebra.parse(String(x)).constants[0].toString()})`);
};

export const toGLSL = input => {
  if (input.length && !input.includes("=")) {
    if (input.includes("y")) throw Error("Y without equals sign!");
    // input = `y = ${input.toLowerCase()} + P`;
    input = `${input.toLowerCase()} - y = P`;
  } else {
    input = `${input.toLowerCase()} + P`;
  }

  input = replaceWithFractions(input);
  // console.log(input);

  const equalToZero = algebrite.run(`roots(${input}, P)`);

  const reparsed = mathjs.parse(equalToZero, { simplify: false });
  // console.log("Reparsed:", reparsed.toString());

  return toGLSLFriendly(reparsed);
};

export const expressionToGLSL = input => {
  return toGLSLFriendly(mathjs.parse(input, { simplify: false }));
};

// // export default () => {
// self.onmessage = message => {
//   // console.timeEnd("Worker");
//
//   console.log("moi");
//   const input = message?.data?.input;
//   // const index = message.data.index;
//   if (input == null) return postMessage(null);
//
//   console.log("Worker got input:", input);
//   // console.log(toGLSL(input));
//   try {
//     postMessage(toGLSL(input));
//     console.log("got result");
//   } catch (err) {
//     console.error(err.message);
//   }
// };
