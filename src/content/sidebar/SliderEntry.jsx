import React from "react";
import styles from "./SliderEntry.module.css";
import InlineInput from "../../InlineInput";

const SliderEntry = ({ name, index, value, min, max, step, onChange }) => {
  return (
    <li className={styles.listItem}>
      <div>
        <span>{index + 1}. </span>
        <label htmlFor={name}>
          <InlineInput value={name} onChange={e => onChange({ name: e.target.value })} />
          <span> = </span>
          <InlineInput value={value} onChange={e => onChange({ value: e.target.value })} style={{ fontSize: "100%" }} />
        </label>
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
