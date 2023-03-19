import React from "react";
import styles from "./SliderEntry.module.css";
import InlineInput from "../../InlineInput";

const SliderEntry = ({ name, index, color, value, min, max, step, onChange, onRemoval }) => {
  return (
    <li className={styles.listItem}>
      <div className={styles.titleBar}>
        <span>{index + 1}. </span>
        <label htmlFor={name} className={styles.equationWrapper}>
          <InlineInput value={name} onChange={e => onChange({ name: e.target.value })} />
          <span> = </span>
          <InlineInput value={value} onChange={e => onChange({ value: e.target.value })} style={{ fontSize: "100%" }} />
        </label>
        <button className={styles.delete} onClick={onRemoval}>
          ×
        </button>
      </div>
      <div className={styles.sliderContainer}>
        <InlineInput value={min} onChange={e => onChange({ min: e.target.value })} />
        <input
          className={styles.slider}
          id={name}
          type={"range"}
          value={value}
          max={max}
          min={min}
          step={step}
          onChange={e => onChange({ value: e.target.value })}
        />
        <InlineInput value={max} onChange={e => onChange({ max: e.target.value })} />
      </div>
    </li>
  );
};

export default SliderEntry;
