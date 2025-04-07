"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./Home.scss";
import Image from "next/image";


export default function Home({ setShowNav }) {

  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };
  
  const [slider, setSlider] = useState(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(null);
  const [item, setItem] = useState(".items1");
  const [popImg, setPopImg] = useState("");
  const [imgClicked, setImgClicked] = useState(false);

  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    if(window !== undefined) {
      setWindowWidth(window.innerWidth);
    }
  }, []);

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
        <Image src="/assets/tree.svg" alt="" height={720} width={720} />
      </div>
      {/* <div className="line">
        <div className="lineColor"></div>
      </div> */}

      <section className="hero">
        <div className="heading-div">
          <div className="heading-box">
            <p className="heading" id="S">S</p>
            <p className="heading">h</p>
            <p className="heading">u</p>
            <p className="heading">b</p>
            <p className="heading">u</p>
            <p className="heading">k</p>
            <p className="heading">a</p>
            <p className="heading">n</p>
            <p className="heading">&nbsp;</p>
          </div>
          <div className="heading-box">
            <p className="heading" id="U">U</p>
            <p className="heading">e</p>
            <p className="heading">m</p>
            <p className="heading">a</p>
            <p className="heading">&nbsp;</p>
          </div>
          <div className="heading-box">
            <p className="heading" id="D">D</p>
            <p className="heading">o</p>
            <p className="heading">j</p>
            <p className="heading">o</p>
            <p className="heading">&nbsp;</p>
          </div>
          <div className="heading-box">
            <p className="heading" id="I">I</p>
            <p className="heading">n</p>
            <p className="heading">d</p>
            <p className="heading">i</p>
            <p className="heading">a</p>
          </div>
        </div>
        <p>
          {/* <i>&nbsp;</i> Beneath the instinct to fight
        </p>
        <p> */}
          Pure soul is the preserver of true karate<i>&nbsp;</i>
        </p>
        <div className="bird">
          <Image src="/assets/bird.svg" alt="" height={720} width={720} />
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
          <Image src="/assets/dragonx.png" alt="" height={720} width={720} />
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
          <Image src="/assets/dragony.png" alt="" height={720} width={720} />
        </div>
      </section>

      {imgClicked && (
        <div className="popUp">
          <div className="popBack" onClick={imgPop}></div>
          <div className="imgPop" onClick={imgPop}>
            <Image src={popImg} alt="image" height={720} width={720} />
          </div>
        </div>
      )}

      <section className="gallery">
        <div className="galleryTop">
          <div onClick={() => navigate("/gallery")} className="opt">
            <h4>GALLERY</h4>
          </div>
        </div>

        <div>
          <div className="image" onClick={() => imgPop("/assets/chibana.jpg")}>
            <Image src="/assets/chibana.jpg" alt="chosin chibana" height={720} width={720} />
          </div>
          <div className="image" onClick={() => imgPop("/thumbnail/oldGroup.jpg")}>
            <Image src="/thumbnail/oldGroup.jpg" alt="image" height={720} width={720} />
          </div>
          <div className="image" onClick={() => imgPop("/thumbnail/Matsumura.jpg")}>
            <Image src="/thumbnail/Matsumura.jpg" alt="image" height={720} width={720} />
          </div>
          <div className="image" onClick={() => imgPop("/assets/uemaImg2.svg")}>
            <Image src="/assets/uemaImg2.svg" alt="image" height={720} width={720} />
          </div>
          <div className="image" onClick={() => imgPop("/thumbnail/kaynChotuku.jpg")}>
            <Image src="/thumbnail/kaynChotuku.jpg" alt="image" height={720} width={720} />
          </div>
          <div className="image" onClick={() => imgPop("/thumbnail/joki_sai.jpg")}>
            <Image src="/thumbnail/joki_sai.jpg" alt="image" height={720} width={720} />
          </div>
          <div className="image" onClick={() => imgPop("/thumbnail/chibana.jpg")}>
            <Image src="/thumbnail/chibana.jpg" alt="image" height={720} width={720} />
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

            <Image src="/assets/quot (1).jpg" alt="" height={720} width={720} />
          </div>
          <div className="box2">
            <Image src="/assets/quot (2).jpg" alt="" height={720} width={720} />

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
          <Image src="/assets/sg1.jpg" alt="" height={720} width={720} />
          <Image src="/assets/sg2.jpg" alt="" height={720} width={720} />
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
