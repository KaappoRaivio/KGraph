import React from "react";
import styles from "./AddEntry.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addInputPressed } from "../../redux/reducers/uiSlice";

import graph from "../../../res/graph-min.svg";
import sliders from "../../../res/sliders-min.svg";
import colorplot from "../../../res/color_plot-min.svg";
import fractal from "../../../res/fractal-min.svg";
import { fractalInputAdded, functionInputAdded, powerSeriesInputAdded, sliderInputAdded, solidInputAdded } from "../../redux/reducers/inputsSlice";

const InputTypeButton = ({ src, name, disabled, onClick }) => {
  return (
    <li className={`${styles.inputTypeButton} ${disabled ? styles.disabled : ""}`} onClick={onClick}>
      <img src={`data:image/svg+xml;base64,${btoa(src)}`} alt={name} />
      <p>{name}</p>
    </li>
  );
};

const AddEntry = () => {
  const dispatch = useDispatch();
  const showAddOptions = useSelector(state => state.ui.addInputPressed);
  const solidInUse = useSelector(state => state.inputs.filter(input => input.type === "solid").length > 0);

  return (
    <li className={styles.listItem}>
      {showAddOptions ? (
        <>
          <button onClick={() => dispatch(addInputPressed({ pressed: false }))}>Close</button>
          <ul className={`${styles.inputTypeGrid} no-bullets`}>
            <InputTypeButton src={graph} name={"function"} onClick={() => dispatch(functionInputAdded({ name: "" }))} />
            <InputTypeButton src={colorplot} name={"solidplot"} disabled={solidInUse} onClick={() => dispatch(solidInputAdded({ name: "" }))} />
            <InputTypeButton src={sliders} name={"constant"} onClick={() => dispatch(sliderInputAdded({ name: "" }))} />
            <InputTypeButton src={fractal} name={"fractal"} onClick={() => dispatch(fractalInputAdded({}))} />
            <InputTypeButton src={fractal} name={"power series"} onClick={() => dispatch(powerSeriesInputAdded({ name: "" }))} />
          </ul>
        </>
      ) : (
        <button className={styles.buttonWrapper} onClick={() => dispatch(addInputPressed({ pressed: true }))}>
          <p className={styles.plusSign}>Add inputs...</p>
        </button>
      )}
    </li>
  );
};

export default AddEntry;
