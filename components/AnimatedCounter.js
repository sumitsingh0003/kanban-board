"use client";

import { useEffect, useState } from "react";

export default function AnimatedCounter({ value }) {

  const [displayValue, setDisplayValue] = useState(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setAnimate(true);

      const timer = setTimeout(() => {
        setDisplayValue(value);
        setAnimate(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span className={`counter ${animate ? "slide" : ""}`}>
      {displayValue}
    </span>
  );
}