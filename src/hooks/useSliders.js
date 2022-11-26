import { useState } from "react";

export default () => {
  const [sliders, setSliders] = useState([{ max: 10, min: -10, value: 0, name: "a", step: 0.01 }]);
  const [changes, setChanges] = useState(true);

  return {
    sliders,
    onSliderChange: sliderIndex => event => {
      // console.log("Slider", sliderLabel, "got", event.target.value);
      setSliders(oldSliders =>
        oldSliders
          .slice(0, sliderIndex)
          .concat({ ...oldSliders[sliderIndex], value: event.target.value })
          .concat(oldSliders.slice(sliderIndex + 1)),
      );
      setChanges(true);
    },
    addSlider: name => {
      // const fallbackName = String.fromCharCode(
      //   sliders
      //     .map(slider => slider.name.charCodeAt(0))
      //     .sort()
      //     .reduce((lowest, num, index) => {
      //       return num !== index && index < lowest ? index : lowest;
      //     }, sliders.length),
      // );

      setSliders(oldSliders => oldSliders.concat({ name: "", max: 10, min: -10, value: 0, step: 0.1 }));
      setChanges(true);
    },
    deleteSlider: index => _ => {
      setSliders(oldSliders => oldSliders.slice(0, index).concat(oldSliders.slice(index + 1)));
      setChanges(true);
    },
    updateSlider: (sliderIndex, value) => {
      setSliders(oldSliders =>
        oldSliders
          .slice(0, sliderIndex)
          .concat({ ...oldSliders[sliderIndex], ...value })
          .concat(oldSliders.slice(sliderIndex + 1)),
      );
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
