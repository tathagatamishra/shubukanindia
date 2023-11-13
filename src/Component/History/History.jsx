import React from "react";
import "./History.scss";
import img1 from '../../assets/blog1.jpg'

export default function History() {
  return (
    <div className="History">
      <section className="Hero">
        <h1>History</h1>
        {/* <p>Discovering the Way of Words</p> */}

        <p>
          The birth place of karate is Okinawa. Prior to 1879 karate was
          practiced by upper class families in Okinawa formerly known as Ryukyu
          kingdom. Previously karate developed as Shuri-te, Naha-te and
          Tomari-te. In that time people practiced Kobudo along with karate. Now
          a days many schools do not follow kobudo in their school curriculum.
          Later karate comes to mainland Japan and it become modern karate or
          sports karate in all over world! But true spirit of karate and kobudo
          lies with Okinawa karate and kobudo. It is part of life, tradition and
          culture.
        </p>

        <img src={img1} alt="" />

        <p>
          Today, karate is a martial art known and respected worldwide as an
          effective combative art. Its birthplace, the small islands of Okinawa
          in Japan, was once known as Ryukyu, an independent kingdom. Shorin Ryu
          is one of Okinawa's three main streams of Karate (Goju Ryu, Uechi Ryu,
          Shorin Ryu). In 1933, Master Choshin Chibana named Shorin Ryu. In
          1948, they organized Okinawa Shorin Ryu Karate-do Association. They
          took over the Shuri-te stream. There is a Dojo not only in Okinawa but
          also overseas. Shorin Ryu Shubukan was founded by Sensei Joki Uema.
        </p>
      </section>
    </div>
  );
}
