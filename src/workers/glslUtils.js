import * as mathjs from "mathjs";
import algebra from "algebra.js";
import algebrite from "algebrite";

export const toGLSLFriendly = parsed => {
  let result = parsed.cloneDeep();

  while (true) {
    let transformed = mathjs.parse(result.toString()).transform((node, path, parent) => {
      if (node.type === "OperatorNode") {
        if (node.op === "^") {
          return new mathjs.FunctionNode("ppow", node.args);
        }
      }

      return node;
    });

    if (transformed.toString() === result.toString()) break;
    else {
      result = transformed;
    }
  }

  const transformed = result.toString({ implicit: "show", simplify: "false" });
  const addedPoints = transformed.replaceAll(/([+-]?([0-9]*[.])?[0-9]+(e[+-]?[0-9]+)?)/g, "float($1)");
  console.log("Transformed:", transformed, "addedPoints:", addedPoints);

  return addedPoints;
};

const replaceWithFractions = input => {
  return input.replaceAll(/[\d]+\.\d*/g, x => `(${algebra.parse(String(x)).constants[0].toString()})`);
};

export const implicitToGLSL = input => {
  if (input.length && !input.includes("=")) {
    if (input.includes("y")) throw Error("Y without equals sign!");
    input = `${input.toLowerCase()} - y = P`;
  } else {
    input = `${input.toLowerCase()} + P`;
  }

  input = replaceWithFractions(input);

  const equalToZero = algebrite.run(`roots(${input}, P)`);
  const reparsed = mathjs.parse(equalToZero, { simplify: false });

  return toGLSLFriendly(reparsed);
};

export const solidToGLSL = input => {
  if (input.length && !input.includes("=")) {
    if (input.includes("z")) throw Error("Z without equals sign!");

    input = `z = ${input.toLowerCase()}`;
  } else {
    input = `${input.toLowerCase()}`;
  }

  input = replaceWithFractions(input);

  console.log("Input", input);
  const equalToZero = algebrite.run(`roots(${input}, z)`);

  console.log("Solved:", equalToZero);
  if (equalToZero.includes("Stop")) throw new Error(equalToZero);

  const reparsed = mathjs.parse(equalToZero, { simplify: false });

  return toGLSLFriendly(reparsed);
};

export const expressionToGLSL = input => {
  return toGLSLFriendly(mathjs.parse(input, { simplify: false }));
};

export const powerSeriesToGLSL = input => {
  console.log(input);
  return "1.";
};
