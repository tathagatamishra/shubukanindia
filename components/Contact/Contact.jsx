"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaWordpress,
  FaEnvelope,
} from "react-icons/fa";
import "./Contact.scss";

export default function Contact() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const emailAddress = "shorinryushubukanindia@gmail.com";
  const emailSubject = "Hello";
  const emailBody = "I wanted to reach out to you...";
  const emailLink = `mailto:${emailAddress}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Contact">
      <section className="Hero">
        <p className="heading">Contact</p>
        <p>Discover More About Us</p>
      </section>

      <section className="content">
        <div
          className="link"
          onClick={() => navigate(`https://wa.me/${+919851852499}`)}
        >
          <FaWhatsapp className="label" />
          <div className="opt" target="_blank" rel="phone number">
            +91 9851852499
          </div>
        </div>

        <div className="link">
          <FaEnvelope className="label" />
          <a href={emailLink} className="opt" target="_blank" rel="gmail">
            shorinryushubukanindia@gmail.com
          </a>
        </div>

        <div
          className="link"
          onClick={() =>
            navigate("https://www.facebook.com/ShorinRyuShubukanIndia")
          }
        >
          <FaFacebook className="label" />
          <div className="opt" target="_blank" rel="facebook link">
            ShorinRyu Shubukan India
          </div>
        </div>

        <div
          className="link"
          onClick={() => navigate("https://www.facebook.com/shubukanindia")}
        >
          <FaFacebook className="label" />
          <div className="opt" target="_blank" rel="facebook link">
            Shubukan India
          </div>
        </div>

        <div
          className="link"
          onClick={() => navigate("https://www.instagram.com/indiashubukan?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}
        >
          <FaInstagram className="label" />
          <div className="opt" target="_blank" rel="instagram link">
            Shubukan India
          </div>
        </div>

        <div
          className="link"
          onClick={() => navigate("https://kenshinsabya.wordpress.com/")}
        >
          <FaWordpress className="label" />
          <div className="opt" target="_blank">
            kenshinsabya
          </div>
        </div>
      </section>
    </div>
  );
}
