import { useEffect, useState } from "react";
import "./ShubukanWorld.scss";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { globeOutline, logoFacebook, logoYoutube } from "ionicons/icons";

import img_1 from "../../world_images/img (14).jpg";
import img_2 from "../../world_images/img (13).jpg";
import img_3 from "../../world_images/img (17).jpg";
import img_4 from "../../world_images/img (15).jpg";
import img_5 from "../../world_images/img (8).jpg";
import img_6 from "../../world_images/img (1).jpeg";
import img_7 from "../../world_images/img (2).jpeg";
import img_8 from "../../world_images/img (3).jpeg";
import img_9 from "../../world_images/img (4).jpeg";
import img_10 from "../../images/group (5).jpeg";

import ReactGA from "react-ga";

export default function ShubukanWorld({ setShowNav }) {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  const imgArray = [
    img_1,
    img_5,
    img_2,
    img_10,
    img_4,
    img_3,
    img_6,
    img_7,
    img_8,
    img_9,
  ];

  const [popImg, setPopImg] = useState("");
  const [imgClicked, setImgClicked] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

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
        <p className="heading">Shubukan World</p>
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
                <IonIcon icon={logoYoutube} className="label" />
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

          <div className="Switzerland">
            <div className="img-div">
              <div className="image">
                <img src={img_3} alt="" onClick={() => imgPop(img_3)} />
                <p>Sensei Roan Morand</p>
              </div>
              <div className="image">
                <img src={img_4} alt="" onClick={() => imgPop(img_4)} />
                <p>Sensei Laurent Batiste</p>
              </div>
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
                <IonIcon icon={globeOutline} className="label" />
                <NavLink
                  to="https://www.karate-okinawa.ch/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karate-okinawa.ch
                </NavLink>
              </div>

              <div className="link">
                <IonIcon icon={logoFacebook} className="label" />
                <NavLink
                  to="https://www.facebook.com/karateclublatour/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karateclublatour
                </NavLink>
              </div>
              <div className="link">
                <IonIcon icon={logoFacebook} className="label" />
                <NavLink
                  to="https://www.facebook.com/karateclubsaxon/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karateclubsaxon
                </NavLink>
              </div>
              <div className="link">
                <IonIcon icon={logoFacebook} className="label" />
                <NavLink
                  to="https://www.facebook.com/karateclubconthey/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karateclubconthey
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}

        <div className="country">
          <h2>Canada</h2>
          <div className="line"></div>

          <div className="profile">
            <div className="image">
              <img src={img_2} alt="" onClick={() => imgPop(img_2)} />
              <p>Sensei Vaillancourt Chantal</p>
            </div>

            <div className="social">
              <div className="link">
                <IonIcon icon={logoFacebook} className="label" />
                <NavLink
                  to="https://www.facebook.com/KarateBoisbriand"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  KarateBoisbriand
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}

        <div className="country">
          <h2>Spain</h2>
          <div className="line"></div>

          <div className="profile">
            <div className="image">
              <img src={img_8} alt="" onClick={() => imgPop(img_8)} />
              <p>Sensei Antonio Caselles Mulet</p>
            </div>

            <div className="social">
              <div className="link">
                <IonIcon icon={globeOutline} className="label" />
                <NavLink
                  to="https://shubukanterrassa.org/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  shubukanterrassa.org
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}

        <div className="country">
          <h2>Germany</h2>
          <div className="line"></div>

          <div className="profile">
            <div className="image">
              <img src={img_7} alt="" onClick={() => imgPop(img_7)} />
              <p>Sensei Roman Křapka</p>
            </div>

            <div className="social">
              <div className="link">
                <IonIcon icon={globeOutline} className="label" />
                <NavLink
                  to="https://shubukan.de/"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  shubukan.de
                </NavLink>
              </div>

              <div className="link">
                <IonIcon icon={logoFacebook} className="label" />
                <NavLink
                  to="https://www.facebook.com/shubukan.de"
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  Shubukan.de
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {imgClicked && (
        <div className="popUp">
          <div className="popBack" onClick={imgPop}></div>
          <div className="imgPop" onClick={imgPop}>
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
