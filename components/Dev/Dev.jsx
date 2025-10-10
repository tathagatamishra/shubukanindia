"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import "./Dev.scss";
import Image from "next/image";

export default function Dev({ setShowNav }) {
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
    <>
      <div
        id="Navbar"
        style={{
          top: "0rem",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            zIndex: -1,
            borderRadius: "0%",
            filter: "url(#filter)",
            boxShadow: "400px 400px 46px 63px #ffffff",
            position: "absolute",
            top: "-676px",
            left: "-775px",
          }}
        />

        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigate("/");
          }}
          style={{
            width: "fit-content",
            height: "5rem",
            margin: "1rem 0 0 1rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            transition: "300ms",
          }}
        >
          <Image
            style={{
              height: "5rem",
              width: "auto",
              objectFit: "contain",
              marginLeft: "0.5rem",
              userSelect: "none",
              transition: "300ms",
              filter: "opacity(100%)",
              transform: "translateX(10%)",
            }}
            src="/assets/shubukan.png"
            alt="Shubukan Logo"
            height={1440}
            width={1440}
            quality={100}
          />
          <Image
            style={{
              height: "5rem",
              width: "auto",
              objectFit: "contain",
              marginLeft: "0.5rem",
              userSelect: "none",
              transition: "300ms",
              filter: "opacity(100%)",
              transform: "translateX(10%)",
            }}
            src="/assets/logo.png"
            alt="Shubukan Text"
            height={1440}
            width={1440}
            quality={100}
          />
        </div>

        <svg width="0" height="0">
          <filter id="filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".01"
              numOctaves="10"
            />
            <feDisplacementMap in="SourceGraphic" scale="60" />
          </filter>
        </svg>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transition: "200ms",
          }}
        >
          <div
            style={{
              zIndex: 4,
              width: "8rem",
              margin: "1.5rem 0",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "4px",
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(42, 32, 28, 1) 100%)",
                transition: "200ms",
                userSelect: "none",
              }}
            />
            <p
              style={{
                margin: "0 10px 0 0",
                fontSize: "1.5rem",
                textAlign: "right",
                color: "rgba(42, 32, 28, 1)",
                lineHeight: "24px",
                letterSpacing: "5px",
                fontFamily: "'Geo2', sans-serif",
                transition: "200ms",
                userSelect: "none",
              }}
            >
              MENU
            </p>
            <div
              style={{
                width: "100px",
                height: "4px",
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(42, 32, 28, 1) 100%)",
                transition: "200ms",
                userSelect: "none",
              }}
            />
          </div>
        </section>
      </div>

      {/* ================================================= */}

      <div
        style={{
          height: "fit-content",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          paddingTop: "10rem",
          maxWidth: "1000px",
          backgroundImage:
            'url("https://res.cloudinary.com/daspiwjet/image/upload/v1742818161/Shubukan/Assets/iksgnmlpeljd7mugtrba.jpg")',
          backgroundSize: "250px 250px",
        }}
      >
        <div
          style={{
            zIndex: 1,
            height: "500px",
            width: "500px",
            top: "0%",
            right: "0%",
            position: "absolute",
            transition: "300ms",
            filter: "opacity(80%)",
            transform: "scaleX(-1)",
          }}
        >
          <Image
            src="/assets/tree.png"
            alt=""
            height={1440}
            width={1440}
            style={{
              width: "100%",
              height: "500px",
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </div>

        <section
          style={{
            zIndex: 1,
            width: "100%",
            height: "38rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "2rem 0 0 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                fontFamily: "'AmanojakuZrqe3', sans-serif",
              }}
            >
              <p
                id="S"
                style={{
                  fontSize: "6.5rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                S
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                h
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                u
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                b
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                u
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                k
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                a
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                n
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                &nbsp;
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                fontFamily: "'AmanojakuZrqe3', sans-serif",
              }}
            >
              <p
                id="U"
                style={{
                  fontSize: "4.5rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                U
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                e
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                m
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                a
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                &nbsp;
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                fontFamily: "'AmanojakuZrqe3', sans-serif",
              }}
            >
              <p
                id="D"
                style={{
                  fontSize: "4.5rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                D
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                o
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                j
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                o
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                &nbsp;
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                fontFamily: "'AmanojakuZrqe3', sans-serif",
              }}
            >
              <p
                id="I"
                style={{
                  fontSize: "4.5rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                I
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                n
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                d
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                i
              </p>
              <p
                style={{
                  fontSize: "4rem",
                  color: "#2a2727",
                  letterSpacing: "0.2rem",
                  wordSpacing: "0.2rem",
                  textShadow:
                    "0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211), 0 0 6px rgb(231, 221, 211)",
                  transform: "rotate(-4deg)",
                  lineHeight: "8rem",
                  margin: 0,
                }}
              >
                a
              </p>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontFamily: "'Amarante', cursive",
            }}
          >
            Pure soul is the preserver of true karate<i>&nbsp;</i>
          </p>
          <div
            style={{
              zIndex: 1,
              height: "250px",
              width: "250px",
              position: "absolute",
              filter: "sepia(20%) opacity(80%)",
              transform: "scaleX(-1) translate(25%, 150%)",
              transition: "300ms",
            }}
          >
            <Image
              src="/assets/bird.png"
              alt=""
              height={1440}
              width={1440}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "contain",
                userSelect: "none",
              }}
            />
          </div>
        </section>

        <section
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            transition: "300ms",
          }}
        >
          {windowWidth <= 400 ? (
            <div
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
                  width: "fit-content",
                }}
              >
                <p
                  style={{
                    width: "130px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    fontFamily: "'GFS Neohellenic', sans-serif",
                    transition: "200ms",
                    margin: 0,
                  }}
                >
                  DISCIPLINE
                </p>
                <div
                  style={{
                    width: "2px",
                    height: "50px",
                    transform: "translateY(20%)",
                    background: "linear-gradient(#403D3C, transparent)",
                    transition: "200ms",
                  }}
                ></div>
                <p
                  style={{
                    width: "130px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    fontFamily: "'GFS Neohellenic', sans-serif",
                    transition: "200ms",
                    margin: 0,
                  }}
                >
                  RESPECT
                </p>
                <div
                  style={{
                    width: "2px",
                    height: "50px",
                    transform: "translateY(20%)",
                    background: "linear-gradient(#403D3C, transparent)",
                    transition: "200ms",
                  }}
                ></div>
                <p
                  style={{
                    width: "130px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    fontFamily: "'GFS Neohellenic', sans-serif",
                    transition: "200ms",
                    margin: 0,
                  }}
                >
                  TECHNIQUE
                </p>
              </div>
            </div>
          ) : (
            <div
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
                  width: "fit-content",
                }}
              >
                <p
                  style={{
                    width: "130px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    fontFamily: "'GFS Neohellenic', sans-serif",
                    transition: "200ms",
                    margin: 0,
                  }}
                >
                  Discipline
                </p>
                <div
                  style={{
                    width: "2px",
                    height: "50px",
                    transform: "translateY(20%)",
                    background: "linear-gradient(#403D3C, transparent)",
                    transition: "200ms",
                  }}
                ></div>
                <p
                  style={{
                    width: "130px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    fontFamily: "'GFS Neohellenic', sans-serif",
                    transition: "200ms",
                    margin: 0,
                  }}
                >
                  Respect
                </p>
                <div
                  style={{
                    width: "2px",
                    height: "50px",
                    transform: "translateY(20%)",
                    background: "linear-gradient(#403D3C, transparent)",
                    transition: "200ms",
                  }}
                ></div>
                <p
                  style={{
                    width: "130px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    fontFamily: "'GFS Neohellenic', sans-serif",
                    transition: "200ms",
                    margin: 0,
                  }}
                >
                  Technique
                </p>
              </div>
            </div>
          )}

          <div
            style={{
              zIndex: 1,
              width: "250px",
              right: "0%",
              position: "absolute",
              filter: "sepia(100%) opacity(65%)",
              transform: "translateY(-30%)",
              transition: "300ms",
            }}
          >
            <Image
              src="/assets/dragonx.png"
              alt=""
              height={1440}
              width={1440}
              style={{
                width: "100%",
                height: "340px",
                objectFit: "contain",
                userSelect: "none",
              }}
            />
          </div>

          <div
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
                margin: "0.5rem 0 0.5rem 0",
                color: "#262626da",
                fontSize: "4rem",
                lineHeight: "3rem",
                wordSpacing: "5px",
                letterSpacing: "4px",
                fontFamily: "'Tenali Ramakrishna', sans-serif",
                width: "100%",
                textAlign: "center",
                transition: "200ms",
              }}
            >
              THE SHUBUKAN WAY
            </h1>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "fit-content",
              }}
            >
              <p
                style={{
                  width: "260px",
                  fontSize: "1.5rem",
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
                  width: "2px",
                  height: "50px",
                  transform: "translateY(20%)",
                  background: "linear-gradient(#403D3C, transparent)",
                  transition: "200ms",
                }}
              ></div>
              <p
                style={{
                  width: "260px",
                  fontSize: "1.5rem",
                  textAlign: "center",
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
                fontSize: "1.5rem",
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
              trying to educate ourselves through the journey of Okinawan
              karate.
            </p>
            <div
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
            style={{
              zIndex: 1,
              width: "250px",
              left: "0%",
              position: "absolute",
              filter: "sepia(100%) opacity(65%)",
              transform: "translateY(70%)",
              transition: "200ms",
            }}
          >
            <Image
              src="/assets/dragony.png"
              alt=""
              height={1440}
              width={1440}
              style={{
                width: "100%",
                height: "385px",
                objectFit: "contain",
                userSelect: "none",
              }}
            />
          </div>
        </section>

        {imgClicked && (
          <div
            style={{
              zIndex: 10,
              position: "absolute",
            }}
          >
            <div
              onClick={imgPop}
              style={{
                position: "fixed",
                height: "100vh",
                width: "100vw",
                top: 0,
                right: 0,
                backdropFilter: "blur(3px)",
              }}
            ></div>
            <div
              onClick={imgPop}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80vw",
                height: "80vh",
                marginBottom: "1rem",
                display: "flex",
                overflow: "hidden",
                borderRadius: "8px",
                transition: "300ms",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={popImg}
                alt="image"
                height={1440}
                width={1440}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  filter: "sepia(10%) grayscale(10%)",
                  display: "block",
                  backgroundSize: "cover",
                  userSelect: "none",
                }}
              />
            </div>
          </div>
        )}

        <section
          style={{
            margin: "5rem 0 2rem 0",
            columnCount: 4,
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "2px",
              margin: "0 0 3.5rem",
              fontSize: "28px",
              fontFamily: "'Tenali Ramakrishna', sans-serif",
              color: "rgba(125, 103, 97, 0.808)",
              background:
                "linear-gradient(-90deg, transparent 0%, rgba(88, 78, 78, 0.514) 100%)",
              transition: "300ms",
            }}
          >
            <div onClick={() => navigate("/gallery")}>
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
              onClick={() => imgPop("/web_images/shureimon_gate_low.jpg")}
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
            >
              <Image
                src="/web_images/shureimon_gate_high.jpg"
                alt="shureimon gate"
                height={720}
                width={720}
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
              />
            </div>
            <div
              onClick={() => imgPop("/web_images/chibana_high.jpg")}
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
            >
              <Image
                src="/web_images/chibana_high.jpg"
                alt="image"
                height={720}
                width={720}
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
              />
            </div>
            <div
              onClick={() => imgPop("/web_images/Matsumura_high.png")}
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
            >
              <Image
                src="/web_images/Matsumura_low.jpg"
                alt="image"
                height={720}
                width={720}
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
              />
            </div>
            <div
              onClick={() => imgPop("/web_images/uema_family_high.jpg")}
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
            >
              <Image
                src="/web_images/uema_family_low.jpg"
                alt="image"
                height={720}
                width={720}
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
              />
            </div>
            <div
              onClick={() => imgPop("/web_images/oldGroup.jpg")}
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
            >
              <Image
                src="/web_images/oldGroup.jpg"
                alt="image"
                height={720}
                width={720}
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
              />
            </div>
            <div
              onClick={() => imgPop("/web_images/joki_sai_high.jpg")}
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
            >
              <Image
                src="/web_images/joki_sai_high.jpg"
                alt="image"
                height={720}
                width={720}
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
              />
            </div>
            <div
              onClick={() => imgPop("/web_images/kaynChotuku_high.png")}
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
            >
              <Image
                src="/web_images/kaynChotuku_high.png"
                alt="image"
                height={720}
                width={720}
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
              />
            </div>
          </div>
        </section>

        <section
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
            style={{
              margin: "3rem 0",
              height: "2px",
              width: "80%",
              background:
                "radial-gradient(circle, #905043 0%, transparent 100%)",
              opacity: 0.5,
              transition: "1000ms",
            }}
          ></div>

          <div
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
                  width: "150px",
                  letterSpacing: "4px",
                  fontSize: "1.8rem",
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
                  width: "150px",
                  letterSpacing: "4px",
                  fontSize: "1.8rem",
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
                  width: "150px",
                  letterSpacing: "4px",
                  fontSize: "1.8rem",
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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "50px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#4b423b",
                    fontSize: "1.5rem",
                    fontFamily: "'Bellefair', serif",
                    margin: 0,
                  }}
                >
                  When you block overall, imagine you are attacking. When
                  someone punches you, you don't move to evade the punch, but
                  rather to break the arm.
                </p>
                <p
                  style={{
                    fontStyle: "italic",
                    fontSize: "1.3rem",
                    margin: 0,
                    color: "#4b423b",
                    fontFamily: "'Bellefair', serif",
                  }}
                >
                  Sensei Takeshi Uema
                </p>
                <p
                  style={{
                    fontStyle: "italic",
                    fontSize: "1.3rem",
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
                alt=""
                height={1440}
                width={1440}
                style={{
                  marginTop: "30px",
                  width: "150px",
                  height: "180px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  filter: "sepia(30%) grayscale(30%)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "50px",
              }}
            >
              <Image
                src="/assets/quot (2).jpg"
                alt=""
                height={1440}
                width={1440}
                style={{
                  marginTop: "60px",
                  width: "150px",
                  height: "180px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  filter: "sepia(30%) grayscale(30%)",
                }}
              />

              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <p
                  style={{
                    color: "#4b423b",
                    fontSize: "1.5rem",
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
                  style={{
                    fontStyle: "italic",
                    fontSize: "1.3rem",
                    margin: 0,
                    color: "#4b423b",
                    fontFamily: "'Bellefair', serif",
                    textAlign: "right",
                  }}
                >
                  Sensei Yasuhiro Uema
                </p>
                <p
                  style={{
                    fontStyle: "italic",
                    fontSize: "1.3rem",
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
            style={{
              margin: "3rem 0",
              height: "2px",
              width: "80%",
              background:
                "radial-gradient(circle, #905043 0%, transparent 100%)",
              opacity: 0.5,
              transition: "1000ms",
            }}
          ></div>

          <div>
            <p
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
              style={{
                color: "#4b423b",
                fontFamily: "'Bellefair', serif",
                fontStyle: "italic",
                fontSize: "1.3rem",
                margin: 0,
              }}
            >
              Sensei Sabyasachi
            </p>
          </div>

          <div
            style={{
              width: "100%",
              height: "284px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Image
              src="/assets/sg1.jpg"
              alt=""
              height={1440}
              width={1440}
              style={{
                width: "250px",
                height: "284px",
                objectFit: "contain",
                borderRadius: "10px",
                filter: "sepia(30%) grayscale(30%)",
              }}
            />
            <Image
              src="/assets/sg2.jpg"
              alt=""
              height={1440}
              width={1440}
              style={{
                width: "250px",
                height: "284px",
                objectFit: "contain",
                borderRadius: "10px",
                filter: "sepia(30%) grayscale(30%)",
              }}
            />
          </div>

          <p
            style={{
              margin: "2rem 0",
              color: "#4b423b",
              fontSize: "1.5rem",
              fontFamily: "'Bellefair', serif",
            }}
          >
            Karate as a martial art is about self-defense. Overcoming your own
            weaknesses, never bending in any circumstance, it is about
            developing an unshakable spirit. In karate what is important is to
            cultivate the strength to concentrate your spirit on one thing with
            heart and soul.
          </p>

          <p
            style={{
              marginBottom: "5rem",
              color: "#4b423b",
              fontSize: "1.5rem",
              fontFamily: "'Bellefair', serif",
              textAlign: "right",
            }}
          >
            Empty-handed and carrying no weapon, dominating an adversary with
            body and soul only, karate, a martial art of self-defense. To master
            the way, a long and arduous journey awaits.
          </p>
        </section>
      </div>

      {/* ================================= */}

      <div
        style={{
          zIndex: 1,
          position: "relative",
          height: "fit-content",
          bottom: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundImage:
            'url("https://res.cloudinary.com/daspiwjet/image/upload/v1742818161/Shubukan/Assets/iksgnmlpeljd7mugtrba.jpg")',
          backgroundSize: "250px 250px",
          paddingTop: "50px",
        }}
      >
        <Image
          style={{
            zIndex: 0,
            height: "auto",
            position: "absolute",
            left: 0,
            width: "450px",
            top: "-240px",
            transition: "300ms",
          }}
          src="/footer-hill-l.png"
          width={1440}
          height={1440}
          quality={100}
          priority={true}
          sizes="(min-width: 1320px) 450px, (min-width: 820px) 400px, (min-width: 680px) 330px, (min-width: 580px) 290px, (min-width: 480px) 250px, (min-width: 380px) 220px, calc(16.67vw + 130px)"
          alt=""
        />
        <Image
          style={{
            zIndex: 0,
            height: "auto",
            position: "absolute",
            right: 0,
            transform: "scaleX(-1)",
            width: "450px",
            top: "-265px",
            transition: "300ms",
          }}
          src="/footer-hill-r.png"
          width={1440}
          height={1440}
          quality={100}
          priority={true}
          sizes="(min-width: 1320px) 450px, (min-width: 820px) 400px, (min-width: 680px) 330px, (min-width: 580px) 290px, (min-width: 480px) 250px, (min-width: 380px) 220px, calc(16.67vw + 130px)"
          alt=""
        />

        <div
          id="cloud-circle"
          style={{
            zIndex: -1,
            width: "200vw",
            height: "50%",
            borderRadius: "0%",
            filter: "url(#filter)",
            boxShadow: "-100px -235px 150px 50px #000000",
            background: "#000000",
            position: "absolute",
            bottom: "0px",
            left: "-20px",
          }}
        ></div>

        <svg width="0" height="0">
          <filter id="filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".01"
              numOctaves="10"
            />
            <feDisplacementMap in="SourceGraphic" scale="100" />
          </filter>
        </svg>

        <div
          style={{
            width: "80%",
            height: "10rem",
            margin: "60px 0 80px 0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            textDecoration: "none",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              width: "10rem",
              marginRight: "4rem",
              transition: "200ms",
            }}
          >
            <div
              onClick={() => navigate("/contributors")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Contributors
              </p>
            </div>
            <div
              onClick={() => navigate("/membership")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Membership
              </p>
            </div>
            <div
              onClick={() => navigate("/services")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Service
              </p>
            </div>
          </div>

          <div
            style={{
              height: "100%",
              width: "1px",
              background:
                "linear-gradient(0deg, rgba(235, 224, 214, 0) 0%, rgba(235, 224, 214, 1) 90%, rgba(235, 224, 214, 0) 100%)",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 4rem",
              transition: "200ms",
            }}
          >
            <div
              onClick={() => navigate("/blog")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Blog
              </p>
            </div>
            <div
              onClick={() => navigate("/marksheet")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Marksheet
              </p>
            </div>
            <div
              onClick={() => navigate("/registration")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Registration
              </p>
            </div>
          </div>

          <div
            style={{
              height: "100%",
              width: "1px",
              background:
                "linear-gradient(0deg, rgba(235, 224, 214, 0) 0%, rgba(235, 224, 214, 1) 90%, rgba(235, 224, 214, 0) 100%)",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "10rem",
              marginLeft: "4rem",
              transition: "200ms",
              textDecoration: "none",
            }}
          >
            <div
              onClick={() => navigate("/term-and-condition")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Terms & Conditions
              </p>
            </div>
            <div
              onClick={() => navigate("/help-and-faqs")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Help and FAQ
              </p>
            </div>
            <div
              onClick={() => navigate("/contact")}
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  lineHeight: "20px",
                  margin: "7px 0",
                  color: "#ebe0d6",
                  fontFamily: "Tenali Ramakrishna, sans-serif",
                  userSelect: "none",
                }}
              >
                Contact Us
              </p>
            </div>
          </div>
        </div>

        <div style={{}}></div>

        <div
          style={{
            height: "12rem",
            width: "80%",
            marginBottom: "2rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "2rem",
            transition: "300ms",
          }}
        >
          <Image
            height={1440}
            width={1440}
            quality={100}
            priority={true}
            sizes="(min-width: 820px) 192px, (min-width: 720px) 160px, (min-width: 620px) 144px, (min-width: 520px) 128px, (min-width: 380px) calc(6.67vw + 79px), 80px"
            src="/assets/shubukanIndia-white.png"
            alt=""
            style={{
              height: "100%",
              width: "auto",
              userSelect: "none",
              display: "block",
              backgroundSize: "contain",
              transition: "200ms",
              filter: "invert(10%) grayscale(40%) sepia(40%)",
              zIndex: 1,
            }}
          />
          <Image
            height={1440}
            width={1440}
            quality={100}
            priority={true}
            src="/assets/shorinryu.svg"
            alt=""
            style={{
              height: "100%",
              width: "auto",
              userSelect: "none",
              display: "block",
              backgroundSize: "contain",
              transition: "200ms",
              filter: "invert(90%) grayscale(50%) sepia(50%)",
              zIndex: 1,
            }}
          />
          <Image
            height={1440}
            width={1440}
            quality={100}
            priority={true}
            src="/assets/shubukan.svg"
            alt=""
            style={{
              height: "100%",
              width: "auto",
              userSelect: "none",
              display: "block",
              backgroundSize: "contain",
              transition: "200ms",
              filter: "invert(90%) grayscale(50%) sepia(50%)",
              zIndex: 1,
            }}
          />
          <Image
            height={1440}
            width={1440}
            quality={100}
            priority={true}
            src="/assets/kobudo.svg"
            alt=""
            style={{
              height: "100%",
              width: "auto",
              userSelect: "none",
              display: "block",
              backgroundSize: "contain",
              transition: "200ms",
              filter: "invert(90%) grayscale(50%) sepia(50%)",
              zIndex: 1,
            }}
          />
          <Image
            height={1440}
            width={1440}
            quality={100}
            priority={true}
            sizes="(min-width: 820px) 192px, (min-width: 720px) 160px, (min-width: 620px) 144px, (min-width: 520px) 128px, (min-width: 380px) calc(6.67vw + 79px), 80px"
            src="/assets/Hozonkai-white.png"
            alt=""
            style={{
              height: "100%",
              width: "auto",
              userSelect: "none",
              display: "block",
              backgroundSize: "contain",
              transition: "200ms",
              filter: "invert(10%) grayscale(40%) sepia(40%)",
              zIndex: 1,
            }}
          />
        </div>

        <div
          style={{
            height: "1px",
            width: "100%",
            margin: "1rem 0",
            background:
              "radial-gradient(circle, #ebe0d6 20%, transparent 100%)",
          }}
        ></div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "25px",
          }}
        >
          <p
            style={{
              margin: "0 1rem 1rem",
              fontSize: ".8rem",
              fontFamily: "Arial, Helvetica, sans-serif",
              color: "#ebe0d6",
              userSelect: "none",
            }}
          >
            © 2023 Shubukan India
          </p>
        </div>
      </div>
    </>
  );
}
