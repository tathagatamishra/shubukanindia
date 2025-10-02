"use client";
import { useEffect, useState } from "react";

function SlidingNumber({ value }) {
  const [digits, setDigits] = useState([]);

  useEffect(() => {
    setDigits(value.toString().split(""));
  }, [value]);

  return (
    <div className="flex justify-center space-x-1">
      {digits.map((digit, idx) => (
        <div key={idx} className="m-0 overflow-hidden h-[40px] w-[24px]">
          <div
            className="m-0 transition-transform duration-500 ease-out"
            style={{
              transform: `translateY(-${Number(digit) * 40}px)`,
            }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="m-0 h-[40px] flex items-center justify-center text-3xl font-bold"
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
