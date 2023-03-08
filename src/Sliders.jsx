import React from "react";

import "./index.css";
import InlineInput from "./InlineInput";

const Sliders = ({ sliders, onSliderChange, updateSlider, addSlider, deleteSlider }) => {
  return (
    <>
      <ul className={"no-bullets"} id={"sliders"}>
        {sliders.map((slider, index) => {
          return (
            <li key={slider.name}>
              <label htmlFor={slider.name}>
                <InlineInput value={slider.name} onChange={e => updateSlider(index, { name: e.target.value })} style={{ fontSize: "100%" }} />
                <span style={{ fontSize: "100%" }}> = </span>
                <InlineInput value={slider.value} onChange={onSliderChange(index)} style={{ fontSize: "100%" }} />
              </label>
              <input
                id={slider.name}
                type={"range"}
                value={slider.value}
                onChange={onSliderChange(index)}
                max={slider.max}
                min={slider.min}
                step={slider.step}
              />
              <button className={"round"} onClick={deleteSlider(index)}>
                ×
              </button>
            </li>
          );
        })}
        <button onClick={addSlider}>Add slider</button>
      </ul>
    </>
  );
};

export default Sliders;
