"use client";
import React, { useEffect, useState } from "react";
import "./Gallery.scss";
import Image from "next/image";
import { shubukan_api } from "@/config";
import { shuffleArray } from "@/utils/shuffle";

export default function Gallery({ imageArray }) {
  // const [imageArray, setImageArray] = useState();

  // useEffect(() => {
  //   async function getGallery() {
  //     const response = await shubukan_api.get("/gallery");
  //     shuffleArray(response.data);
  //     setImageArray(response.data);
  //   }

  //   getGallery();
  // }, []);

  return (
    <div className="Gallery">
      <section className="Hero">
        <p className="heading">Gallery</p>
        <p>Beyond the realms</p>
      </section>

      <section className="align-image">
        <div>
          {imageArray.length !== 0 &&
            imageArray.images.map((image, index) => (
              <div className="image" key={index}>
                <Image
                  src={image.image}
                  alt={image.title}
                  width={1920}
                  height={1920}
                  priority={false}
                  placeholder="blur"
                />
              </div>
            ))}
        </div>
      </section>

      <div className="line"></div>
    </div>
  );
}
