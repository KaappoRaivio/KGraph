import React from "react";
import styles from "./AddEntry.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addInputPressed } from "../../redux/reducers/uiSlice";

import graph from "../../../res/graph-min.svg";

const AddEntry = () => {
  const dispatch = useDispatch();
  const showAddOptions = useSelector(state => state.ui.addInputPressed);

  return (
    <li className={styles.listItem}>
      {showAddOptions ? (
        <div style={{ width: 40, height: 30 }}>
          <img src={`data:image/svg+xml;base64,${btoa(graph)}`} width={40} height={30} />
        </div>
      ) : (
        <button className={styles.buttonWrapper} onClick={() => dispatch(addInputPressed({ pressed: true }))}>
          <p className={styles.plusSign}>Add inputs...</p>
        </button>
      )}
    </li>
  );
};

export default AddEntry;
