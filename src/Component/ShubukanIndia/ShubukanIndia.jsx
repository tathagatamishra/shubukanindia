import { useEffect, useState } from "react";
import "./ShubukanIndia.scss";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { logoFacebook, logoInstagram } from "ionicons/icons";
import logo from "../../assets/shubukan.png";
import img1 from "../../thumbnail/sabyasachi2.jpg";
import img2 from "../../thumbnail/sabyasachi1.jpg";

import ReactGA from 'react-ga';

export default function ShubukanIndia() {

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  
  return (
    <div className="ShubukanIndia">
      <section className="Hero">
        <h1>Shubukan India</h1>
        <p>
          Shubukanindia is approved dojo from Okinawa Shubukan and only sole
          dojo of Shubukan Okinawa school in India. Sensei Sabyasachi visited
          Okinawa for training in 2023. India Shubukan started its journey with
          the help of big hearted human Sensei Jan Gyuris who is head of Czech
          Shubukan School. He is a direct student of Shubukan School founder
          Sensei Uema Joki. Sensei Sabyasachi started his training first in
          Shubukan under Jan Gyuris Sensei. Now he is studying karate kobudo
          under Sensei Uema Takeshi directly. Sensei Takeshi is grandson of
          Sensei Joki Uema and son of Sensei Yaushiro Uema. Shubukan India is
          now preserving the tradition and culture of Shubukan School in India.
          Shubukan India promotes true orthodox karate and kobudo. Shubukan
          India welcome everyone with open heart who want to learn Okinawan
          Shorin Ryu Karate and Kobudo.
        </p>
        <p className="ex-text">Arigato Gozaimasu Minasan.</p>
      </section>

      <section className="social">
        <div className="links">
          <div className="link">
            <IonIcon icon={logoFacebook} className="label" />
            <NavLink
              to="https://www.facebook.com/ShorinRyuShubukanIndia"
              className="opt"
              target="_blank"
              rel="facebook link"
            >
              ShorinRyu Shubukan India
            </NavLink>
          </div>

          <div className="link">
            <IonIcon icon={logoFacebook} className="label" />
            <NavLink
              to="https://www.facebook.com/shubukanindia"
              className="opt"
              target="_blank"
              rel="facebook link"
            >
              Shubukan India
            </NavLink>
          </div>

          <div className="link">
            <IonIcon icon={logoInstagram} className="label" />
            <NavLink
              to="https://www.instagram.com/shubukanindia/"
              className="opt"
              target="_blank"
              rel="instagram link"
            >
              Shubukan India
            </NavLink>
          </div>
        </div>
        <div className="images">
          <img src={img1} alt="" />
          <img src={img2} alt="" />
        </div>
      </section>

      <section className="Content">
        <h1>Explication Of The Emblem</h1>
        <p>
          <img src={logo} alt="" />
          {/* <div className="img"></div> */}
          Shubukan India lead by Sensei Sabyasachi Giri . Shubukan India logo is
          brain child of sensei Sabyasachi. There is a very nice idea behind
          Shubukan India logo. This logo presents an elephant standing in famous
          shubukan school Rohai kata posture in front of Shureimon Gate of shuri
          Castle. And behind the gate there is Rising Sun. Elephant presents an
          intelligent and powerful soul and its posture come from Sensei
          Yasuhiro Uema's famous Rohai kata movement. Shureimon gate presents
          the Symbol of tradition and culture along with history of Okinawa.
          Shuri castle was the heart point during the development of Shuri
          karate. And at last rising sun; it presents the hope, beginning of
          light and enlightenment for them who believes in humanity, justice and
          education. Thus, the symbol of Shubukan India took birth.
        </p>
      </section>
    </div>
  );
}
