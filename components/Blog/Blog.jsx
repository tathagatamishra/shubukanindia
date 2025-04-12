"use client";
import { useEffect, useState } from "react";
import "./Blog.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SwiperSlider from "../UIComponent/SwiperSlider";
import { Pagination, Keyboard, Navigation, Autoplay } from "swiper/modules";
import { isDesktop, isMobile } from "react-device-detect";

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

  //  top stories swiper section
  // start ---------------------
  const topStories = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
  ];

  const [topStoryArr, setTopStoryArr] = useState([]);

  const isDynamicBullets =
    isMobile ||
    topStories.length > 20 ||
    (typeof window !== "undefined" && window.innerWidth < 500);

  const swiperProps = {
    modules: [Keyboard, Pagination, Navigation, Autoplay],
    keyboard: {
      enabled: true,
    },
    navigation: true,
    pagination: { dynamicBullets: isDynamicBullets, clickable: true },
    className: "topStorySwiper",
    spaceBetween: 20,
    style: { height: "100%" },
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    onSlideChange: (swiper) => {
      console.log("Slide index changed to: ", swiper.activeIndex);
    },
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

  useEffect(() => {
    setTopStoryArr(
      topStories.map((story, index) => (
        <div
          key={index}
          className="container sm:h-[calc(100%-40px)] h-[calc(100%-30px)] p-[10px] sm:p-[20px] flex flex-col sm:gap-[20px] gap-[10px]"
          // onClick={() => navigate(`/blog/${story}`)}
        >
          <h2 className="font-[700] text-[24px]">Blog Title {story}</h2>
          <div className="w-full h-full p-[10px] border-1 bg-[burlywood]">
            <p>Blog Description {story}</p>
          </div>
        </div>
      ))
    );
  }, []);
  // end ---------------------

  // zigzag section
  // start --------
  const zigzagStories = ["1", "2", "3"];
  const [zigzagArr, setZigzagArr] = useState([]);

  useEffect(() => {
    setZigzagArr(
      zigzagStories.map((story, index) => (
        <div
          key={index}
          className={`zigzagCard flex gap-[20px] ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <div className="zigzagCardContent flex flex-col gap-[20px] sm:p-[20px] p-[10px]">
            <h2
              className={`font-[700] text-[24px] ${
                index % 2 === 0 ? "flex-left" : "text-right"
              }`}
            >
              Blog Title {story}
            </h2>

            <div
              className={`flex gap-[20px] ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="zigzagImage min-h-[100px] h-[100px] min-w-[100px] w-[100px] border-1 bg-[burlywood]"></div>
              <p>Blog Description {story}</p>
            </div>
          </div>
        </div>
      ))
    );
  }, []);
  // end --------

  return (
    <div className="Blog">
      <div className="blogPage flex flex-col gap-[20px]">
        <section className="topStorySection sm:h-[340px] h-[300px]">
          <SwiperSlider slides={topStoryArr} swiperProps={swiperProps} />
        </section>

        <section className="blogNav pb-[10px]">
          <div className="opt">Top Stories</div>
          <div className="opt">Latest</div>
          <div className="opt">Shubukan</div>
        </section>

        <section className="zigzagSection flex flex-col gap-[30px]">
          {...zigzagArr}
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
