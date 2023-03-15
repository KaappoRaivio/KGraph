import * as mathjs from "mathjs";
import algebra from "algebra.js";
import algebrite from "algebrite";

const toGLSLFriendly = parsed => {
  let result = parsed.cloneDeep();

  while (true) {
    let transformed = mathjs.parse(result.toString()).transform((node, path, parent) => {
      if (node.type === "OperatorNode") {
        // if (node.op === "*") {
        //
        //   return new mathjs.OperatorNode("*", "multiply", node.args, false);
        // }
        if (node.op === "^") {
          return new mathjs.FunctionNode("ppow", node.args);
          // return new mathjs.SymbolNode(`pow(${node.args[0]}, ${node.args[1]})`);
        }
      } else if (node.type === "ConstantNode") {
        // return new mathjs.ConstantNode();
        // return new mathjs.SymbolNode(`${node.value}.`);
      }

      return node;
    });

    if (transformed.toString() === result.toString()) break;
    else {
      // previous = transformed;
      result = transformed;
    }
  }

  let transformed = result.toString({ implicit: "show", simplify: "false" });
  let addedPoints = transformed.replaceAll(/(?<![\d.])([0-9]+)(?![\d.])/g, "$1.");

  return addedPoints;
};

const replaceWithFractions = input => {
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

  const equalToZero = algebrite.run(`roots(${input}, P)`);

  const reparsed = mathjs.parse(equalToZero, { simplify: false });

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
//
//   try {
//     postMessage(toGLSL(input));
//     console.log("got result");
//   } catch (err) {
//     console.error(err.message);
//   }
// };
