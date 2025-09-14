"use client";
import { useEffect, useState } from "react";
import "./ShubukanIndia.scss";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function ShubukanIndia() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  
  return (
    <main className="ShubukanIndia">
      <section className="Hero">
        <p className="heading">Shubukan India</p>
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
            <FaFacebook className="label" />
            <a
              to="https://www.facebook.com/ShorinRyuShubukanIndia"
              className="opt"
              target="_blank"
              rel="facebook link"
            >
              ShorinRyu Shubukan India
            </a>
          </div>

          <div className="link">
            <FaFacebook className="label" />
            <a
              to="https://www.facebook.com/shubukanindia"
              className="opt"
              target="_blank"
              rel="facebook link"
            >
              Shubukan India
            </a>
          </div>

          <div className="link">
            <FaInstagram className="label" />
            <a
              to="https://www.instagram.com/shubukanindia/"
              className="opt"
              target="_blank"
              rel="instagram link"
            >
              Shubukan India
            </a>
          </div>
        </div>
        <div className="images">
          <img src="/dojo_instructors/sabyasachi2.jpg" alt="" />
          <img src="/dojo_instructors/sabyasachi1.jpg" alt="" />
        </div>
      </section>

      <section className="Content">
        <p className="heading">Explication Of The Emblem</p>
        <p>
          <img src="https://res.cloudinary.com/daspiwjet/image/upload/v1755369663/shubukan_kjeaou.png" alt="" />
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
    </main>
  );
}
