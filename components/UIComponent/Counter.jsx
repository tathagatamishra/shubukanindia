"use client";
import { useEffect, useState } from "react";

export default function Counter({ target, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16); // ~60fps

    const step = () => {
      start += increment;
      if (start < target) {
        setCount(Math.floor(start));
        requestAnimationFrame(step);
      } else {
        setCount(target); // make sure it ends exactly
      }
    };

    step();
  }, [target, duration]);

  return <span>{count}</span>;
}
