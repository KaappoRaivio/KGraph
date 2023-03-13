import React from "react";
import styles from "./AddEntry.module.css";

const AddEntry = () => {
  return (
    <li className={styles.listItem}>
      <button className={styles.buttonWrapper}>
        <p className={styles.plusSign}>Add inputs...</p>
      </button>
    </li>
  );
};

export default AddEntry;
