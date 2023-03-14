import React from "react";

import "./index.css";
import InlineInput from "./InlineInput";
import { useDispatch, useSelector } from "react-redux";
import { sliderAdded, sliderDeleted } from "./redux/reducers/slidersSlice";

const Sliders = ({}) => {
  const sliders = useSelector(state => state.sliders);
  const dispatch = useDispatch();

  return (
    <>
      <ul className={"no-bullets"} id={"sliders"}>
        {sliders.map((slider, index) => {
          return (
            <li>
              <label htmlFor={slider.name}>
                <InlineInput
                  value={slider.name}
                  onChange={event => dispatch(sliderChanged({ index, name: event.target.value }))}
                  style={{ fontSize: "100%" }}
                />
                <span style={{ fontSize: "100%" }}> = </span>
                <InlineInput
                  value={slider.value}
                  onChange={event => dispatch(sliderChanged({ index, value: event.target.value }))}
                  style={{ fontSize: "100%" }}
                />
              </label>
              <input
                id={slider.name}
                type={"range"}
                value={slider.value}
                onChange={event => dispatch(sliderChanged({ index, value: event.target.value }))}
                max={slider.max}
                min={slider.min}
                step={slider.step}
              />
              <button className={"round"} onClick={() => dispatch(sliderDeleted(index))}>
                ×
              </button>
            </li>
          );
        })}
        <button onClick={() => dispatch(sliderAdded({ name: "" }))}>Add slider</button>
      </ul>
    </>
  );
};

export default Sliders;
