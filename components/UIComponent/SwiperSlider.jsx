import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

export default function SwiperSlider({ slides = [], modules = [], swiperProps = {} }) {
  return (
    <Swiper modules={modules} {...swiperProps}>
      {slides.length !== 0 &&
        slides.map((slide, index) => <SwiperSlide>{slide}</SwiperSlide>)}
    </Swiper>
  );
}
