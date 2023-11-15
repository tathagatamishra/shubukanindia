import React, { useState } from "react";
import "./ShubukanWorld.scss";

import img_1 from "../../assets/img (14).jpg";
import img_2 from "../../assets/img (13).jpg";
import img_3 from "../../assets/img (17).jpg";
import img_4 from "../../assets/img (15).jpg";
import img_5 from "../../assets/img (8).jpg";
import img_6 from "../../images/img (5).jpeg";


export default function ShubukanWorld({setShowNav}) {

  const imgArray = [
    img_1,
    img_5,
    img_2,
    img_4,
    img_3,
    img_6,
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
    <div className="ShubukanWorld">
      <section className="Hero">
        <h1>Shubukan World</h1>
        <p>Discovering the Way of Words</p>
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
          {imgArray.map((image, index) => (
            <div className="image" key={index} onClick={() => imgPop(image)}>
              <img src={image} alt={`Image ${index + 1}`} />
            </div>
          ))}
      </section>
    </div>
  );
}
