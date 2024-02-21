import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Membership.scss";
import { IoSearch } from "react-icons/io5";

export default function Membership() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Membership">
      <section className="Hero">
        <h1>Membership</h1>
        <p>
          Shubukan India accepts membership in its certain conditions and terms.
          We practice Shorin Ryu and Okinawan Kobudo. We focus on practical self
          defence and combat, Shorin Ryu shubukan is an Okinawan traditional
          karate. We accepts club district and state membership. Remember,
          training is the strongest piller of Shubukan India school. Contact us
          to join Shubukan India.
        </p>

        <p className="alert">
          ** Membership of Shubukan India abide by rules and regulation. Please
          contact us for more details.
        </p>

        <div className="contactBtn">
          <NavLink to="/contact">
            <button>contact us</button>
          </NavLink>
        </div>
      </section>

      <div className="division"></div>

      <section className="Dojo">
        <div className="dojoNav">
          <h1>Dojo Index</h1>
          <IoSearch className="search" />
        </div>

        <div className="dojoList">
          <div className="dojoBox">
            <h2>Uema Dojo India</h2>
          </div>
          <div className="dojoBox">
            <h2>Roy Martial Arts Academy</h2>
          </div>
          <div className="dojoBox"></div>
        </div>
      </section>
    </div>
  );
}
