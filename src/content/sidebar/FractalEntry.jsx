import React from "react";
import styles from "./FunctionEntry.module.css";
import InlineInput from "../../InlineInput";

const FractalEntry = ({ name, color, rawInput, selected, onChange, details, onRemoval, index }) => {
  return (
    <li className={styles.listItem} style={{ color }}>
      <div className={styles.titleBar}>
        <p>
          {index + 1}. {name}
        </p>
        <button className={styles.delete} onClick={onRemoval}>
          ×
        </button>
      </div>
      <select className={styles.functionInput} value={selected} onChange={e => onChange({ index, selected: e.target.value })}>
        <option value={"mandelbrot"}>Mandelbrot</option>
        <option value={"julia"}>Julia set</option>
        <option value={"feigenbaum"}>Feigenbaum</option>
      </select>
      {selected === "julia" ? (
        <>
          <span>c = </span>
          <InlineInput value={details.cr} onChange={e => onChange({ index, details: { ...details, cr: e.target.value } })} />
          <span> + </span>
          <InlineInput value={details.ci} onChange={e => onChange({ index, details: { ...details, ci: e.target.value } })} />
          <span>i</span>
        </>
      ) : null}
    </li>
  );
};

export default FractalEntry;
