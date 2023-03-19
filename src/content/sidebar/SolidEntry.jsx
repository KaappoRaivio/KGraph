import React from "react";

import styles from "./SolidEntry.module.css";
import InlineInput from "../../InlineInput";
const SolidEntry = ({ name, color, rawInput, min, max, onChange, onRemoval, index }) => {
  return (
    <li className={styles.listItem} style={{ background: `white` }}>
      <div className={styles.titleBar}>
        <p>
          {index + 1}. {name}
        </p>
        <input type="color" className={styles.colorSelect} value={color} onChange={e => onChange({ color: e.target.value })} />
        <button className={styles.delete} onClick={onRemoval}>
          ×
        </button>
      </div>
      <div className={styles.inputWrapper}>
        <p>z = </p>
        {/*<InlineInput*/}
        <input
          type={"text"}
          autoCorrect={"off"}
          autoCapitalize={"none"}
          className={styles.functionInput}
          value={rawInput}
          onChange={e => onChange({ rawInput: e.target.value })}
        />
      </div>
      <div className={styles.scale}>
        <InlineInput value={min} onChange={e => onChange({ min: e.target.value })} />
        <div className={styles.gradient} style={{ background: `linear-gradient(to right, white, ${color})` }}></div>
        <InlineInput value={max} onChange={e => onChange({ max: e.target.value })} />
      </div>
    </li>
  );
};

export default SolidEntry;
