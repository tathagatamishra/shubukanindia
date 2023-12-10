import { useEffect, useState } from "react";
import "./History.scss";
import img1 from "../../thumbnail/shureimon_gate.jpg";
import img2 from "../../assets/Karate_ShuriCastle.jpg";
import map1 from "../../assets/map.jpg";
import map2 from "../../assets/map2.jpg";
import ImgPop from "../UIComponent/ImgPop";

export default function History({ setShowNav }) {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState("");
  const [comment, setComment] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="History">
      <section className="Hero">
        <h1>History</h1>
        {/* <p>Discovering the Way of Words</p> */}
        <div className="hero-content">
          <img
            className="hero-img"
            src={img1}
            onClick={() => {
              setShowNav(false);
              setIsOpen(true);
              setImage(img1);
              setComment("Image taken by Sensei Sabyasachi Giri")
              setHeading("Shureimon Gate");
              setContent("Shureimon is a gate in the Shuri neighborhood of Naha, the capital of Okinawa Prefecture, Japan. It is the second of Shuri Castle's main gates.")
            }}
            alt=""
          />
          <p>Shureimon gate</p>
        </div>
      </section>

      <section className="content">
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

        <div className="maps">
          <img src={map1} alt="" />
          <img src={map2} alt="" />
        </div>

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

        <img className="bottom-img" src={img2} alt="" />
      </section>

      <ImgPop
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        image={image}
        comment={comment}
        heading={heading}
        content={content}
      />
    </div>
  );
}
