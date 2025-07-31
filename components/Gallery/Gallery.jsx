"use client";
import React, { useEffect, useState } from "react";
import "./Gallery.scss";
import Image from "next/image";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const customLoader = ({ src }) => {
  return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJareAIcFCRfOFqLSBpBoRyrp5BWauRSW22G4LSivIc6opA-6-WTfBio1y5T6h4JZu8Ws&usqp=CAU"; // assumes src is already a full URL
};

export default function Gallery({ images }) {
  return (
    <div className="Gallery">
      <section className="Hero">
        <p className="heading">Gallery</p>
        <p>Beyond the realms</p>
      </section>

      <section className="align-image">
        <div>
          {images.length !== 0 &&
            images.map((image, index) => (
              <div className="image" key={index}>
                <Image
                  placeholder="blur"
                  blurDataURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJareAIcFCRfOFqLSBpBoRyrp5BWauRSW22G4LSivIc6opA-6-WTfBio1y5T6h4JZu8Ws&usqp=CAU"
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

      <div className="line"></div>
    </div>
  );
}
