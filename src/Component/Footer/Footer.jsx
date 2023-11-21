import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.scss";

import logo1 from "../../assets/shubukanIndia.png";
import logo2 from "../../assets/shorinryu.svg";
import logo3 from "../../assets/shubukan.svg";
import logo4 from "../../assets/kobudo.svg";
import logo5 from "../../assets/ShuriKarateKobudoHozonkai.png";

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

      <div className="footContent">
        <div className="footOptions1">
          <p>Contributors</p>
          <p>Membership</p>
          <p>Service</p>
        </div>
        <div className="midLine"></div>
        <div className="footOptions2">
          <p>Blog</p>
          <p>Downloads</p>
          <p>Calender & Notice</p>
        </div>
        <div className="midLine"></div>
        <div className="footOptions3">
          <NavLink to="/TAndC" className="opt">
            <p>Terms & Conditions</p>
          </NavLink>
          <p>Help and FAQ</p>
          <p>Contact Us</p>
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
