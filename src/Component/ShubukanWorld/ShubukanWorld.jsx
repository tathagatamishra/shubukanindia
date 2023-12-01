import React, { useState } from "react";
import "./ShubukanWorld.scss";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { globeOutline, logoFacebook, logoInstagram } from "ionicons/icons";

import img_1 from "../../world_images/img (14).jpg";
import img_2 from "../../world_images/img (13).jpg";
import img_3 from "../../world_images/img (17).jpg";
import img_4 from "../../world_images/img (15).jpg";
import img_5 from "../../world_images/img (8).jpg";
import img_6 from "../../world_images/img (1).jpeg";
import img_7 from "../../world_images/img (2).jpeg";
import img_8 from "../../world_images/img (3).jpeg";
import img_9 from "../../world_images/img (4).jpeg";
import img_10 from "../../images/img (5).jpeg";

export default function ShubukanWorld({ setShowNav }) {
  const imgArray = [
    img_1,
    img_5,
    img_2,
    img_4,
    img_3,
    img_6,
    img_7,
    img_8,
    img_9,
    img_10,
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
        <p>
          Shubukan is now spreading its spirit in many country. Shubukan has
          branches in Czech, Switzerland, Canada, Germany, Spain and in India.
        </p>
      </section>

      <section className="world">
        <div className="country">
          <h2>Czech Republic</h2>
          <div className="line"></div>

          <div className="profile">
            <div className="image">
              <img src={img_1} alt="" onClick={() => imgPop(img_1)} />
              <p>Sensei Jan Gyuris</p>
            </div>

            <div className="social">
              <div className="link">
                <IonIcon icon={globeOutline} className="label" />
                <NavLink
                  to="https://www.rbka.cz"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  www.rbka.cz
                </NavLink>
              </div>

              <div className="link">
                <IonIcon icon={logoFacebook} className="label" />
                <NavLink
                  to="https://www.facebook.com/rbka.cz/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  Facebook
                </NavLink>
              </div>

              <div className="link">
                <IonIcon icon={logoInstagram} className="label" />
                <NavLink
                  to="https://www.youtube.com/channel/UCdOqvpG3f3JIBb_unUlCgcg"
                  className="opt"
                  target="_blank"
                  rel="instagram link"
                >
                  Youtube
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}

        <div className="country">
          <h2>Switzerland</h2>
          <div className="line"></div>

          <div className="profile">
            <div className="image">
              <img src={img_3} alt="" onClick={() => imgPop(img_3)} />
              <p>Sensei Roan Morand</p>
            </div>

            <div className="social">
              <div className="link">
                <IonIcon icon={globeOutline} className="label" />
                <NavLink
                  to="https://kcconthey.ch/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  kcconthey.ch
                </NavLink>
              </div>

              <div className="link">
                <IonIcon icon={logoFacebook} className="label" />
                <NavLink
                  to="https://www.facebook.com/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  Facebook
                </NavLink>
              </div>

              <div className="link">
                <IonIcon icon={logoInstagram} className="label" />
                <NavLink
                  to="https://www.youtube.com/"
                  className="opt"
                  target="_blank"
                  rel="instagram link"
                >
                  Youtube
                </NavLink>
              </div>
            </div>
          </div>
        </div>
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
