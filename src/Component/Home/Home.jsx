import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Home.scss";

import birdImg from "../../assets/bird.png";
import drogon from "../../assets/dragon.png";
import drogon2 from "../../assets/dragon2.png";
import treeImg from "../../assets/tree.png";
import img1 from "../../assets/uemaImg1.svg";
import img2 from "../../assets/uemaImg2.svg";
import img3 from "../../assets/chibana.jpg";
import img4 from "../../assets/mag2.jpg";
import img5 from "../../assets/uema.jpg";
import img6 from "../../images/img (9).jpg";
import img7 from "../../images/img (6).jpg";
import img8 from "../../images/img (4).jpg";
import img9 from "../../assets/trans.png";
let unsplash1 =
  "https://images.unsplash.com/photo-1460411794035-42aac080490a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGFic3RyYWN0JTIwJTIwc2t5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60";
let unsplash2 =
  "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YWJzdHJhY3QlMjAlMjBza3l8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";

export default function Home({ setShowNav }) {
  const [slider, setSlider] = useState(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(null);
  const [item, setItem] = useState(".items1");
  const [popImg, setPopImg] = useState("");
  const [imgClicked, setImgClicked] = useState(false);

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

      <section className="intro">
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

        <div className="drogon">
          <img src={drogon} alt="" />
        </div>

        <div className="description">
          <h1>THE SHUBUKAN WAY</h1>

          <div className="offering">
            <p>Shorin Ryu Karate</p>
            <div></div>
            <p>Okinawan Kobu Jutsu</p>
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
          <div className="imgPop">
            <img src={popImg} alt="image" />
          </div>
        </div>
      )}

      <section className="gallery">
        <div className="galleryTop">
          <NavLink to="/Gallery" className="opt">
            <h4>GALLERY</h4>
          </NavLink>
        </div>
        <div>
          <div className="image">
            {/* <img src={img9} alt="blank" /> */}
          </div>
          <div className="image" onClick={() => imgPop(img3)}>
            <img src={img3} alt="chosin chibana" />
          </div>
          <div className="image" onClick={() => imgPop(img5)}>
            <img src={img5} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img2)}>
            <img src={img2} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img4)}>
            <img src={img4} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img8)}>
            <img src={img8} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img1)}>
            <img src={img1} alt="image" />
          </div>
          <div className="image" onClick={() => imgPop(img7)}>
            <img src={img7} alt="image" />
          </div>

          <div className="image" onClick={() => imgPop(img6)}>
            <img src={img6} alt="image" />
          </div>
        </div>
      </section>

      <section className="blog">
        <div className="blogLine"></div>
        {/* <h1>Never Fade Away</h1> */}
        <p>
          Karate as a martial art is about self-defense. Overcoming your own
          weaknesses, never bending in any circumstance, it is about developing
          an unshakable spirit. In karate what is important is to cultivate the
          strength to concentrate your spirit on one thing with heart and soul.
        </p>
        {/* <h1>Blog</h1>
        <div className="row1">
          <div className="leftBar"></div>
          <div className="items1" onMouseOver={() => setItem(".items1")}>
            <div className="item1"></div>
            <div className="item1"></div>
            <div className="item1"></div>
            <div className="item1"></div>
            <div className="item1"></div>
          </div>
          <div className="rightBar"></div>
        </div>
        <div className="row2" onMouseOver={() => setItem(".items2")}>
          <div className="leftBar"></div>
          <div className="items2">
            <div className="item2"></div>
            <div className="item2"></div>
            <div className="item2"></div>
            <div className="item2"></div>
            <div className="item2"></div>
          </div>
          <div className="rightBar"></div>
        </div> */}
        <p>
          Empty-handed and carrying no weapon, dominating an adversary with body
          and soul only, karate, a martial art of self-defense. To master the
          way, a long and arduous journey awaits.
        </p>
      </section>
    </div>
  );
}
