import React from "react";
import "./Hozonkai.scss";
import { NavLink } from "react-router-dom";

import ShuriKarateKobudoHozonkai from '../../assets/ShuriKarateKobudoHozonkai.png'

export default function Hozonkai() {
  return (
    <div className="Hozonkai">
      <section className="Hero">
        <h1>Suri Karate kobudo Hozonkai</h1>
        <img src={ShuriKarateKobudoHozonkai} alt="" />
        <p>
          Shuri Karate Kobudo Hozonkai is preservation society for Shuri Karate
          and Kobudo. It is brain child of Takeshi Uema Sensei. Shuri Karate
          kobudo Hozonkai Representative is Sensei Yasuhiro Uema. Shuri Karate
          Kobudo Hozonkai accept members for Okinawa Karate Kobudo enthusiast.
        </p>
        
        <NavLink to="/Services" className="opt">
          <p>https://www.big-advance.site/s/172/2105/business</p>
        </NavLink>
      </section>
    </div>
  );
}
