import React from "react";
import "./Footer.scss";
import logo1 from '../../assets/shubukanIndia.png'
import logo2 from '../../assets/Shorin-ryu.png'
import logo3 from '../../assets/ShubukanKanji.png'
import logo4 from '../../assets/ShuriKarateKobudoHozonkai.png'

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
          <p>Shubukan India</p>
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
          <p>Terms & Conditions</p>
          <p>Help and FAQ</p>
          <p>Contact Us</p>
        </div>
      </div>

      <div className="footSocial"></div>

      <div className="footLogo">
        <div className="logoImg">
          <img src={logo1} alt="" />
        </div>
        <div className="logoImg">
          <img src={logo2} alt="" />
        </div>
        <div className="logoImg">
          <img src={logo3} alt="" />
        </div>
        <div className="logoImg">
          <img src={logo4} alt="" />
        </div>
      </div>

      <div className="footLine"></div>

      <div className="footExtra">
        <p>© 2023 Shubukan India</p>
      </div>
    </div>
  );
}
