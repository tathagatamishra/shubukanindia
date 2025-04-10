"use client";
import { useEffect, useState } from "react";
import "./Dev.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dev() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Dev">
      <div className="devPage">
        <div className="devCard"></div>

        <div className="frame"></div>

        <div className="border-[40px] border-transparent p-8 custom-border-image">
          <h1 className="text-2xl font-bold">Welcome to Yōkai World</h1>
        </div>

        <div className="relative bg-[#f9f1e7] p-8 rounded-none border border-black shadow-inner">
          <Image
            height={100}
            width={100}
            alt="as"
            src="/as.png"
            className="absolute top-0 left-0 w-12 h-12"
          />
          <Image
            height={100}
            width={100}
            alt="as"
            src="/as.png"
            className="absolute top-0 right-0 w-12 h-12"
          />
          <Image
            height={100}
            width={100}
            alt="as"
            src="/as.png"
            className="absolute bottom-0 left-0 w-12 h-12"
          />
          <Image
            height={100}
            width={100}
            alt="as"
            src="/as.png"
            className="absolute bottom-0 right-0 w-12 h-12"
          />
          <p className="text-lg">Some content inside</p>
        </div>

        <div className="paper-bg p-6 border border-[#5e3b2d] shadow-lg">
          <h2 className="text-xl">Legend of the Kitsune</h2>
        </div>
      </div>
    </div>
  );
}
