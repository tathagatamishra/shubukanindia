"use client";
import React, { useEffect, useState } from "react";
import "./Gallery.scss";
import Image from "next/image";
import { shubukan_api } from "@/config";
import { shuffleArray } from "@/utils/shuffle";

export default function Gallery() {
  const [imageArray, setImageArray] = useState();

  useEffect(() => {
    async function getGallery() {
      const response = await shubukan_api.get("/gallery");

      // const responseArray = response.data
      shuffleArray(response.data);
      // console.log(response.data);
      
      setImageArray(response.data);
    }

    getGallery();
  }, []);

  return (
    <div className="Gallery">
      <section className="Hero">
        <p className="heading">Gallery</p>
        <p>Beyond the realms</p>
      </section>

      <section className="align-image">
        <div>
          {imageArray &&
            imageArray.images.map((image, index) => (
              <div className="image" key={index}>
                <Image
                  src={image.image}
                  alt={image.title}
                  width={1920}
                  height={1920}
                  priority={false}
                />
              </div>
            ))}
        </div>
      </section>

      {/* <section className="notAlign-image">
        {tagsArray.map((tag, i) => (
          <div className="align-image" key={i}>
            <h1>{tagIcons[i]}</h1>
            <div className="row">
              {thumbArray
                .filter((item) => item.tags.includes(tag))
                .map((image, index) => (
                  <div className="column" key={index}>
                    <div
                      className="image"
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsOpen(true);
                        setPhotoIndex(index);
                      }}
                    >
                      <LazyLoadImage
                        className="img"
                        alt={`Image ${index + 1}`}
                        effect="blur"
                        wrapperProps={{
                          style: { transitionDelay: "0s" },
                        }}
                        src={image.imgItem}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section> */}

      <div className="line"></div>
    </div>
  );
}
