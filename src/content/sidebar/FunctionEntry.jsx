import React from "react";

import styles from "./FunctionEntry.module.css";
import InlineInput from "../../InlineInput";
const FunctionEntry = ({ name, rawInput, onChange, onRemoval, index }) => {
  return (
    <li className={styles.listItem}>
      <div className={styles.titleBar}>
        <p>
          {index + 1}. {name}
        </p>
        <button className={styles.delete} onClick={onRemoval}>
          ×
        </button>
      </div>
      <input type={"text"} autoCorrect={"off"} autoCapitalize={"none"} className={styles.functionInput} value={rawInput} onChange={onChange} />
    </li>
  );
};

export default FunctionEntry;
