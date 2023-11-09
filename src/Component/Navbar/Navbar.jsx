import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import oldPaper from "../../assets/old-paper.png";
import shubukanLogo from '../../assets/shubukan.png'
import shubukanText from '../../assets/logo.png'
// import oldPaper from '../../../public/oldPaper.svg'

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

  const [lineStyle, setLineStyle] = useState({
    width: "100px",
  });

  function lineFunc() {
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
    setLineStyle({ width: "150px" });
    setTimeout(() => {
      setLineStyle({ width: "100px" });
    }, 800);
  }

  return (
    <div id="Navbar" style={position}>
      <NavLink to="/" className="logo">
        {/* <Spline scene="https://prod.spline.design/IRCi38KJr6aI3aIN/scene.splinecode" /> */}
        <img className="logo1" src={shubukanLogo} />
        <img className="logo2" src={shubukanText} />
      </NavLink>

      <section className="menu">
        <div className="menuStart" onClick={lineFunc} style={menuStyle}>
          <div className="lines" style={lineStyle}></div>
          <div className="lines" style={lineStyle}></div>
        </div>

        {isMenu && (
          <>
            <div className="menuBG" onClick={showMenu}></div>
            <div
              className="menuBox"
              style={{ backgroundImage: `url(${oldPaper})` }}
            >
              {/* <img src="oldpaper.png" alt="" /> */}
              <nav className="nav">
                <NavLink to="/history" className="opt" onClick={showMenu}>
                  <p>HISTORY</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>SHUBUKAN INDIA</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>SHUBUKAN OKINAWA</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>SURI KARATE KOBUDO HOZONKAI</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>LINEAGE</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>DOJO KUN</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>KARATE</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>KOBUDO</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>BLOG</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>CALENDER & NOTICE</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>MEMBERSHIP</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>SERVICES</p>
                </NavLink>
                <NavLink to="/blog" className="opt" onClick={showMenu}>
                  <p>DOWNLOADS</p>
                </NavLink>
                <NavLink to="/" className="opt" onClick={showMenu}>
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
