"use client";
import { useEffect, useState } from "react";
import "./Hozonkai.scss";
import { IonIcon } from "@ionic/react";
import { globeOutline } from "ionicons/icons";

import ShuriKarateKobudoHozonkai from "../../assets/ShuriKarateKobudoHozonkai.png";

import ReactGA from "react-ga";

export default function Hozonkai() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Hozonkai">
      <section className="Hero">
        <div className="img-div">
          <img src={ShuriKarateKobudoHozonkai} alt="" />
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
            <IonIcon icon={globeOutline} className="icon" />
            <a
              href="https://www.shubukan50.com"
              target="_blank"
            >
              www.shubukan50.com
            </a>
          </div>

          <div className="link">
            <IonIcon icon={globeOutline} className="icon" />
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
