"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSound from "use-sound";
import Image from "next/image";
import "./Navbar.scss";
import { useUI } from "../Context/UIContext";
import { Philosopher } from "next/font/google";

const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-philosopher",
});

export default function Navbar() {
  const { isModalOpen } = useUI();

  if (isModalOpen) return null;

  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const pathname = usePathname();
  const [position, setPosition] = useState({ top: "0rem" });
  const [lastScrollTop, setLastScrollTop] = useState(Infinity);

  const [isMenu, setIsMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState({
    zIndex: 4,
    width: "8rem",
    margin: "1.5rem 0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    userSelect: "none",
  });

  // Add state to track which logo is currently visible
  const [showFirstLogo, setShowFirstLogo] = useState(true);
  const [animDelay, setAnimDelay] = useState(3000);
  const [currentPage, setCurrentPage] = useState("");

  const isAdminPage = pathname.startsWith("/admin");
  const isExamPage = pathname.startsWith("/online-exam");
  
  const pageList = [
    { path: "/history", label: "HISTORY" },
    { path: "/shubukan-india", label: "SHUBUKAN INDIA" },
    { path: "/shubukan-okinawa", label: "SHUBUKAN OKINAWA" },
    { path: "/shubukan-world", label: "SHUBUKAN WORLD" },
    {
      path: "/shuri-karate-kobudo-hozonkai",
      label: "SHURI KARATE KOBUDO HOZONKAI",
    },
    { path: "/lineage-and-dojokun", label: "LINEAGE & DOJO KUN" },
    { path: "/karate-and-kobudo", label: "KARATE & KOBUDO" },
    // { path: "/registration", label: "REGISTRATION" },
    { path: "/online-exam", label: "EXAM PORTAL" },
    { path: "/membership", label: "MEMBERSHIP" },
    { path: "/gallery", label: "GALLERY" },
    // { path: "/blog", label: "BLOG" },
    { path: "/blogpost/from-fist-to-force-karate-tsuki-punch", label: "BLOG" },
    { path: "/contact", label: "CONTACT" },
  ];

  // ******************************
  // ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
  // ******************************
  // This whole thing is was made to show page tile on navbar in the place of logo
  // Thats why in pathToTitle object there is "/blog": "Blog",
  // If I keep the value empty then the title wont be shown at the place of logo
  // ******************************
  // ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
  // ******************************

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
    // "/registration": "",
    "/online-exam": "",
    "/membership": "",
    "/gallery": "",
    "/blog": "",
    "/blogpost/from-fist-to-force-karate-tsuki-punch": "",
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

  useEffect(() => {
    // Clean up the pathname to handle potential trailing slashes
    const path =
      pathname.endsWith("/") && pathname !== "/"
        ? pathname.slice(0, -1)
        : pathname;

    // Set the current page based on the exact path match
    setCurrentPage(pathToTitle[path] || "");
  }, [pathname]);

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
  const [play] = useSound("");
  const [play2] = useSound("", { volume: 0.01 });
  // const [play] = useSound("/audio/ui-click.mp3");
  // const [play2] = useSound("/audio/light-switch.mp3", { volume: 0.01 });

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

  return !isAdminPage && !isExamPage ? (
    <div
      id="Navbar"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        ...position,
      }}
    >
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
              src="/assets/indiashubukan.png"
              alt="Shubukan Logo"
              height={1440}
              width={1440}
              quality={100}
              // sizes="(min-width: 1180px) 80px, 64px"
            />
            <Image
              className="logo2"
              src="/assets/logo.png"
              alt="Shubukan Text"
              height={1440}
              width={1440}
              quality={100}
              // sizes="(min-width: 1180px) 142px, 85px"
            />
          </>
        ) : (
          <p className="heading sm:h-fit h-[70px] sm:text-[60px] text-[40px]">
            {currentPage}
          </p>
        )}
      </div>

      <div
        id="cloud-circle"
        style={{
          zIndex: -1,
          width: "200vw",
          height: "75%",
          borderRadius: "0%",
          filter: "url(#filter)",
          boxShadow: "0px 8px 20px 10pxx #fff",
          background: "#fff",
          position: "absolute",
          top: "-25px",
          left: "-180px",
        }}
      ></div>
      <svg width="0" height="0">
        <filter id="filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".01"
            numOctaves="10"
            seed={8}
          />
          <feDisplacementMap in="SourceGraphic" scale="60" />
        </filter>
      </svg>

      <section
        className="menu"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: "200ms",
        }}
      >
        <div className="menuStart" style={menuStyle} onClick={lineFunc}>
          <div
            className="lines"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(42, 32, 28, 1) 100%)",
              transition: "200ms",
              userSelect: "none",
            }}
          ></div>
          <p
            style={{
              margin: "0 10px 0 0",
              textAlign: "right",
              color: "rgba(42, 32, 28, 1)",
              letterSpacing: "5px",
              fontFamily: "'Geo2', sans-serif",
              transition: "200ms",
              userSelect: "none",
            }}
          >
            MENU
          </p>
          <div
            className="lines"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(42, 32, 28, 1) 100%)",
              transition: "200ms",
              userSelect: "none",
            }}
          ></div>
        </div>

        {isMenu && (
          <>
            {/* <div className="menuBG"></div> */}
            <div className="menuBG2"></div>
            <div className="menuBG3" onClick={showMenu}></div>
            <svg>
              <filter id="grainy-noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.8"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImage"
                  mode="multiply"
                />
              </filter>
            </svg>

            <div className="menuBox">
              <nav className="nav">
                {pageList.map(({ path, label }) => (
                  <div
                    key={path}
                    onClick={() => {
                      showMenu();
                      navigate(path);
                    }}
                    style={{
                      textShadow: `${
                        pathname === path
                          ? "0 0 15px #DE3614 !important"
                          : "0 0 15px rgb(163, 150, 140)"
                      }`,
                    }}
                    className={`opt ${
                      pathname === path ? "!text-[#DE3614]" : "!text-[#242323]"
                    }`}
                    onMouseEnter={play2}
                  >
                    <p className={`${philosopher.className}`}>{label}</p>
                  </div>
                ))}
              </nav>
            </div>
            {/* 
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
            </svg> */}
          </>
        )}
      </section>
    </div>
  ) : null;
}
