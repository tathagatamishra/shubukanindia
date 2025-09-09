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

export default function Blog({ blogs }) {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  // Helper function to get featured/top stories (you can modify this logic)
  const getTopStories = () => {
    if (!blogs || blogs.length === 0) return [];
    // Return first 5 blogs as top stories, or all blogs if less than 5
    return blogs.slice(0, Math.min(blogs.length, 5));
  };

  // Helper function to get zigzag stories
  const getZigzagStories = () => {
    if (!blogs || blogs.length === 0) return [];
    // Get next 3 blogs after top stories, or available blogs
    const startIndex = Math.min(5, blogs.length);
    return blogs.slice(startIndex, startIndex + 3);
  };

  // Helper function to get vertical card stories
  const getVerticalStories = () => {
    if (!blogs || blogs.length === 0) return [];
    // Get next 4 blogs after zigzag stories
    const startIndex = Math.min(8, blogs.length);
    return blogs.slice(startIndex, startIndex + 4);
  };

  // Helper function to get footer stories
  const getFooterStories = () => {
    if (!blogs || blogs.length === 0) return [];
    // Get next 4 blogs after vertical stories
    const startIndex = Math.min(12, blogs.length);
    return blogs.slice(startIndex, startIndex + 4);
  };

  const [topStoryArr, setTopStoryArr] = useState([]);

  const topStories = getTopStories();

  const isDynamicBullets =
    isMobile ||
    topStories.length > 20 ||
    (typeof window !== "undefined" && window.innerWidth < 500);

  const swiperProps = {
    modules: [Zoom, Keyboard, Pagination, Navigation, Autoplay],
    keyboard: {
      enabled: true,
    },
    navigation: true,
    centeredSlides: true,
    pagination: { dynamicBullets: isDynamicBullets, clickable: true },
    className: "topStorySwiper",
    spaceBetween: 20,
    style: { height: "100%" },
    loop: topStories.length > 1,
    lazy: "true",
    autoplay:
      topStories.length > 1
        ? {
            delay: 3000,
            disableOnInteraction: false,
          }
        : false,
    onSlideChange: (swiper) => {
      console.log("Slide index changed to: ", swiper.activeIndex);
    },
    slidesPerView:
      isMobile || (typeof window !== "undefined" && window.innerWidth < 500)
        ? 1
        : "auto",
  };

  useEffect(() => {
    if (topStories.length > 0) {
      setTopStoryArr(
        topStories.map((blog, index) => (
          <div
            key={blog._id || index}
            className="container w-full sm:h-[calc(100%-40px)] h-[calc(100%-30px)] p-[10px] sm:p-[20px] flex flex-col sm:gap-[20px] gap-[10px] cursor-pointer"
            onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
          >
            <h2 className="font-[700] text-[24px]">{blog.title}</h2>
            <div className="w-full h-full p-[10px] border-1 bg-[burlywood] overflow-hidden">
              {blog.coverImage.url && (
                <div className="w-full h-32 mb-4 relative">
                  <Image
                    src={blog.coverImage.url}
                    alt={blog.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <p className="line-clamp-3">{blog.excerpt || blog.description}</p>
            </div>
          </div>
        ))
      );
    }
  }, []);

  // zigzag section
  const zigzagStories = getZigzagStories();
  const [zigzagArr, setZigzagArr] = useState([]);

  useEffect(() => {
    if (zigzagStories.length > 0) {
      setZigzagArr(
        zigzagStories.map((blog, index) => (
          <div
            key={blog._id || index}
            className={`zigzagCard flex gap-[20px] cursor-pointer ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
            onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
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
                <div className="zigzagImage min-h-[100px] h-[100px] min-w-[100px] w-[100px] border-1 bg-[burlywood] relative overflow-hidden rounded">
                  {blog.coverImage.url && (
                    <Image
                      src={blog.coverImage.url}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="flex-1">{blog.excerpt || blog.description}</p>
              </div>
            </div>
          </div>
        ))
      );
    }
  }, [blogs, zigzagStories]);

  // image block section - using featured images from blogs
  const getBlogImages = () => {
    if (!blogs || blogs.length === 0) return [];
    return blogs
      .filter((blog) => blog.coverImage.url)
      .slice(0, 6)
      .map((blog) => ({
        src: blog.coverImage.url,
        alt: blog.title,
        id: blog._id,
      }));
  };

  const images = getBlogImages();

  // vertical cards section
  const vertData = getVerticalStories();
  const [vertArray, setVertArray] = useState([]);

  useEffect(() => {
    if (vertData.length > 0) {
      setVertArray(
        vertData.map((blog, index) => (
          <div
            key={blog._id || index}
            className="vertCard flex flex-col gap-[20px] sm:p-[20px] p-[10px] cursor-pointer"
            onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
          >
            {blog.coverImage.url && (
              <div className="w-full h-48 relative">
                <Image
                  src={blog.coverImage.url}
                  alt={blog.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <h2 className="font-[700] text-[24px]">{blog.title}</h2>
            <p className="line-clamp-3">{blog.excerpt || blog.description}</p>
          </div>
        ))
      );
    }
  }, [blogs, vertData]);

  // footer section
  const footerData = getFooterStories();
  const [footerArray, setFooterArray] = useState([]);

  useEffect(() => {
    if (footerData.length > 0) {
      setFooterArray(
        footerData.map((blog, index) => (
          <div
            key={blog._id || index}
            className="bigCardDiv w-full p-[10px] cursor-pointer"
            onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
          >
            <h2 className="font-[700] text-[24px]">{blog.title}</h2>
            {blog.coverImage.url && (
              <div className="w-full h-48 mt-4 relative">
                <Image
                  src={blog.coverImage.url}
                  alt={blog.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <p className="mt-4 line-clamp-2">
              {blog.excerpt || blog.description}
            </p>
          </div>
        ))
      );
    }
  }, [blogs, footerData]);

  // Show loading state if blogs are not yet loaded
  if (!blogs) {
    return (
      <div className="Blog">
        <div className="blogPage flex flex-col gap-[30px] overflow-hidden">
          <div className="w-full h-[340px] flex items-center justify-center">
            <p>Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no blogs found
  if (blogs.length === 0) {
    return (
      <div className="Blog">
        <div className="blogPage flex flex-col gap-[30px] overflow-hidden">
          <div className="w-full h-[340px] flex items-center justify-center">
            <p>No blogs found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Blog">
      <div className="blogPage flex flex-col gap-[30px] overflow-hidden">
        {topStories.length > 0 && (
          <section className="topStorySection w-full sm:h-[340px] h-[300px]">
            <SwiperSlider slides={topStoryArr} swiperProps={swiperProps} />
          </section>
        )}

        {/* <section className="blogNav">
          <div className="opt">Top Stories</div>
          <div className="opt">Latest</div>
          <div className="opt">Shubukan</div>
        </section> */}

        {zigzagStories.length > 0 && (
          <section className="zigzagSection flex flex-col gap-[30px]">
            {...zigzagArr}
          </section>
        )}

        {/* {images.length > 0 && (
          <section className="imageBlock w-full flex justify-center">
            <div className="w-full flex flex-wrap justify-center md:gap-[30px] sm:gap-[20px] gap-[10px]">
              {images.map((img, index) => (
                <div key={img.id || index} className="relative w-48 h-32">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="rounded-[5px] object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )} */}

        {blogs.length > 8 && (
          <section className="bigCardSection w-full p-[10px]">
            <h2 className="font-[700] text-[24px]">Featured Article</h2>
            {blogs[8].coverImage.url && (
              <div className="w-full h-64 mt-4 relative">
                <Image
                  src={blogs[8].coverImage.url}
                  alt={blogs[8].title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <p className="mt-4">{blogs[8].excerpt || blogs[8].description}</p>
          </section>
        )}

        {vertData.length > 0 && (
          <section className="verticalCardSection w-full sm:gap-[20px] gap-[10px]">
            {vertArray}
          </section>
        )}

        {footerData.length > 0 && (
          <section className="blogFooter flex flex-col gap-[20px]">
            {footerArray}
          </section>
        )}
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
