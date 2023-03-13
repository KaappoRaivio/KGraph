import React from "react";

import styles from "./FunctionEntry.module.css";
import InlineInput from "../../InlineInput";
const FunctionEntry = ({ name, rawInput, onChange, index }) => {
  return (
    <li className={styles.listItem}>
      <p>
        {index + 1}. {name}
      </p>
      <input type={"text"} autoCorrect={"off"} autoCapitalize={"none"} className={styles.functionInput} value={rawInput} onChange={onChange} />
    </li>
  );
};

export default FunctionEntry;
