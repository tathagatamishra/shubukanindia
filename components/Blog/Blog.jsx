"use client";
import { useEffect, useState } from "react";
import "./Blog.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Blog() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const topStories = ["1", "2"];

  return (
    <div className="Blog">
      <div className="blogPage">
        <section className="blogNav">
          <div className="opt">Top Stories</div>
          <div className="opt">Latest</div>
          <div className="opt">Shubukan</div>
        </section>

        <section className="blogContent">
          {topStories.map((story, index) => (
            <div
              key={index}
              className="container"
              onClick={() => navigate(`/blog/${story}`)}
            >
              {/* <div className="blogCardImage">
                <Image
                  src={"https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg"}
                  alt="Blog Image"
                  fill
                  className="object-cover"
                />
              </div> */}
              <div className="blogCardContent">
                <h2>Blog Title {story}</h2>
                <p>Blog Description {story}</p>
              </div>
            </div>
          ))}

        </section>

        <section className="blogFooter"></section>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="0"
        width="0"
      >
        <defs>
          <filter id="wobble">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".06"
              numOctaves="4"
            />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
