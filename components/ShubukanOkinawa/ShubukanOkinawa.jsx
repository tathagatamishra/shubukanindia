"use client";
import { useEffect, useState } from "react";
import "./ShubukanOkinawa.scss";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { logoFacebook } from "ionicons/icons";

import img1 from "../../assets/shubukanDojo.jpg";
import img2 from "../../assets/Frame 3.png";
import img3 from "../../assets/Frame 2.png";
import img4 from "../../assets/Frame 1.png";

import ReactGA from "react-ga";

export default function ShubukanOkinawa() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="ShubukanOkinawa">
      <section className="Hero">
        <p className="heading">Shubukan Okinawa</p>

        <div className="img-div">
          <img src={img1} alt="" />
        </div>

        <p>
          In 1933, Master Choshin Chibana named Shorin Ryu. In 1948, they
          organized Okinawa Shorin Ryu Karate-do Association. They took over the
          Shuri-te stream. There are Dojo not only in Okinawa but also overseas.
          <br />
          <br />
          Shorin Ryu Shubukan was founded by Sensei Joki Uema. Now his son
          Sensei Uema Yasuhiro is now chairman of Okinawa Shubukan.
        </p>

        <div className="family">
          <div className="child">
            <img src={img2} alt="" />
            <p>
              Sensei Uema Yasuhiro <br /> (10th Dan) <br /> ( DOB- 15 August
              1945 <br /> DOD- 2 January 2025 )
            </p>
          </div>
          <div className="parent">
            <img src={img3} alt="" />
            <p>
              Sensei Uema Joki <br /> (10th Dan) <br /> ( DOB- 13 June 1920{" "}
              <br /> DOD- 20 July 2011 )
            </p>
          </div>
          <div className="child">
            <img src={img4} alt="" />
            <p>
              Sensei Uema Takeshi <br /> (7th Dan) <br /> ( DOB- 11 February
              1975 )
            </p>
          </div>
        </div>

        <div className="link">
          <IonIcon icon={logoFacebook} className="label" />
          <NavLink
            to="https://www.facebook.com/shubukan"
            className="opt"
            target="_blank"
            rel="facebook link"
          >
            https://www.facebook.com/shubukan
          </NavLink>
        </div>
      </section>
    </div>
  );
}
