import { useState } from "react";

export default () => {
  const [sliders, setSliders] = useState({ a: { max: 10, min: -10, value: 0 } });
  const [changes, setChanges] = useState(true);

  return {
    sliders,
    onSliderChange: sliderLabel => event => {
      console.log("Slider", sliderLabel, "got", event.target.value);
      setSliders(oldSliders => ({ ...oldSliders, [sliderLabel]: { ...oldSliders[sliderLabel], value: event.target.value } }));
      setChanges(true);
    },
    addSlider: name => {
      setSliders(oldSliders => ({ ...oldSliders, name: { max: 10, min: -10, value: 0 } }));
      setChanges(true);
    },
    changes: () => {
      const value = changes;
      if (value) {
        setChanges(false);
      }
      return value;
    },
  };
};
