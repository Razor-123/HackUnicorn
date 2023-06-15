import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

import duckAnimation from "../animations/duck.json";

const Duck = () => {
  const anime = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: anime.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: duckAnimation,
    });
    return () => lottie.stop();
  }, []);
  return <div style={{ height: 250, width: 300 }} ref={anime}></div>;
};

export default Duck;
