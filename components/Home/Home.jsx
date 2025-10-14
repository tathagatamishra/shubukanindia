"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isDesktop, isMobile } from "react-device-detect";
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
    if (typeof window !== undefined) {
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
    <main
      className="Home"
      style={{
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1000px",
      }}
    >
      <div
        className="tree"
        style={{
          zIndex: 1,
          right: "0%",
          position: "absolute",
          transition: "300ms",
          filter: "opacity(80%)",
        }}
      >
        <Image
          src="/assets/tree.png"
          style={{
            width: "100%",
            objectFit: "contain",
            userSelect: "none",
          }}
          alt=""
          height={1440}
          width={1440}
        />
      </div>

      <section
        className="hero"
        style={{
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <div
          className="heading-div"
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "S", text: "Shubukan " },
            { id: "U", text: "Uema " },
            { id: "D", text: "Dojo " },
            { id: "I", text: "India" },
          ].map(({ id, text }) => (
            <div
              key={id}
              className="font-amanojaku heading-box"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {text.split("").map((char, i) => (
                <p
                  key={i}
                  id={i === 0 ? id : undefined}
                  className="font-amanojaku heading"
                  style={{
                    color: "#2a2727",
                    wordSpacing: "0.2rem",
                    transform: "rotate(-4deg)",
                    margin: 0,
                  }}
                >
                  {char}
                </p>
              ))}
            </div>
          ))}
        </div>

        <p
          className="sub-heading"
          style={{
            margin: 0,
            fontFamily: "'Amarante', cursive",
          }}
        >
          Pure soul is the preserver of true karate<i>&nbsp;</i>
        </p>

        <div
          className="bird"
          style={{
            zIndex: 1,
            position: "absolute",
            filter: "sepia(20%) opacity(80%)",
            transition: "300ms",
          }}
        >
          <Image
            src="/assets/bird.png"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "contain",
              userSelect: "none",
            }}
            alt=""
            height={1440}
            width={1440}
          />
        </div>
      </section>

      <section
        className="intro"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          transition: "300ms",
        }}
      >
        {isMobile ? (
          <div
            className="define"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* <h1>The Way</h1> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <p>DISCIPLINE</p>
              <div></div>
              <p>RESPECT</p>
              <div></div>
              <p>TECHNIQUE</p>
            </div>
          </div>
        ) : (
          <div
            className="define"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* <h1>The Way</h1> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <p>Discipline</p>
              <div></div>
              <p>Respect</p>
              <div></div>
              <p>Technique</p>
            </div>
          </div>
        )}

        <div
          className="drogon"
          style={{
            zIndex: 1,
            right: "0%",
            position: "absolute",
            filter: "sepia(100%) opacity(65%)",
            transition: "300ms",
          }}
        >
          <Image
            src="/assets/dragonx.png"
            style={{
              width: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
            alt=""
            height={1440}
            width={1440}
          />
        </div>

        <div
          className="description"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "1000px",
          }}
        >
          <h1
            style={{
              color: "#262626da",
              fontFamily: "'Tenali Ramakrishna', sans-serif",
              width: "100%",
              transition: "200ms",
            }}
          >
            THE SHUBUKAN WAY
          </h1>

          <div
            className="offering"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontFamily: "'GFS Neohellenic', sans-serif",
                transition: "200ms",
                margin: 0,
              }}
            >
              Shorin Ryu Karate
            </p>
            <div
              style={{
                transform: "translateY(20%)",
                background: "linear-gradient(#403D3C, transparent)",
                transition: "200ms",
              }}
            ></div>
            <p
              style={{
                fontFamily: "'GFS Neohellenic', sans-serif",
                transition: "200ms",
                margin: 0,
              }}
            >
              Okinawan Kobujutsu
            </p>
          </div>

          <p
            style={{
              textAlign: "justify",
              fontFamily: "'GFS Neohellenic', sans-serif",
              transition: "200ms",
            }}
          >
            Okinawan Karate is simply designed for self-defense and it is the
            bearer of Okinawan tradition, culture and history. Shorin ryu of
            shubukan school carries the orthodox way of karate-kobudo and
            preserving its beauty. Shubukanis are strong and like to walk on a
            pure path of karate. We shubukan members are strong family, always
            trying to educate ourselves through the journey of Okinawan karate.
          </p>
          <div
            className="underline"
            style={{
              marginTop: "2rem",
              height: "2px",
              width: "100%",
              background:
                "linear-gradient(-90deg, #905043 0%, transparent 60%)",
              opacity: 0.3,
              transition: "1000ms",
            }}
          ></div>
        </div>

        <div
          className="drogon2"
          style={{
            zIndex: 1,
            left: "0%",
            position: "absolute",
            filter: "sepia(100%) opacity(65%)",
            transition: "200ms",
          }}
        >
          <Image
            src="/assets/dragony.png"
            style={{
              width: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
            alt=""
            height={1440}
            width={1440}
          />
        </div>
      </section>

      {imgClicked && (
        <div className="popUp">
          <div className="popBack" onClick={imgPop}></div>
          <div className="imgPop" onClick={imgPop}>
            <Image src={popImg} alt="image" height={1440} width={1440} />
          </div>
        </div>
      )}

      <section
        className="gallery"
        style={{
          margin: "5rem 0 2rem 0",
          gap: "1rem",
        }}
      >
        <div
          className="galleryTop"
          style={{
            width: "100%",
            height: "2px",
            fontSize: "28px",
            fontFamily: "'Tenali Ramakrishna', sans-serif",
            color: "rgba(125, 103, 97, 0.808)",
            background:
              "linear-gradient(-90deg, transparent 0%, rgba(88, 78, 78, 0.514) 100%)",
            transition: "300ms",
          }}
        >
          <div onClick={() => navigate("/gallery")} className="opt">
            <h4
              style={{
                transition: "200ms",
                color: "rgba(125, 103, 97, 0.808)",
                cursor: "pointer",
                textDecoration: "none",
                margin: 0,
              }}
            >
              GALLERY
            </h4>
          </div>
        </div>

        <div>
          <div
            className="image"
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "block",
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe1d6df",
              borderRadius: "8px",
              borderTop: "solid 1.5px transparent",
              borderLeft: "solid 1.5px transparent",
              transition: "all 300ms ease-in-out",
            }}
            onClick={() => imgPop("/web_images/shureimon_gate_low.jpg")}
          >
            <Image
              src="/web_images/shureimon_gate_high.jpg"
              className="img"
              style={{
                height: "auto",
                width: "100%",
                borderRadius: "8px",
                filter: "sepia(50%) grayscale(30%)",
                display: "block",
                backgroundSize: "cover",
                userSelect: "none",
                transition:
                  "transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 0.5s ease",
              }}
              alt="shureimon gate"
              height={720}
              width={720}
            />
          </div>
          <div
            className="image"
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "block",
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe1d6df",
              borderRadius: "8px",
              borderTop: "solid 1.5px transparent",
              borderLeft: "solid 1.5px transparent",
              transition: "all 300ms ease-in-out",
            }}
            onClick={() => imgPop("/web_images/chibana_high.jpg")}
          >
            <Image
              src="/web_images/chibana_high.jpg"
              className="img"
              style={{
                height: "auto",
                width: "100%",
                borderRadius: "8px",
                filter: "sepia(50%) grayscale(30%)",
                display: "block",
                backgroundSize: "cover",
                userSelect: "none",
                transition:
                  "transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 0.5s ease",
              }}
              alt="image"
              height={720}
              width={720}
            />
          </div>
          <div
            className="image"
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "block",
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe1d6df",
              borderRadius: "8px",
              borderTop: "solid 1.5px transparent",
              borderLeft: "solid 1.5px transparent",
              transition: "all 300ms ease-in-out",
            }}
            onClick={() => imgPop("/web_images/Matsumura_high.png")}
          >
            <Image
              src="/web_images/Matsumura_low.jpg"
              className="img"
              style={{
                height: "auto",
                width: "100%",
                borderRadius: "8px",
                filter: "sepia(50%) grayscale(30%)",
                display: "block",
                backgroundSize: "cover",
                userSelect: "none",
                transition:
                  "transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 0.5s ease",
              }}
              alt="image"
              height={720}
              width={720}
            />
          </div>
          <div
            className="image"
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "block",
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe1d6df",
              borderRadius: "8px",
              borderTop: "solid 1.5px transparent",
              borderLeft: "solid 1.5px transparent",
              transition: "all 300ms ease-in-out",
            }}
            onClick={() => imgPop("/web_images/uema_family_high.jpg")}
          >
            <Image
              src="/web_images/uema_family_low.jpg"
              className="img"
              style={{
                height: "auto",
                width: "100%",
                borderRadius: "8px",
                filter: "sepia(50%) grayscale(30%)",
                display: "block",
                backgroundSize: "cover",
                userSelect: "none",
                transition:
                  "transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 0.5s ease",
              }}
              alt="image"
              height={720}
              width={720}
            />
          </div>
          <div
            className="image"
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "block",
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe1d6df",
              borderRadius: "8px",
              borderTop: "solid 1.5px transparent",
              borderLeft: "solid 1.5px transparent",
              transition: "all 300ms ease-in-out",
            }}
            onClick={() => imgPop("/web_images/oldGroup.jpg")}
          >
            <Image
              src="/web_images/oldGroup.jpg"
              className="img"
              style={{
                height: "auto",
                width: "100%",
                borderRadius: "8px",
                filter: "sepia(50%) grayscale(30%)",
                display: "block",
                backgroundSize: "cover",
                userSelect: "none",
                transition:
                  "transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 0.5s ease",
              }}
              alt="image"
              height={720}
              width={720}
            />
          </div>
          <div
            className="image"
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "block",
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe1d6df",
              borderRadius: "8px",
              borderTop: "solid 1.5px transparent",
              borderLeft: "solid 1.5px transparent",
              transition: "all 300ms ease-in-out",
            }}
            onClick={() => imgPop("/web_images/joki_sai_high.jpg")}
          >
            <Image
              src="/web_images/joki_sai_high.jpg"
              className="img"
              style={{
                height: "auto",
                width: "100%",
                borderRadius: "8px",
                filter: "sepia(50%) grayscale(30%)",
                display: "block",
                backgroundSize: "cover",
                userSelect: "none",
                transition:
                  "transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 0.5s ease",
              }}
              alt="image"
              height={720}
              width={720}
            />
          </div>
          <div
            className="image"
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "block",
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe1d6df",
              borderRadius: "8px",
              borderTop: "solid 1.5px transparent",
              borderLeft: "solid 1.5px transparent",
              transition: "all 300ms ease-in-out",
            }}
            onClick={() => imgPop("/web_images/kaynChotuku_high.png")}
          >
            <Image
              src="/web_images/kaynChotuku_high.png"
              className="img"
              style={{
                height: "auto",
                width: "100%",
                borderRadius: "8px",
                filter: "sepia(50%) grayscale(30%)",
                display: "block",
                backgroundSize: "cover",
                userSelect: "none",
                transition:
                  "transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 0.5s ease",
              }}
              alt="image"
              height={720}
              width={720}
            />
          </div>
        </div>
      </section>

      <section
        className="blog"
        style={{
          width: "100%",
          marginBottom: "5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          className="blogLine"
          style={{
            margin: "3rem 0",
            height: "2px",
            width: "80%",
            background: "radial-gradient(circle, #905043 0%, transparent 100%)",
            opacity: 0.5,
            transition: "1000ms",
          }}
        ></div>
        {/* <h1>Never Fade Away</h1> */}

        <div
          className="define"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontFamily: "'Amarante', cursive",
                transition: "200ms",
                margin: 0,
              }}
            >
              Body
            </p>
            <div
              style={{
                width: "3.5px",
                height: "50px",
                transform: "translateY(20%)",
                background: "linear-gradient(#403D3C, transparent)",
                transition: "200ms",
              }}
            ></div>
            <p
              style={{
                textAlign: "center",
                fontFamily: "'Amarante', cursive",
                transition: "200ms",
                margin: 0,
              }}
            >
              Mind
            </p>
            <div
              style={{
                width: "3.5px",
                height: "50px",
                transform: "translateY(20%)",
                background: "linear-gradient(#403D3C, transparent)",
                transition: "200ms",
              }}
            ></div>
            <p
              style={{
                textAlign: "center",
                fontFamily: "'Amarante', cursive",
                transition: "200ms",
                margin: 0,
              }}
            >
              Spirit
            </p>
          </div>
        </div>

        <div
          className="quotes1"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <div
            className="box1"
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div className="quote">
              <p
                style={{
                  color: "#4b423b",
                  fontFamily: "'Bellefair', serif",
                  margin: 0,
                }}
              >
                When you block overall, imagine you are attacking. When someone
                punches you, you don't move to evade the punch, but rather to
                break the arm.
              </p>
              <p
                className="sensei"
                style={{
                  fontStyle: "italic",
                  margin: 0,
                  color: "#4b423b",
                  fontFamily: "'Bellefair', serif",
                }}
              >
                Sensei Takeshi Uema
              </p>
              <p
                className="sensei"
                style={{
                  fontStyle: "italic",
                  margin: 0,
                  color: "#4b423b",
                  fontFamily: "'Bellefair', serif",
                }}
              >
                7th Dan Okinawa Shorin-Ryu
              </p>
            </div>

            <Image
              src="/assets/quot (1).jpg"
              style={{
                objectFit: "contain",
                borderRadius: "10px",
                filter: "sepia(30%) grayscale(30%)",
              }}
              alt=""
              height={1440}
              width={1440}
            />
          </div>
          <div
            className="box2"
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Image
              src="/assets/quot (2).jpg"
              style={{
                objectFit: "contain",
                borderRadius: "10px",
                filter: "sepia(30%) grayscale(30%)",
              }}
              alt=""
              height={1440}
              width={1440}
            />

            <div className="quote">
              <p
                style={{
                  color: "#4b423b",
                  fontFamily: "'Bellefair', serif",
                  textAlign: "right",
                  margin: 0,
                }}
              >
                Our karate is not a sport but a budo. It is about tempering
                oneself. To never give up. This spirit can be reached only if
                one goes through hard training with all one's might. Spiritual
                strength comes only through hard training. It is a way of
                forging oneself.
              </p>
              <p
                className="sensei"
                style={{
                  fontStyle: "italic",
                  margin: 0,
                  color: "#4b423b",
                  fontFamily: "'Bellefair', serif",
                  textAlign: "right",
                }}
              >
                Sensei Yasuhiro Uema
              </p>
              <p
                className="sensei"
                style={{
                  fontStyle: "italic",
                  margin: 0,
                  color: "#4b423b",
                  fontFamily: "'Bellefair', serif",
                  textAlign: "right",
                }}
              >
                10th Dan Okinawan Shorin-Ryu
              </p>
            </div>
          </div>
        </div>

        <div
          className="blogLine"
          style={{
            margin: "3rem 0",
            height: "2px",
            width: "80%",
            background: "radial-gradient(circle, #905043 0%, transparent 100%)",
            opacity: 0.5,
            transition: "1000ms",
          }}
        ></div>

        <div className="quotes2">
          <p
            className="story0"
            style={{
              color: "#4b423b",
              fontSize: "1.5rem",
              fontFamily: "'Bellefair', serif",
            }}
          >
            Okinawan karate is for self-defence and self-development. Okinawan
            karate is not sport. It is education and for philosophical
            development.
          </p>
          <p
            className="sensei"
            style={{
              color: "#4b423b",
              fontFamily: "'Bellefair', serif",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Sensei Sabyasachi
          </p>
        </div>

        <div
          className="img-div"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Image
            src="/assets/sg1.jpg"
            style={{
              borderRadius: "10px",
              filter: "sepia(30%) grayscale(30%)",
            }}
            alt=""
            height={1440}
            width={1440}
          />
          <Image
            src="/assets/sg2.jpg"
            style={{
              borderRadius: "10px",
              filter: "sepia(30%) grayscale(30%)",
            }}
            alt=""
            height={1440}
            width={1440}
          />
        </div>

        <p
          className="story1"
          style={{
            margin: "2rem 0",
            color: "#4b423b",
            fontSize: "1.5rem",
            fontFamily: "'Bellefair', serif",
          }}
        >
          Karate as a martial art is about self-defense. Overcoming your own
          weaknesses, never bending in any circumstance, it is about developing
          an unshakable spirit. In karate what is important is to cultivate the
          strength to concentrate your spirit on one thing with heart and soul.
        </p>

        <p
          className="story2"
          style={{
            marginBottom: "5rem",
            color: "#4b423b",
            fontSize: "1.5rem",
            fontFamily: "'Bellefair', serif",
            textAlign: "right",
          }}
        >
          Empty-handed and carrying no weapon, dominating an adversary with body
          and soul only, karate, a martial art of self-defense. To master the
          way, a long and arduous journey awaits.
        </p>
      </section>
    </main>
  );
}
