"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSound from "use-sound";
import Image from "next/image";
import "./Navbar.scss";

export default function Navbar() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const [position, setPosition] = useState({ top: "0rem" });
  const [lastScrollTop, setLastScrollTop] = useState(Infinity);

  const [isMenu, setIsMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  // Handle scroll events with useEffect to avoid direct window event listeners
  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        setPosition({ top: "-10rem" });
      } else {
        setPosition({ top: "0rem" });
      }

      setLastScrollTop(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]); // Add lastScrollTop as dependency

  function showMenu() {
    setIsMenu((prevIsMenu) => !prevIsMenu);
    setMenuStyle((prevIsMenu) =>
      isMenu
        ? {}
        : {
            position: "fixed",
            top: "0",
            right: "0",
          }
    );
  }

  // Use the correct path for audio files in the public directory
  const [play] = useSound("/audio/ui-click.mp3");
  const [play2] = useSound("/audio/light-switch.mp3", { volume: 0.01 });

  function lineFunc() {
    play();
    setIsMenu((prevIsMenu) => !prevIsMenu);
    setMenuStyle((prevIsMenu) =>
      isMenu
        ? {}
        : {
            position: "fixed",
            top: "0",
            right: "0",
          }
    );
  }

  return (
    <div id="Navbar" style={position}>
      <div
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate("/");
        }}
        className="logo"
      >
        {/* Use Next.js Image component for better optimization or keep as regular img */}
        <Image className="logo1" src="/assets/shubukan.png" alt="Shubukan Logo" height={720} width={720} />
        <Image className="logo2" src="/assets/logo.png" alt="Shubukan Text" height={720} width={720} />
      </div>

      <div id="cloud-circle"></div>
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

      <section className="menu">
        <div className="menuStart" style={menuStyle} onClick={lineFunc}>
          <div className="lines"></div>
          <p>MENU</p>
          <div className="lines"></div>
        </div>

        {isMenu && (
          <>
            <div className="menuBG" onClick={showMenu}></div>
            <div className="menuBox">
              <nav className="nav">
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/history");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>HISTORY</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shubukan-india");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>SHUBUKAN INDIA</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shubukan-okinawa");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>SHUBUKAN OKINAWA</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shubukan-world");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>SHUBUKAN WORLD</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shuri-karate-kobudo-hozonkai");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>SHURI KARATE KOBUDO HOZONKAI</p>
                </div>

                <div
                  onClick={() => {
                    showMenu();
                    navigate("/lineage-and-dojokun");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>LINEAGE & DOJO KUN</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/karate-and-kobudo");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>KARATE & KOBUDO</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/registration");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>REGISTRATION</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/membership");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>MEMBERSHIP</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/gallery");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>GALLERY</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/blog");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>BLOG</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/contact");
                  }}
                  className="opt"
                  onMouseEnter={play2}
                >
                  <p>CONTACT</p>
                </div>
              </nav>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              height="0"
              width="0"
            >
              <defs>
                <filter id="wobble">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency=".06"
                    numOctaves="4"
                  />
                  <feDisplacementMap in="SourceGraphic" scale="6" />
                </filter>
              </defs>
            </svg>
          </>
        )}
      </section>
    </div>
  );
}
