"use client";
import { useEffect, useState } from "react";
import "./Hozonkai.scss";

import { SlGlobe } from "react-icons/sl";

export default function Hozonkai() {

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Hozonkai">
      <section className="Hero">
        <div className="img-div">
          <img src="/assets/ShuriKarateKobudoHozonkai.png" alt="" />
        </div>

        <p className="heading">Shuri Karate Kobudo Hozonkai</p>
        <p>
          Shuri Karate Kobudo Hozonkai is preservation society for Shuri Karate
          and Kobudo. It is brain child of Takeshi Uema Sensei. Shuri Karate
          kobudo Hozonkai Representative is Sensei Yasuhiro Uema. Shuri Karate
          Kobudo Hozonkai accept members for Okinawa Karate Kobudo enthusiast.
        </p>

        <div className="links">
          <div className="link">
            <SlGlobe className="icon" />
            <a
              href="https://www.shubukan50.com"
              target="_blank"
            >
              www.shubukan50.com
            </a>
          </div>

          <div className="link">
            <SlGlobe className="icon" />
            <a
              href="https://www.big-advance.site/s/172/2105"
              target="_blank"
            >
              www.big-advance.site/s/172/2105
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
