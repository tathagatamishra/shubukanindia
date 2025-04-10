"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSound from "use-sound";
import Image from "next/image";
import "./Navbar.scss";

export default function Navbar() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const pathname = usePathname();
  const [position, setPosition] = useState({ top: "0rem" });
  const [lastScrollTop, setLastScrollTop] = useState(Infinity);

  const [isMenu, setIsMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  // Add state to track which logo is currently visible
  const [showFirstLogo, setShowFirstLogo] = useState(true);
  const [animDelay, setAnimDelay] = useState(3000);
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // Clean up the pathname to handle potential trailing slashes
    const path =
      pathname.endsWith("/") && pathname !== "/"
        ? pathname.slice(0, -1)
        : pathname;

    // Create a mapping of paths to page titles
    const pathToTitle = {
      "/": "",
      "/history": "",
      "/shubukan-india": "",
      "/shubukan-okinawa": "",
      "/shubukan-world": "",
      "/shuri-karate-kobudo-hozonkai": "",
      "/lineage-and-dojokun": "",
      "/karate-and-kobudo": "",
      "/registration": "",
      "/membership": "",
      "/gallery": "",
      "/blog": "Blog",
      "/about": "",
      "/contact": "",
    };
    // const pathToTitle = {
    //   '/': '',
    //   '/history': 'History',
    //   '/shubukan-india': 'Shubukan India',
    //   '/shubukan-okinawa': 'Shubukan Okinawa',
    //   '/shubukan-world': 'Shubukan World',
    //   '/shuri-karate-kobudo-hozonkai': 'Shuri Karate Kobudo Hozonkai',
    //   '/lineage-and-dojokun': 'Lineage and Dojo Kun',
    //   '/karate-and-kobudo': 'Karate and Kobudo',
    //   '/registration': 'Registration',
    //   '/membership': 'Membership',
    //   '/gallery': 'Gallery',
    //   '/blog': 'Blog',
    //   '/about': 'About',
    //   '/contact': 'Contact'
    // };

    // Set the current page based on the exact path match
    setCurrentPage(pathToTitle[path] || "");
  }, [pathname]);

  useEffect(() => {
    console.log("Current Path:", currentPage);
  }, [currentPage]);

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
  }, [lastScrollTop]);

  // Set up logo animation interval only when currentPage is not empty
  useEffect(() => {
    // Only set up the animation interval if we're not on the home page
    if (currentPage !== "") {
      // Toggle the logo immediately
      const toggleLogo = () => {
        setShowFirstLogo((prev) => !prev);
        // Update the delay for the next interval
        setAnimDelay((prev) => (prev === 6000 ? 3000 : 6000));
      };

      // Set up the first interval
      const intervalId = setTimeout(toggleLogo, animDelay);

      // Cleanup timeout on component unmount or when currentPage/animDelay changes
      return () => clearTimeout(intervalId);
    } else {
      // When on home page, always show the logo (no animation)
      setShowFirstLogo(true);
    }
  }, [currentPage, animDelay]); // Include animDelay in dependencies so it recreates the timer when delay changes

  useEffect(() => {
    console.log("delay:", animDelay);
  }, [animDelay]);

  useEffect(() => {
    console.log("delay:", animDelay);
  }, [animDelay]);

  function showMenu() {
    setIsMenu((prevIsMenu) => !prevIsMenu);
    setMenuStyle(() =>
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
        {/* Always show logo on home page, otherwise animate between logo and page title */}
        {currentPage === "" || showFirstLogo ? (
          <>
            <Image
              className="logo1"
              src="/assets/shubukan.png"
              alt="Shubukan Logo"
              height={720}
              width={720}
            />
            <Image
              className="logo2"
              src="/assets/logo.png"
              alt="Shubukan Text"
              height={720}
              width={720}
            />
          </>
        ) : (
          <p className="heading">{currentPage}</p>
        )}
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
                  style={{
                    textShadow: `${
                      pathname === "/history"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/history"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>HISTORY</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shubukan-india");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/shubukan-india"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/shubukan-india"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>SHUBUKAN INDIA</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shubukan-okinawa");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/shubukan-okinawa"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/shubukan-okinawa"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>SHUBUKAN OKINAWA</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shubukan-world");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/shubukan-world"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/shubukan-world"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>SHUBUKAN WORLD</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/shuri-karate-kobudo-hozonkai");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/shuri-karate-kobudo-hozonkai"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/shuri-karate-kobudo-hozonkai"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>SHURI KARATE KOBUDO HOZONKAI</p>
                </div>

                <div
                  onClick={() => {
                    showMenu();
                    navigate("/lineage-and-dojokun");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/lineage-and-dojokun"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/lineage-and-dojokun"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>LINEAGE & DOJO KUN</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/karate-and-kobudo");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/karate-and-kobudo"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/karate-and-kobudo"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>KARATE & KOBUDO</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/registration");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/registration"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/registration"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>REGISTRATION</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/membership");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/membership"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/membership"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>MEMBERSHIP</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/gallery");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/gallery"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/gallery"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>GALLERY</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/blog");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/blog"
                        ? "!text-[#DE3614]"
                        : "!text-[#242323]"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/blog" ? "!text-[#DE3614]" : "!text-[#242323]"
                  }`}
                  onMouseEnter={play2}
                >
                  <p>BLOG</p>
                </div>
                <div
                  onClick={() => {
                    showMenu();
                    navigate("/contact");
                  }}
                  style={{
                    textShadow: `${
                      pathname === "/contact"
                        ? "0 0 15px #DE3614 !important"
                        : "0 0 15px rgb(163, 150, 140)"
                    }`,
                  }}
                  className={`opt ${
                    pathname === "/contact"
                      ? "!text-[#DE3614]"
                      : "!text-[#242323]"
                  }`}
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
