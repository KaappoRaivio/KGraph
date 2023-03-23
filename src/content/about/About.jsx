import React from "react";

import styles from "./About.modules.css";

// import KGraph1 from "../../../res/demo/1_Desmos.mkv";
import Desmos1 from "../../../res/demo/1_Desmos.webm";
import KGraph1 from "../../../res/demo/1_KGraph.webm";

const About = () => {
  // console.log(KGraph1);
  return (
    <>
      <header id={styles.header}>
        <img src={"https://picsum.photos/1920/1080"} />
        <h1>KGraph</h1>
      </header>
      <div id={styles.mainWrapper}>
        <main id={styles.main}>
          <p>
            Have you ever tried to graph an equation, only to find out that no graphing calculator you try can render it accurately or without turning
            your computer into a slideshow? Are you tired of laggy and bacon-frying-on-your-cpu-enabling interfaces? In that case, <code>KGraph</code>{" "}
            might be of interest to you.
          </p>
          <p>
            KGraph is a GPU-accelerated graph renderer that, performance wise, is able to plot almost anything you throw at it in real time. What do
            you mean? Well, below you can see the same equation being rendered with Desmos and KGraph. You tell me which one is better :)
          </p>
          <div className={styles.twoSideBySide}>
            <video src={KGraph1} autoPlay={true} muted={true} width={"100%"} controls={true} />
            <video src={Desmos1} autoPlay={true} muted={true} width={"100%"} controls={true} />
          </div>
        </main>
      </div>
    </>
  );
};

export default About;
