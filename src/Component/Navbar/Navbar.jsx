import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import oldPaper from "../../assets/old-paper.svg";
import shubukanLogo from "../../assets/shubukan.png";
import shubukanText from "../../assets/logo.png";
// import oldPaper from '../../../public/oldPaper.svg'
import useSound from "use-sound";
import audio from "../../Music/ui-click.mp3";
import audio2 from "../../Music/light-switch.mp3";

import "./Navbar.scss";

export default function Navbar() {
  const [position, setPosition] = useState({ top: "0rem" });
  const [lastScrollTop, setLastScrollTop] = useState(Infinity);

  const [isMenu, setIsMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  // This Variable will store the top position

  window.addEventListener("scroll", function () {
    //on every scroll this function will be called

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //This line will get the location on scroll

    if (scrollTop > lastScrollTop) {
      //if it will be greater than the previous
      setPosition({ top: "-10rem" });
      //set the value to the negative of height of navbar
    } else {
      setPosition({ top: "0rem" });
    }

    setLastScrollTop(scrollTop); //New Position Stored
  });

  function showMenu() {
    if (isMenu == true) {
      setIsMenu(false);
      setMenuStyle({});
    } else if (isMenu == false) {
      setIsMenu(true);
      setMenuStyle({
        position: "fixed",
        top: "0",
        right: "0",
      });
    }
  }

  const [play] = useSound(audio)
  const [play2] = useSound(audio2, { volume: 0.01 })
  function lineFunc() {
    play()
    if (isMenu == true) {
      setIsMenu(false);
      setMenuStyle({});
    } else if (isMenu == false) {
      setIsMenu(true);
      setMenuStyle({
        position: "fixed",
        top: "0",
        right: "0",
      });
    }
  }

  return (
    <div id="Navbar" style={position}>
      <NavLink
        to="/"
        className="logo"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {/* <Spline scene="https://prod.spline.design/IRCi38KJr6aI3aIN/scene.splinecode" /> */}
        <img className="logo1" src={shubukanLogo} />
        <img className="logo2" src={shubukanText} />
      </NavLink>

      <section className="menu">
        <div className="menuStart" style={menuStyle} onClick={lineFunc}>
          <div className="lines"></div>
          <p>MENU</p>
          <div className="lines"></div>
        </div>

        {isMenu && (
          <>
            <div className="menuBG" onClick={showMenu}></div>
            {/* menu is forced to be hidden but it's css is not be hidden, so when it appears, it appears with transition, but when it get killed, it killed immediately, so there is no end transition */}
            <div
              className="menuBox"
              style={{ backgroundImage: `url(${oldPaper})` }}
            >
              {/* <img src="oldpaper.png" alt="" /> */}
              <nav className="nav">
                <NavLink to="/history" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>HISTORY</p>
                </NavLink>
                <NavLink to="/shubukan-india" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>SHUBUKAN INDIA</p>
                </NavLink>
                <NavLink to="/shubukan-okinawa" className="opt" onMouseEnter={play2} onClick={showMenu} >
                  <p>SHUBUKAN OKINAWA</p>
                </NavLink>
                <NavLink to="/shubukan-world" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>SHUBUKAN WORLD</p>
                </NavLink>
                <NavLink to="/shuri-karate-kobudo-hozonkai" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>SHURI KARATE KOBUDO HOZONKAI</p>
                </NavLink>

                <NavLink to="/lineage-and-dojokun" className="opt" onMouseEnter={play2} onClick={showMenu} >
                  <p>LINEAGE & DOJO KUN</p>
                </NavLink>
                <NavLink to="/karate-and-kobudo" className="opt" onMouseEnter={play2} onClick={showMenu} >
                  <p>KARATE & KOBUDO</p>
                </NavLink>

                {/* <NavLink to="/CalenderAndNotice" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>CALENDER & NOTICE</p>
                </NavLink> */}
                <NavLink to="/membership" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>MEMBERSHIP</p>
                </NavLink>
                <NavLink to="/services" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>SERVICES</p>
                </NavLink>
                <NavLink to="/gallery" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>GALLERY</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>BLOG</p>
                </NavLink>
                <NavLink to="/contact" className="opt" onMouseEnter={play2} onClick={showMenu}>
                  <p>CONTACT</p>
                </NavLink>
              </nav>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
