import React from "react";

import styles from "./PowerSeriesEntry.module.css";
import InlineInput from "../../InlineInput";
const PowerSeriesEntry = ({ name, color, rawInput, onChange, onRemoval, index }) => {
  return (
    <li className={styles.listItem} style={{ color: "#ffffff", background: color }}>
      <div className={styles.titleBar}>
        <p>
          {index + 1}. {name}
        </p>
        <input
          type="color"
          className={styles.colorSelect}
          value={color}
          onChange={e => {
            onChange({ color: e.target.value });
          }}
        />
        <button className={styles.delete} onClick={onRemoval}>
          ×
        </button>
      </div>
      <input
        type={"text"}
        autoCorrect={"off"}
        autoCapitalize={"none"}
        className={styles.functionInput}
        value={rawInput}
        onChange={e => onChange({ rawInput: e.target.value })}
      />
    </li>
  );
};

export default PowerSeriesEntry;
