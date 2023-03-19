import React from "react";
import { useDispatch } from "react-redux";

import styles from "./Instructions.module.css";
import { helpClosed } from "../redux/reducers/uiSlice";

const Instructions = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div>
        <button id={styles.close} onClick={() => dispatch(helpClosed())}>
          Close
        </button>
      </div>
      <div id={styles.container}>
        <h1>KPlot</h1>
        <p>
          KPlot is a GPU-accelerated mathematical plotter optimized for rendering equations with visually complex plots that are unsuitable for
          traditional computer algebra software such as Desmos and Geogebra.
        </p>
        <h2>Controls</h2>
        <p>All inputs are listed in the side panel, where more inputs can be added as well. The panel is resizable.</p>
        <h2>Input types</h2>
        <h3>Constant</h3>
        <p>
          <code>constant</code>s are values that can be referenced in all other inputs. The value of each constant can be set either by directly
          typing, or with a slider. In addition, the slider's range can be adjusted.
        </p>
        <p>When the value of a constant is updated, the update propagates to everything else that depends on the constant's value.</p>
        <h3>Function</h3>
        <p>
          <code>function</code>s can be any equations or expressions in terms of <code>x</code> and <code>y</code>. If no <code>y</code> terms are
          present in the input, the expression is assumed to denote the value of <code>y</code>. Examples:
        </p>
        <ul>
          <li>
            <code>y = x ^ 2</code>
          </li>
          <li>
            <code>3*x^3 - 2*x^2 + 8*x - 3</code>
          </li>
          <li>
            <code>e ^ (sin(x / y) + cos(y * x)) = sin(e ^ (x + y)) + a</code> (When a constant <code>a</code> is also defined)
          </li>
        </ul>
        <h3>Solid plot</h3>
        <p>
          <code>solidplot</code>s are equations defined in terms of <code>x</code>, <code>y</code>, and <code>z</code> where the value of{" "}
          <code>z</code> in terms of the other variables and constants defines the color of the plot at each point.
        </p>
        <p>
          Similarly to <code>function</code>s, if no <code>z</code> terms are present, the expression is assumed to represent <code>z</code>'s value.
          Similar to Wolfram Alpha's contour plot. Examples:
        </p>
        <ul>
          <li>
            <code>z = x ^ 2 + y ^ 2</code>
          </li>
          <li>
            <code>x + y + z = 1</code>
          </li>
          <li>
            <code>e ^ (a*sin(a*x) + cos(y)) = z </code> (When a constant <code>a</code> is also defined)
          </li>
        </ul>
        <h4>Limitations</h4>
        <p>
          The input must be a polynomial in terms of <code>z</code>.
        </p>
        <h3>Fractal</h3>
        <p>A collection of various, pre-defined fractals.</p>
        <h2>Built-in functions</h2>
        <p>All glsl functions are supported as-is in expressions and equations. These include :</p>
        <ul>
          <li>
            Most trigonometric functions (<code>sin</code>, <code>acos</code>, etc.)
          </li>
          <li>
            Most rounding functions (<code>floor</code>, <code>ceil</code>, etc.)
          </li>
          <li>
            Roots and logarithms (<code>sqrt</code>, <code>log</code>, etc.)
          </li>
        </ul>
      </div>
    </>
  );
};

export default Instructions;
