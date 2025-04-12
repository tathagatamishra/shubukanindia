"use client";
import { useEffect, useState } from "react";
import "./Blog.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SwiperSlider from "../UIComponent/SwiperSlider";
import { Pagination, Autoplay } from "swiper/modules";

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

  const topStories = ["1", "2", "3", "4", "5"];

  const swiperProps = {
    pagination: { dynamicBullets: true },
    className: "mySwiper",
    spaceBetween: 20,
    loop: true,
    breakpoints: {
      512: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      720: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  };

  const [topStoryArr, setTopStoryArr] = useState([]);
  useEffect(() => {
    setTopStoryArr(
      topStories.map((story, index) => (
        <div
          key={index}
          className="container p-[10px] sm:p-[20px]"
          // onClick={() => navigate(`/blog/${story}`)}
        >
          <div className="blogCardContent">
            <h2>Blog Title {story}</h2>
            <p>Blog Description {story}</p>
          </div>
        </div>
      ))
    );
  }, []);

  return (
    <div className="Blog">
      <div className="blogPage">
        <section className="blogNav">
          <div className="opt">Top Stories</div>
          <div className="opt">Latest</div>
          <div className="opt">Shubukan</div>
        </section>

        <section className="blogContent">
          <SwiperSlider slides={topStoryArr} modules={[Pagination]} swiperProps={swiperProps} />
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
