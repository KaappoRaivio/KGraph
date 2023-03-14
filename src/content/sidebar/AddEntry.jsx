import React from "react";
import styles from "./AddEntry.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addInputPressed } from "../../redux/reducers/uiSlice";

import graph from "../../../res/graph-min.svg";
import sliders from "../../../res/sliders-min.svg";
import fractal from "../../../res/fractal-min.svg";
import { fractalInputAdded, functionInputAdded, sliderInputAdded } from "../../redux/reducers/inputsSlice";

const InputTypeButton = ({ src, name, onClick }) => {
  return (
    <li className={styles.inputTypeButton} onClick={onClick}>
      <img src={`data:image/svg+xml;base64,${btoa(src)}`} alt={name} />
      <p>{name}</p>
    </li>
  );
};

const AddEntry = () => {
  const dispatch = useDispatch();
  const showAddOptions = useSelector(state => state.ui.addInputPressed);

  return (
    <li className={styles.listItem}>
      {showAddOptions ? (
        <>
          <button onClick={() => dispatch(addInputPressed({ pressed: false }))}>Cancel</button>
          <ul className={`${styles.inputTypeGrid} no-bullets`}>
            <InputTypeButton src={graph} name={"function"} onClick={() => dispatch(functionInputAdded({ name: "" }))} />
            <InputTypeButton src={sliders} name={"slider"} onClick={() => dispatch(sliderInputAdded({ name: "" }))} />
            <InputTypeButton src={fractal} name={"fractal"} onClick={() => dispatch(fractalInputAdded({}))} />
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
