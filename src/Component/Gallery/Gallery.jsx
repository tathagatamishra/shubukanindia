import React, { useEffect, useState } from "react";
import "./Gallery.scss";

import img_1 from "../../assets/uemaImg1.svg";
import img_2 from "../../assets/uemaImg2.svg";
import img_3 from "../../assets/chibana.jpg";
import img_4 from "../../assets/mag2.jpg";
import img_5 from "../../assets/uema.jpg";
import img_6 from "../../assets/jokiUema.svg";
import img_7 from "../../assets/takeshi.jpg";
import img_8 from "../../assets/yasuhiro.jpg";
import img_jpeg_1 from "./images/img (1).jpeg";
import img_jpeg_2 from "./images/img (2).jpeg";
import img_jpeg_3 from "./images/img (3).jpeg";
import img_jpeg_4 from "./images/img (4).jpeg";
import img_jpeg_5 from "./images/img (5).jpeg";
import img_jpeg_6 from "./images/img (6).jpeg";
import img_jpeg_7 from "./images/img (7).jpeg";
import img_jpeg_8 from "./images/img (8).jpeg";
import img_jpeg_9 from "./images/img (9).jpeg";
import img_jpeg_10 from "./images/img (10).jpeg";
import img_jpg_1 from "./images/img (1).jpg";
import img_jpg_2 from "./images/img (2).jpg";
import img_jpg_3 from "./images/img (3).jpg";
import img_jpg_4 from "./images/img (4).jpg";
import img_jpg_5 from "./images/img (5).jpg";
import img_jpg_6 from "./images/img (6).jpg";
import img_jpg_7 from "./images/img (7).jpg";
import img_jpg_8 from "./images/img (8).jpg";
import img_jpg_9 from "./images/img (9).jpg";
import img_jpg_10 from "./images/img (10).jpg";
import img_jpg_11 from "./images/img (11).jpg";
import img_jpg_12 from "./images/img (12).jpg";
import img_jpg_13 from "./images/img (13).jpg";
import img_jpg_14 from "./images/img (14).jpg";
import img_jpg_15 from "./images/img (15).jpg";
import img_jpg_16 from "./images/img (16).jpg";
import img_jpg_17 from "./images/img (17).jpg";
import img_webp_1 from "./images/img (1).webp";
import img_webp_2 from "./images/img (2).webp";

export default function Gallery({setShowNav}) {
  const imgArray = [
    img_1,
    img_4,
    img_3,
    img_5,
    img_6,
    img_7,
    img_8,
    img_jpeg_1,
    img_jpeg_2,
    img_jpeg_3,
    img_jpeg_4,
    img_jpeg_5,
    img_jpeg_6,
    img_jpeg_7,
    img_2,
    img_jpeg_8,
    img_jpeg_9,
    img_jpeg_10,
    img_jpg_1,
    img_jpg_2,
    img_jpg_3,
    img_jpg_4,
    img_jpg_5,
    img_jpg_6,
    img_jpg_7,
    img_jpg_8,
    img_jpg_9,
    img_jpg_10,
    img_jpg_11,
    img_jpg_12,
    img_jpg_13,
    img_jpg_14,
    img_jpg_15,
    img_jpg_16,
    img_jpg_17,
    img_webp_1,
    img_webp_2,
  ];

  const [popImg, setPopImg] = useState("");
  const [imgClicked, setImgClicked] = useState(false);

  function imgPop(srcValue) {
    if (imgClicked == true) {
      setPopImg("");
      setImgClicked(false);
      setShowNav(true);
    } else if (imgClicked == false) {
      setShowNav(false);
      setPopImg(srcValue);
      setImgClicked(true);
    }
  }
  return (
    <div className="Gallery">
      <section className="Hero">
        <h1>Gallery</h1>
        <p>Beyond the realms</p>
      </section>
      {imgClicked && (
        <div className="popUp">
          <div className="popBack" onClick={imgPop}></div>
          <div className="imgPop">
            <img src={popImg} alt="image" />
          </div>
        </div>
      )}

      <section className="gallery-image">
        {/* <h1 className="galleryTop">Gallery</h1> */}
        <div>
          {imgArray.map((image, index) => (
            <div className="image" key={index} onClick={() => imgPop(image)}>
              <img src={image} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <div className="line"></div>
    </div>
  );
}
