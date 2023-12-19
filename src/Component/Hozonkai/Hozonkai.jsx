import { useEffect, useState } from "react";
import "./Hozonkai.scss";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { globeOutline } from "ionicons/icons";

import ShuriKarateKobudoHozonkai from "../../assets/ShuriKarateKobudoHozonkai.png";

import ReactGA from 'react-ga';

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

        <h1>Shuri Karate Kobudo Hozonkai</h1>
        <p>
          Shuri Karate Kobudo Hozonkai is preservation society for Shuri Karate
          and Kobudo. It is brain child of Takeshi Uema Sensei. Shuri Karate
          kobudo Hozonkai Representative is Sensei Yasuhiro Uema. Shuri Karate
          Kobudo Hozonkai accept members for Okinawa Karate Kobudo enthusiast.
        </p>

        <div className="link">
          <IonIcon icon={globeOutline} className="label" />
          <NavLink
            to="https://www.big-advance.site/s/172/2105/business"
            className="opt"
            target="_blank"
          >
            https://www.big-advance.site/s/172/2105/business
          </NavLink>
        </div>
      </section>
    </div>
  );
}
