import React from "react";

import styles from "./SolidEntry.module.css";
import InlineInput from "../../InlineInput";
const SolidEntry = ({ name, color, rawInput, onChange, onRemoval, index }) => {
  return (
    <li className={styles.listItem} style={{ background: `${color}ff` }}>
      <div className={styles.titleBar}>
        <p>
          {index + 1}. {name}
        </p>
        <button className={styles.delete} onClick={onRemoval}>
          ×
        </button>
      </div>
      <div className={styles.inputWrapper}>
        <p>z = </p>
        {/*<InlineInput*/}
        <input type={"text"} autoCorrect={"off"} autoCapitalize={"none"} className={styles.functionInput} value={rawInput} onChange={onChange} />
      </div>
    </li>
  );
};

export default SolidEntry;
