import React, { useEffect, useRef, useState } from "react";

import styles from "./About.modules.css";

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

import img_header from "../../../res/demo/header.webp";
import img_header_mobile from "../../../res/demo/header_mobile.webp";

import { MathJax } from "better-react-mathjax";

const features = {
  left: [
    {
      type: "img",
      srcProd: "https://kaapporaivio.fi/media/pictures/2.webp",
      caption: "Renders functions and equations",
      link: "https://kaapporaivio.fi/graph/?d=camera%3A%28current%3A%28x%3A0.03405228952939178%2Cy%3A2.0181310563532366%2Czoom%3A-3.300000000000001%29%29%2Cinputs%3A%21%28%28color%3A%23ed333b%2CglslSource%3A%27%27%2Cname%3A%27%27%2CrawInput%3A%27x+%5E+2%27%2Ctype%3Afunction%29%2C%28color%3A%23cfcf00%2CglslSource%3A%27%27%2Cname%3A%27%27%2CrawInput%3A%271%2F2x%2B2.5%27%2Ctype%3Afunction%29%2C%28color%3A%2300af00%2CglslSource%3A%27%27%2Cname%3A%27%27%2CrawInput%3A%27cos%28x%29%27%2Ctype%3Afunction%29%29",
    },
    {
      type: "video",
      srcProd: "https://kaapporaivio.fi/media/5_baseline.m4v",
      caption: "Renders fractals",
      link: "https://kaapporaivio.fi/graph/?d=camera%3A%28current%3A%28x%3A0.11459662756203731%2Cy%3A0.3762703086399076%2Czoom%3A-1.2999999999999992%29%29%2Cinputs%3A%21%28%28color%3A%23000000%2Cdetails%3A%28ci%3A%271%2Fsqrt%282%29*cos%28a%29%27%2Ccr%3A%271%2Fsqrt%282%29*sin%28a%29%27%29%2Cselected%3Ajulia%2Ctype%3Afractal%29%2C%28color%3A%23cfcf00%2Cmax%3A%276.28%27%2Cmin%3A%270%27%2Cname%3Aa%2Cstep%3A0.01%2Ctype%3Aslider%2Cvalue%3A%273.63%27%29%29",
    },
  ],
  right: [
    {
      type: "video",
      srcProd: "https://kaapporaivio.fi/media/3_baseline.m4v",
      caption: "Supports named constants",
      link: "https://kaapporaivio.fi/graph/?d=camera%3A%28current%3A%28x%3A-2.8539860875173497%2Cy%3A-5.673043985476103%2Czoom%3A-5.499999999999995%29%29%2Cinputs%3A%21%28%28color%3A%23ffffff%2Cmax%3A%2710%27%2Cmin%3A0%2Cname%3Aa%2Cstep%3A0.01%2Ctype%3Aslider%2Cvalue%3A%270.06%27%29%2C%28color%3A%23070db0%2CglslSource%3A%27%27%2Cname%3A%27f%28x%29%27%2CrawInput%3A%27e+%5E+%28sin%28x+%2F+y%29+%2B+cos%28y+*+x%29%29+%3D+sin%28e+%5E+%28x+%2B+y%29%29+%2B+a%27%2Ctype%3Afunction%29%29",
    },
    {
      type: "img",
      srcProd: "https://kaapporaivio.fi/media/pictures/4.webp",
      caption: "Renders shaded plots",
      link: "https://kaapporaivio.fi/graph/?d=camera%3A%28current%3A%28x%3A1.8404913812145347%2Cy%3A1.0987812715319214%2Czoom%3A-2.8000000000000007%29%29%2Cinputs%3A%21%28%28color%3A%23cfcf00%2Cmax%3A%271%27%2Cmin%3A%270%27%2Cname%3A%27%27%2CrawInput%3A%27sin%28x%29%2Fcos%28y%29-tan%28x%29%27%2Ctype%3Asolid%29%29",
    },
  ],
};

const MyVideo = ({ forwardRef, src, className, autoPlay, loop }) => {
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window["safari"] || (typeof safari !== "undefined" && window["safari"].pushNotification));

  return false ? (
    <i className={className} style={{ border: "1px dashed black", padding: "8px" }}>
      Your browser doesn't support videos
    </i>
  ) : (
    <video
      ref={forwardRef}
      className={className}
      src={src}
      autoPlay={autoPlay || false}
      loop={loop || false}
      muted={true}
      height={"100%"}
      width={"100%"}
      playsInline={true}
      type={"video/m4v"}></video>
  );
};

const About = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const video3Ref = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  useEffect(() => {
    const listener = () => {
      const newState = window.innerWidth < 600;

      setIsMobile(newState);
    };
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  return (
    <div id={styles.container}>
      <header id={styles.header}>
        <img id={styles.headerImage} src={isMobile ? img_header_mobile : img_header} alt={""} />
        <h1>KGraph</h1>
      </header>
      <div id={styles.mainWrapper}>
        <main id={styles.main}>
          <i>
            Want to go straight to the point?{" "}
            <a className={styles.showcaseLink} href={"https://kaapporaivio.fi/graph?demo=1"} target={"_blank"} rel={"noopener noreferrer"}>
              <strong>→ Try it for yourself!</strong>
            </a>
          </i>
          <p>
            Have you ever tried to graph an equation, only to find out that no graphing calculator you try can render it accurately or without turning
            your computer into a slideshow? Are you tired of laggy and bacon-frying-on-your-cpu-enabling interfaces? In that case, <code>KGraph</code>{" "}
            might be of interest to you.
          </p>
          <p>
            KGraph is a GPU-accelerated equation visualizer that is able to plot almost anything you throw at it in real time. For example, below the
            equation <MathJax inline={true}>\(\sin^2\left(xy\right)=\tan^2\left(xy\right)\cos^2\left(\frac12xy\right)\)</MathJax> is being rendered
            with KGraph, Desmos and Geogebra. You tell me which result is the best :)
          </p>
          <button
            id={styles.playButton}
            onClick={() => {
              video1Ref.current.currentTime = 0;
              video2Ref.current.currentTime = 0;
              video3Ref.current.currentTime = 0;

              video1Ref.current.play();
              video2Ref.current.play();
              video3Ref.current.play();
            }}>
            Compare
          </button>
          <div className={styles.threeSideBySide}>
            <MyVideo forwardRef={video1Ref} src={"https://kaapporaivio.fi/media/1_kgraph_new_baseline.m4v"} />
            <MyVideo forwardRef={video2Ref} src={"https://kaapporaivio.fi/media/1_desmos_new_baseline.m4v"} />
            <MyVideo forwardRef={video3Ref} src={"https://kaapporaivio.fi/media/1_geogebra_new_baseline.m4v"} />
          </div>
          <h2>Features</h2>
          <div className={styles.twoSideBySide}>
            <div>
              {features.left.map(feature => (
                <div className={styles.card} key={feature.link}>
                  {" "}
                  <p>
                    {feature.caption}{" "}
                    <a href={feature.link} target={"_blank"} rel={"noopener noreferrer"}>
                      <strong>(→ see for yourself)</strong>
                    </a>
                  </p>
                  {feature.type === "img" ? (
                    <img className={styles.inlineMedia} src={feature.srcProd} alt={""} />
                  ) : (
                    <MyVideo className={styles.inlineMedia} src={feature.srcProd} autoPlay={true} loop={true}></MyVideo>
                  )}
                </div>
              ))}
            </div>
            <div>
              {features.right.map(feature => (
                <div className={styles.card} key={feature.link}>
                  {" "}
                  <p>
                    {feature.caption}{" "}
                    <a href={feature.link} target={"_blank"} rel={"noopener noreferrer"}>
                      <strong>(→ see for yourself)</strong>
                    </a>
                  </p>
                  {feature.type === "img" ? (
                    <img className={styles.inlineMedia} src={feature.srcProd} alt={""} />
                  ) : (
                    <MyVideo className={styles.inlineMedia} src={feature.srcProd} autoPlay={true} loop={true}></MyVideo>
                  )}
                </div>
              ))}
            </div>
          </div>
          <h2>Why should I care?</h2>
          <p>
            Maybe you shouldn't. But personally, I find it immeasurably cool that it's possible to see visualizations of complicated equations with my
            own eyes and interact with them. In addition, KGraph's fluidness and instantness enable developing entirely new intuitions for reasoning
            about the behaviour of complicated equations—when you can change the value of a constant and instantly see the effect on the
            visualization, the opportunity for intuitively learning the correlation is much higher compared to conventional CAS software, such as
            Desmos or Geogebra.
          </p>
          <h2>Try it!</h2>
          <a className={styles.showcaseLink} href={"https://kaapporaivio.fi/graph?demo=1"}>
            <strong>→ Try it for yourself!</strong>
          </a>
        </main>
      </div>
    </div>
  );
};

export default About;
