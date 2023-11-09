import React from "react";
import "./Footer.scss";

export default function Footer() {
  function news(event) {
    event.preventDefault();
  }

  return (
    <div className="Footer">
      <div className="footSub">
        <h1>Subscribe to our newsletter</h1>

        <form action="">
          <input type="email" />
          <button onClick={news}>&#10230;</button>
        </form>

        <div className="underLine"></div>
      </div>

      <div className="footContent">
        <div className="footOptions1">
          <p>Organization</p>
          <p>Contact Us</p>
          <p>Calender</p>
          <p>Member</p>
          <p>Service</p>
        </div>
        <div className="midLine"></div>
        <div className="footOptions2">
          <p>Blog</p>
          <p>Sprit</p>
          <p>Kata</p>
          <p>History</p>
          <p>syllabus</p>
          <p>Downloads</p>
        </div>
        <div className="midLine"></div>
        <div className="footOptions3">
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
          <p>Refund Policy</p>
          <p>Help and FAQ</p>
          <p>Pricing</p>
        </div>
      </div>

      <div className="footSocial"></div>

      <div className="footLogo">
        <div className="logoImg">
          <img src="shubukanIndia.png" alt="" />
        </div>
        <div className="logoImg">
          <img src="Shorin-ryu.png" alt="" />
        </div>
        <div className="logoImg">
          <img src="wbk.png" alt="" />
        </div>
      </div>

      <div className="footLine"></div>

      <div className="footExtra">
        <p>© 2023 Shubokan India</p>
      </div>
    </div>
  );
}
