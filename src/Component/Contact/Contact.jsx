import React from "react";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  logoFacebook,
  logoInstagram,
  mailOutline,
  callOutline,
  logoWhatsapp
} from "ionicons/icons";
import "./Contact.scss";

export default function Contact() {
  const emailAddress = 'shorinryushubukanindia@gmail.com';
  const emailSubject = 'Hello';
  const emailBody = 'I wanted to reach out to you...';
  const emailLink = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

  


  return (
    <div className="Contact">
      <section className="Hero">
        <h1>Contact</h1>
        <p>Discover More About Us</p>
      </section>

      <section className="content">
        <div className="link">
          <IonIcon icon={logoWhatsapp} className="label" />
          <NavLink
            to={`https://wa.me/${+919851852499}`}
            className="opt"
            target="_blank"
            rel="phone number"
          >
            +91 9851852499
          </NavLink>
        </div>

        <div className="link">
          <IonIcon icon={mailOutline} className="label" />
          <a
            href={emailLink}
            className="opt"
            target="_blank"
            rel="gmail"
          >
            shorinryushubukanindia@gmail.com
          </a>
        </div>

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
      </section>
    </div>
  );
}
