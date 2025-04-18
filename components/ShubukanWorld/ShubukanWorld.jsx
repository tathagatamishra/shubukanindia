"use client";
import { useEffect, useState } from "react";
import "./ShubukanWorld.scss";

import { useRouter } from "next/navigation";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { SlGlobe } from "react-icons/sl";

export default function ShubukanWorld({ setShowNav }) {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };
  const imgArray = [
    "./world_images/img (14).jpg",
    "./world_images/img (8).jpg",
    "./world_images/img (13).jpg",
    "./images/group (5).jpeg",
    "./world_images/img (15).jpg",
    "./world_images/img (17).jpg",
    "./world_images/img (1).jpeg",
    "./world_images/img (2).jpeg",
    "./world_images/img (3).jpeg",
    "./world_images/img (4).jpeg",
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
              <img
                src="./world_images/img (14).jpg"
                alt=""
                onClick={() => imgPop("./world_images/img (14).jpg")}
              />
              <p>Sensei Jan Gyuris</p>
            </div>

            <div className="social">
              <div className="link">
                <SlGlobe className="label" />
                <div
                  onClick={() => "https://www.rbka.cz"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  www.rbka.cz
                </div>
              </div>

              <div className="link">
                <FaFacebook className="label" />
                <div
                  onClick={() => "https://www.facebook.com/rbka.cz/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  Facebook
                </div>
              </div>

              <div className="link">
                <FaYoutube className="label" />
                <div
                  onClick={() =>
                    "https://www.youtube.com/channel/UCdOqvpG3f3JIBb_unUlCgcg"
                  }
                  className="opt"
                  target="_blank"
                  rel="instagram link"
                >
                  Youtube
                </div>
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
                <img
                  src="./world_images/img (17).jpg"
                  alt=""
                  onClick={() => imgPop("./world_images/img (17).jpg")}
                />
                <p>Sensei Roan Morand</p>
              </div>
              <div className="image">
                <img
                  src="./world_images/img (15).jpg"
                  alt=""
                  onClick={() => imgPop("./world_images/img (15).jpg")}
                />
                <p>Sensei Laurent Batiste</p>
              </div>
            </div>

            <div className="social">
              <div className="link">
                <SlGlobe className="label" />
                <div
                  onClick={() => "https://kcconthey.ch/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  kcconthey.ch
                </div>
              </div>
              <div className="link">
                <SlGlobe className="label" />
                <div
                  onClick={() => "https://www.karate-okinawa.ch/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karate-okinawa.ch
                </div>
              </div>

              <div className="link">
                <FaFacebook className="label" />
                <div
                  onClick={() => "https://www.facebook.com/karateclublatour/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karateclublatour
                </div>
              </div>
              <div className="link">
                <FaFacebook className="label" />
                <div
                  onClick={() => "https://www.facebook.com/karateclubsaxon/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karateclubsaxon
                </div>
              </div>
              <div className="link">
                <FaFacebook className="label" />
                <div
                  onClick={() => "https://www.facebook.com/karateclubconthey/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  karateclubconthey
                </div>
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
              <img
                src="./world_images/img (13).jpg"
                alt=""
                onClick={() => imgPop("./world_images/img (13).jpg")}
              />
              <p>Sensei Vaillancourt Chantal</p>
            </div>

            <div className="social">
              <div className="link">
                <FaFacebook className="label" />
                <div
                  onClick={() => "https://www.facebook.com/KarateBoisbriand"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  KarateBoisbriand
                </div>
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
              <img
                src="./world_images/img (3).jpeg"
                alt=""
                onClick={() => imgPop("./world_images/img (3).jpeg")}
              />
              <p>Sensei Antonio Caselles Mulet</p>
            </div>

            <div className="social">
              <div className="link">
                <SlGlobe className="label" />
                <div
                  onClick={() => "https://shubukanterrassa.org/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  shubukanterrassa.org
                </div>
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
              <img
                src="./world_images/img (2).jpeg"
                alt=""
                onClick={() => imgPop("./world_images/img (2).jpeg")}
              />
              <p>Sensei Roman Křapka</p>
            </div>

            <div className="social">
              <div className="link">
                <SlGlobe className="label" />
                <div
                  onClick={() => "https://shubukan.de/"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  shubukan.de
                </div>
              </div>

              <div className="link">
                <FaFacebook className="label" />
                <div
                  onClick={() => "https://www.facebook.com/shubukan.de"}
                  className="opt"
                  target="_blank"
                  rel="facebook link"
                >
                  Shubukan.de
                </div>
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
