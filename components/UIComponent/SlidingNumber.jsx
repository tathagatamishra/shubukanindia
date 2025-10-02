"use client";
import { useEffect, useState } from "react";

function SlidingNumber({
  value = "0",
  fontStyle = "text-3xl font-bold",
  height = "h-[40px]",
}) {
  const [digits, setDigits] = useState([]);

  useEffect(() => {
    setDigits(value.toString().split(""));
  }, [value]);

  return (
    <div className="flex justify-center space-x-1">
      {digits.map((digit, idx) => (
        <div
          key={idx}
          className={`m-0 overflow-hidden h-[${height}px] w-fit max-w-[24px]`}
        >
          <div
            className="m-0 transition-transform duration-500 ease-out"
            style={{
              transform: `translateY(-${Number(digit) * height}px)`,
            }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`m-0 h-[${height}px] flex items-center justify-center ${fontStyle}`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SlidingNumber;
