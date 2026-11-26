// components/Navbar.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSound from "use-sound";
import Image from "next/image";
import "./Navbar.scss";
import { useUI } from "../Context/UIContext";
import PaintedCloud from "@/components/UIComponent/PaintedCloud/PaintedCloud";
import { lockScroll, unlockScroll } from "@/utils/scrollLock";
import { Philosopher, Geo } from "next/font/google";

const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-philosopher",
});

const geo = Geo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-geo",
});

export default function Navbar() {
  const { isModalOpen } = useUI();
  return isModalOpen ? null : <SiteNavbar />;
}

function SiteNavbar() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const pathname = usePathname();

  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  // Keeps the menu in the DOM through its close animation. isMenu drives the
  // open/closing CSS state; menuRender keeps it mounted for the ~400ms the
  // exit animation needs before it's actually removed.
  const [menuRender, setMenuRender] = useState(false);
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
  const isGuardianFormPage = pathname.startsWith("/guardian-evaluation/form/");
  const isFixedHeader = !isAdminPage && !isExamPage && !isGuardianFormPage;
  const headerHidden = isFixedHeader && !isMenu && !menuRender && isScrollHidden;

  useEffect(() => {
    setIsScrollHidden(false);
    if (!isFixedHeader || menuRender) return;

    let lastY = window.scrollY;
    let wasHidden = false;

    function handleScroll() {
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.max(0, Math.min(window.scrollY, maxY));
      if (y > 24 && Math.abs(y - lastY) < 8) return;

      const shouldHide = y > 24 && y > lastY;
      lastY = y;
      if (shouldHide !== wasHidden) {
        wasHidden = shouldHide;
        setIsScrollHidden(shouldHide);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isFixedHeader, menuRender]);

  // Mount immediately on open; delay unmount until the close animation finishes.
  useEffect(() => {
    if (isMenu) {
      setMenuRender(true);
      return;
    }
    const t = setTimeout(() => setMenuRender(false), 400);
    return () => clearTimeout(t);
  }, [isMenu]);

  // Lock background scroll while the menu is open. scrollLock measures and
  // compensates the scrollbar's width so the page doesn't shift — and
  // measures 0 on mobile / overlay-scrollbar devices, so no shift there
  // either (which the static `scrollbar-gutter: stable` approach got wrong).
  useEffect(() => {
    if (!isMenu) return;
    lockScroll();
    return () => unlockScroll();
  }, [isMenu]);

  const pageList = [
    { id: 1, path: "/history", label: "HISTORY" },
    { id: 2, path: "/shubukan-india", label: "SHUBUKAN INDIA" },
    { id: 3, path: "/shubukan-okinawa", label: "SHUBUKAN OKINAWA" },
    { id: 4, path: "/shubukan-world", label: "SHUBUKAN WORLD" },
    { id: 5, line: true },
    {
      id: 6,
      path: "/shuri-karate-kobudo-hozonkai",
      label: "SHURI KARATE KOBUDO HOZONKAI",
    },
    { id: 7, path: "/lineage-and-dojokun", label: "LINEAGE & DOJO KUN" },
    { id: 8, path: "/karate-and-kobudo", label: "KARATE & KOBUDO" },
    // { path: "/registration", label: "REGISTRATION" },
    { id: 10, path: "/dojo-listicle", label: "DOJO LISTICLE" },
    { id: 12, line: true },
    { id: 13, path: "/online-exam", label: "EXAM PORTAL" },
    { id: 14, path: "/guardian-evaluation", label: "GUARDIAN EVALUATION" },
    { id: 15, line: true },
    { id: 16, path: "/gallery", label: "GALLERY" },
    { id: 17, path: "/journal", label: "JOURNAL" },
    { id: 18, path: "/contact", label: "CONTACT" },
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
    "/dojo-listicle": "",
    "/online-exam": "",
    "/gallery": "",
    "/journal": "",
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
  //   '/india-listicle': 'India Dojo',
  //   '/registration': 'Registration',
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
          },
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
          },
    );
  }

  return !isAdminPage && !isExamPage ? (
    <div
      id="Navbar"
      className={isGuardianFormPage ? "navbar--in-flow" : undefined}
      data-scroll-hidden={headerHidden || undefined}
      inert={headerHidden || undefined}
    >
      <div className="navbar-clouds" aria-hidden="true">
        <PaintedCloud small layer="header-left-rear" className="navbar-cloud navbar-cloud--left navbar-cloud--rear" />
        <PaintedCloud small layer="header-right-rear" className="navbar-cloud navbar-cloud--right navbar-cloud--rear" />
        <PaintedCloud layer="header-left-large" className="navbar-cloud navbar-cloud--left" />
        <PaintedCloud layer="header-right-large" className="navbar-cloud navbar-cloud--right" />
        <PaintedCloud small layer="header-left-front" className="navbar-cloud navbar-cloud--left navbar-cloud--front" />
        <PaintedCloud small layer="header-right-front" className="navbar-cloud navbar-cloud--right navbar-cloud--front" />
      </div>

      {/* <div className="Cloud-light sm:top-[-50px] top-[-10px] sm:left-[-50px] left-[-30px] sm:w-[50%] w-[60%] sm:h-full h-[80%] rounded-br-[100%] sm:blur-[100px] blur-[20px]"></div>
      <div className="Cloud-light sm:top-[-50px] top-[-10px] sm:right-[-50px] right-[-30px] sm:w-[40%] w-[50%] sm:h-full h-[80%] rounded-bl-[100%] sm:blur-[100px] blur-[20px]"></div> */}

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

      <section
        className="menu"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
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
          >
            <div className="line-border"></div>
          </div>
          <p
            className={`${geo.className} `}
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
          >
            <div className="line-border"></div>
          </div>
        </div>

        {menuRender && (
          <div className={`menu-overlay ${isMenu ? "is-open" : "is-closing"}`}>
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
                {pageList.map(({ id, path, label, line }) => (
                  <div
                    key={id}
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
                    {line ? (
                      <div className="nav-line">
                        <div className="nav-line-in"></div>
                      </div>
                    ) : (
                      <p className={`${philosopher.className}`}>{label}</p>
                    )}
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
          </div>
        )}
      </section>
    </div>
  ) : null;
}
