import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.scss";

import logo1 from "../../assets/shubukanIndia.png";
import logo2 from "../../assets/shorinryu.svg";
import logo3 from "../../assets/shubukan.svg";
import logo4 from "../../assets/kobudo.svg";
import logo5 from "../../assets/Hozonkai-Logo.svg";

export default function Footer() {
  function news(event) {
    event.preventDefault();
  }

  return (
    <div className="Footer">
      {/* <div className="footSub">
        <h1>Subscribe to our newsletter</h1>

        <form action="">
          <input type="email" />
          <button onClick={news}>&#10230;</button>
        </form>

        <div className="underLine"></div>
      </div> */}

      <div id="cloud-circle"></div>
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

      <div className="footContent">
        <div className="footOptions1">
          <NavLink to="/contributor" className="opt">
            <p>Contributors</p>
          </NavLink>
          <NavLink to="/membership" className="opt">
            <p>Membership</p>
          </NavLink>
          <NavLink to="/services" className="opt">
            <p>Service</p>
          </NavLink>
        </div>

        <div className="midLine"></div>

        <div className="footOptions2">
          <NavLink to="/blog" className="opt">
            <p>Blog</p>
          </NavLink>
          <NavLink to="/marksheet" className="opt">
            <p>Marksheet</p>
          </NavLink>
          <NavLink to="/registration" className="opt">
            <p>Registration</p>
          </NavLink>
          {/* <NavLink to="/download" className="opt">
            <p>Downloads</p>
          </NavLink> */}
        </div>

        <div className="midLine"></div>

        <div className="footOptions3">
          <NavLink to="/term-and-condition" className="opt">
            <p>Terms & Conditions</p>
          </NavLink>
          <NavLink to="/help-and-faqs" className="opt">
            <p>Help and FAQ</p>
          </NavLink>
          <NavLink to="/contact" className="opt">
            <p>Contact Us</p>
          </NavLink>
        </div>
      </div>

      <div className="footSocial"></div>

      <div className="footLogo">
        <img src={logo1} alt="" />
        <img src={logo2} alt="" />
        <img src={logo3} alt="" />
        <img src={logo4} alt="" />
        <img src={logo5} alt="" />
      </div>

      <div className="footLine"></div>

      <div className="footExtra">
        <p>© 2023 Shubukan India</p>
      </div>
    </div>
  );
}
