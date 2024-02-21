import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Home.scss";

import birdImg from "../../assets/bird.svg";
import drogon from "../../assets/dragonx.png";
import drogon2 from "../../assets/dragony.png";
import treeImg from "../../assets/tree.svg";
import img2 from "../../assets/uemaImg2.svg";
import img3 from "../../assets/chibana.jpg";

import quot1 from "../../assets/quot (1).jpg";
import quot2 from "../../assets/quot (2).jpg";
import sg1 from "../../assets/sg1.jpg";
import sg2 from "../../assets/sg2.jpg";

import thumb_1 from "../../thumbnail/chibana.jpg";
import thumb_21 from "../../thumbnail/joki_sai.jpg";
import thumb_22 from "../../thumbnail/kaynChotuku.jpg";
import thumb_24 from "../../thumbnail/Matsumura.jpg";
import thumb_25 from "../../thumbnail/oldGroup.jpg";

import img_1 from "../../images/chibana.jpg";
import img_21 from "../../images/joki_sai.jpg";
import img_22 from "../../images/kaynChotuku.png";
import img_24 from "../../images/Matsumura.png";
import img_25 from "../../images/oldGroup.jpg";

import ReactGA from 'react-ga';

export default function Home({ setShowNav }) {

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  
  const [slider, setSlider] = useState(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(null);
  const [item, setItem] = useState(".items1");
  const [popImg, setPopImg] = useState("");
  const [imgClicked, setImgClicked] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const sliderElement = document.querySelector(item);
    setSlider(sliderElement);

    const handleMouseDown = (e) => {
      setIsDown(true);
      sliderElement.classList.add("active");
      setStartX(e.pageX - sliderElement.offsetLeft);
      setScrollLeft(sliderElement.scrollLeft);
    };

    const handleMouseLeave = () => {
      setIsDown(false);
      sliderElement.classList.remove("active");
    };

    const handleMouseUp = () => {
      setIsDown(false);
      sliderElement.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sliderElement.offsetLeft;
      const walk = (x - startX) * 0.5; //scroll-fast
      sliderElement.scrollLeft = scrollLeft - walk;
    };

    if (sliderElement) {
      sliderElement.addEventListener("mousedown", handleMouseDown);
      sliderElement.addEventListener("mouseleave", handleMouseLeave);
      sliderElement.addEventListener("mouseup", handleMouseUp);
      sliderElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("mousedown", handleMouseDown);
        sliderElement.removeEventListener("mouseleave", handleMouseLeave);
        sliderElement.removeEventListener("mouseup", handleMouseUp);
        sliderElement.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [slider, isDown, startX, scrollLeft, item]);

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
    <div className="Home">
      <div className="tree">
        <img src={treeImg} alt="" />
      </div>
      <div className="line">
        <div className="lineColor"></div>
        {/* <img src="bushido.png" alt="" /> */}
      </div>

      <section className="hero">
        <h1>Shubukan Uema Dojo India</h1>
        <p>
          {/* <i>&nbsp;</i> Beneath the instinct to fight
        </p>
        <p> */}
          Pure soul is the preserver of true karate<i>&nbsp;</i>
        </p>
        <div className="bird">
          <img src={birdImg} alt="" />
        </div>
      </section>
      {console.log(windowWidth)}

      <section className="intro">
        {windowWidth <= 400 ? (
          <div className="define">
            {/* <h1>The Way</h1> */}
            <div>
              <p>DISCIPLINE</p>
              <div></div>
              <p>RESPECT</p>
              <div></div>
              <p>TECHNIQUE</p>
            </div>
          </div>
        ) : (
          <div className="define">
            {/* <h1>The Way</h1> */}
            <div>
              <p>Discipline</p>
              <div></div>
              <p>Respect</p>
              <div></div>
              <p>Technique</p>
            </div>
          </div>
        )}

        <div className="drogon">
          <img src={drogon} alt="" />
        </div>

        <div className="description">
          <h1>THE SHUBUKAN WAY</h1>

          <div className="offering">
            <p>Shorin Ryu Karate</p>
            <div></div>
            <p>Okinawan Kobujutsu</p>
          </div>

          <p>
            Okinawan Karate is simply designed for self-defense and it is the
            bearer of Okinawan tradition, culture and history. Shorin ryu of
            shubukan school carries the orthodox way of karate-kobudo and
            preserving its beauty. Shubukanis are strong and like to walk on a
            pure path of karate. We shubukan members are strong family, always
            trying to educate ourselves through the journey of Okinawan karate.
          </p>
          <div className="underline"></div>
        </div>

        <div className="drogon2">
          <img src={drogon2} alt="" />
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

      <section className="gallery">
        <div className="galleryTop">
          <NavLink to="/gallery" className="opt">
            <h4>GALLERY</h4>
          </NavLink>
        </div>

        <div>
          <div className="image" onClick={() => imgPop(img3)}>
            <img src={img3} alt="chosin chibana" />
          </div>
          <div className="image" onClick={() => imgPop(img_25)}>
            <img src={thumb_25} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img_24)}>
            <img src={thumb_24} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img2)}>
            <img src={img2} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img_22)}>
            <img src={thumb_22} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img_21)}>
            <img src={thumb_21} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img_1)}>
            <img src={thumb_1} alt="image" />
          </div>
        </div>
      </section>

      <section className="blog">
        <div className="blogLine"></div>
        {/* <h1>Never Fade Away</h1> */}

        <div className="define">
          <div>
            <p>Body</p>
            <div></div>
            <p>Mind</p>
            <div></div>
            <p>Spirit</p>
          </div>
        </div>

        <div className="quotes1">
          <div className="box1">
            <div className="quote">
              <p>
                When you block overall, imagine you are attacking. When someone
                punches you, you don't move to evade the punch, but rather to
                break the arm.
              </p>
              <p className="sensei">Sensei Takeshi Uema</p>
              <p className="sensei">7th Dan Okinawa Shorin-Ryu</p>
            </div>

            <img src={quot1} alt="" />
          </div>
          <div className="box2">
            <img src={quot2} alt="" />

            <div className="quote">
              <p>
                Our karate is not a sport but a budo. It is about tempering
                oneself. To never give up. This spirit can be reached only if
                one goes through hard training with all one's might. Spiritual
                strength comes only through hard training. It is a way of
                forging oneself.
              </p>
              <p className="sensei">Sensei Yasuhiro Uema</p>
              <p className="sensei">10th Dan Okinawan Shorin-Ryu</p>
            </div>
          </div>
        </div>

        <div className="blogLine"></div>

        <div className="quotes2">
          <p className="story0">
            Okinawan karate is for self-defence and self-development. Okinawan
            karate is not sport. It is education and for philosophical
            development.
          </p>
          <p className="sensei">Sensei Sabyasachi</p>
        </div>

        <div className="img-div">
          <img src={sg1} alt="" />
          <img src={sg2} alt="" />
        </div>

        <p className="story1">
          Karate as a martial art is about self-defense. Overcoming your own
          weaknesses, never bending in any circumstance, it is about developing
          an unshakable spirit. In karate what is important is to cultivate the
          strength to concentrate your spirit on one thing with heart and soul.
        </p>

        <p className="story2">
          Empty-handed and carrying no weapon, dominating an adversary with body
          and soul only, karate, a martial art of self-defense. To master the
          way, a long and arduous journey awaits.
        </p>
      </section>
    </div>
  );
}
