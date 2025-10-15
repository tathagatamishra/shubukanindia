"use client";
import { useEffect, useState } from "react";
import "./Blog.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SwiperSlider from "../UIComponent/SwiperSlider";
import {
  Pagination,
  Keyboard,
  Navigation,
  Zoom,
  Autoplay,
} from "swiper/modules";
import { isDesktop, isMobile } from "react-device-detect";
import Loader from "../UIComponent/Loader/Loader";

export default function Blog({ blogs }) {
  const router = useRouter();
  const navigate = (page) => router.push(page);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    console.log("Fetched blogs:", blogs);
  }, [blogs]);

  // --- Swiper Props ---
  const isDynamicBullets =
    isMobile ||
    blogs.length > 20 ||
    (typeof window !== "undefined" && window.innerWidth < 500);

  const swiperProps = {
    modules: [Zoom, Keyboard, Pagination, Navigation, Autoplay],
    keyboard: { enabled: true },
    navigation: true,
    centeredSlides: true,
    pagination: { dynamicBullets: isDynamicBullets, clickable: true },
    className: "topStorySwiper",
    spaceBetween: 20,
    style: { height: "100%" },
    loop: true,
    lazy: "true",
    autoplay: { delay: 3000, disableOnInteraction: false },
    slidesPerView:
      isMobile || (typeof window !== "undefined" && window.innerWidth < 500)
        ? 1
        : "auto",
  };

  // --- Top Story Swiper Section ---
  const topStoryArr = blogs.map((blog, index) => (
    <div
      key={blog._id || index}
      className="container w-full sm:h-[calc(100%-40px)] h-[calc(100%-30px)] p-[10px] sm:p-[20px] flex flex-col sm:gap-[20px] gap-[10px]"
      onClick={() => {
        navigate(`/blogpost/${blog.slug}`);
        setLoading(true);
      }}
    >
      <h2 className="font-[700] text-[24px]">{blog.title}</h2>
      <div
        className="relative w-full h-full p-[10px] bg-[burlywood] rounded-[5px]"
        style={{ backgroundImage: `url(${blog.thumbnailImage})` }}
      >
        <p className="absolute top-0 left-0 object-cover w-full z-[2]">
          {blog.summary}
        </p>
        <Image
          src={blog.thumbnailImage?.url}
          alt={blog.thumbnailImage?.altText || blog.title}
          width={480}
          height={480}
          className="absolute top-0 left-0 object-cover w-full h-full z-[0]"
        />
      </div>
    </div>
  ));

  // --- Zigzag Section ---
  const zigzagArr = blogs.map((blog, index) => (
    <div
      key={blog._id || index}
      className={`zigzagCard flex gap-[20px] ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
      onClick={() => {
        navigate(`/blogpost/${blog.slug}`);
        setLoading(true);
      }}
    >
      <div className="zigzagCardContent lg:w-[70%] sm:w-[80%] w-full max-w-full flex flex-col gap-[20px] sm:p-[20px] p-[10px]">
        <h2
          className={`font-[700] text-[24px] ${
            index % 2 === 0 ? "text-left" : "text-right"
          }`}
        >
          {blog.title}
        </h2>

        <div
          className={`flex gap-[20px] ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <div className="zigzagImage min-h-[100px] h-[100px] min-w-[100px] w-[100px] rounded-[5px] overflow-hidden">
            <Image
              src={blog.thumbnailImage?.url}
              alt={blog.thumbnailImage?.altText || blog.title}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <p>{blog.shortNote || blog.summary}</p>
        </div>
      </div>
    </div>
  ));

  // --- Image Block Section ---
  const imageBlockArr = blogs.flatMap(
    (blog) =>
      blog.sections
        ?.filter((sec) =>
          sec.contentBlocks.some((b) => b.type === "image" && b.mediaUrl)
        )
        .flatMap((sec) =>
          sec.contentBlocks
            .filter((b) => b.type === "image")
            .map((b, i) => ({
              url: b.mediaUrl,
              alt: b.altText,
              caption: b.caption,
            }))
        ) || []
  );

  // --- Vertical Cards ---
  const vertArray = blogs.map((blog, index) => (
    <div
      key={blog._id || index}
      className="vertCard flex flex-col gap-[20px] sm:p-[20px] p-[10px] cursor-pointer"
      onClick={() => {
        navigate(`/blogpost/${blog.slug}`);
        setLoading(true);
      }}
    >
      <div className="w-full h-[180px] overflow-hidden rounded-[5px]">
        <Image
          src={blog.coverImage?.url}
          alt={blog.coverImage?.altText || blog.title}
          width={600}
          height={400}
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="font-[700] text-[24px]">{blog.title}</h2>
      <p>{blog.summary}</p>
    </div>
  ));

  // --- Footer Cards ---
  const footerArray = blogs.map((blog, index) => (
    <div
      key={blog._id || index}
      className="bigCardDiv w-full p-[10px] cursor-pointer"
      onClick={() => {
        navigate(`/blogpost/${blog.slug}`);
        setLoading(true);
      }}
    >
      <h2 className="font-[700] text-[24px]">{blog.title}</h2>
      <p>{blog.shortNote || blog.summary}</p>
    </div>
  ));

  return (
    <div className="Blog">
      <div className="blogPage flex flex-col gap-[30px] overflow-hidden">
        {/* --- Top Stories Swiper --- */}
        <section className="topStorySection w-full sm:h-[340px] h-[300px]">
          <SwiperSlider slides={topStoryArr} swiperProps={swiperProps} />
        </section>

        {/* --- Nav Tabs --- */}
        <section className="blogNav">
          <div className="opt">Top Stories</div>
          <div className="opt">Latest</div>
          <div className="opt">Shubukan</div>
        </section>

        {/* --- Zigzag Section --- */}
        <section className="zigzagSection flex flex-col gap-[30px]">
          {zigzagArr}
        </section>

        {/* --- Image Block Section --- */}
        <section className="imageBlock w-full flex justify-center">
          <div className="w-full flex flex-wrap justify-center md:gap-[30px] sm:gap-[20px] gap-[10px]">
            {imageBlockArr.slice(0, 5).map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.alt}
                className="rounded-[5px] object-cover sm:w-[300px] w-[150px] h-[150px]"
              />
            ))}
          </div>
        </section>

        {/* --- Big Card Section --- */}
        <section
          className="bigCardSection w-full p-[10px]"
          onClick={() => {
            navigate(`/blogpost/${blog.slug}`);
            setLoading(true);
          }}
        >
          <h2 className="font-[700] text-[24px]">
            {blogs[0]?.title || "Blog Title"}
          </h2>
        </section>

        {/* --- Vertical Cards --- */}
        <section className="verticalCardSection w-full sm:gap-[20px] gap-[10px]">
          {vertArray}
        </section>

        {/* --- Footer Section --- */}
        <section className="blogFooter flex flex-col gap-[20px]">
          {footerArray}
        </section>
      </div>

      <Loader loading={loading} />

      {/* --- SVG Filter (unchanged) --- */}
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
