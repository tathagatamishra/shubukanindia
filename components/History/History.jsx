"use client";
import { useEffect, useState } from "react";
import "./History.scss";
import { useNav } from "../Context/NavContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ImgPop from "../UIComponent/ImgPop";

export default function History() {
  const { showNav, setShowNav } = useNav();
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
        <p className="heading">History</p>
        {/* <p>Discovering the Way of Words</p> */}
        <div className="hero-content">
          <LazyLoadImage
            className="hero-img"
            alt="Shureimon gate"
            effect="blur"
            wrapperProps={{
              style: { transitionDelay: "0s" },
            }}
            src={"/web_images/shureimon_gate.jpg"}
            onClick={() => {
              setShowNav(false);
              setIsOpen(true);
              setImage("/web_images/shuri_gate.jpg");
              setComment("Image taken by Sensei Sabyasachi Giri");
              setHeading("Shureimon Gate");
              setContent(
                "Shureimon is a gate in the Shuri neighborhood of Naha, the capital of Okinawa Prefecture, Japan. It is the second of Shuri Castle's main gates."
              );
            }}
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
          <img
            src={"/assets/map.jpg"}
            onClick={() => {
              setShowNav(false);
              setIsOpen(true);
              setImage("/assets/map.jpg");
              setComment("Image taken from okinawankarate.org");
              setHeading("The Map of Okinawa");
              setContent(
                "Okinawa, the principal island in the Ryukyu archipelago, lies at a strategic crossroads in the East China Sea. Spanning approximately 70 miles in length and 6 miles in width, it served as a vital trade center connecting Japan, China, and Southeast Asia. Its historical significance is rooted in its role as a major port facilitating trade routes and cultural exchange."
              );
            }}
            alt=""
          />
          <img
            src={"/assets/map2.jpg"}
            onClick={() => {
              setShowNav(false);
              setIsOpen(true);
              setImage("/assets/map2.jpg");
              setComment("Image taken from okinawankarate.org");
              setHeading("The Map of Okinawa");
              setContent(
                "During the nineteenth century, the three main styles of the Okinawa martial art, te, were known as Shuri-te, Naha-te and Tomari-te for the towns in which they developed. Shuri, Naha and Tomari are only few miles apart, and therefore the major styles of te are really quite similar."
              );
            }}
            alt=""
          />
        </div>
        <p className="comment">Map of Ryukyu Islands</p>

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

        <img
          className="bottom-img"
          src={"/assets/Karate_ShuriCastle.jpg"}
          onClick={() => {
            setShowNav(false);
            setIsOpen(true);
            setImage("/assets/Karate_ShuriCastle.jpg");
            setComment("Image taken from wikipedia.org");
            setHeading("Karate at Shuri Castle");
            setContent(
              "Karate training in front of Shuri Castle, Naha (Okinawa)."
            );
          }}
          alt=""
        />
        <p className="comment">Karate training in front of Shuri Castle</p>

        <div className="sketchfab-embed-wrapper">
          <iframe
            title="Shuri Castle / Shurijō, Naha - Okinawa .WIP"
            frameBorder="0"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            src="https://sketchfab.com/models/45f901e4d6fa4192a6f329e35f2dc5b8/embed?camera=0&preload=1&transparent=1"
          ></iframe>
        </div>
        <p className="comment">Digital reconstruction of Shurijo Castle</p>
      </section>

      <ImgPop
        setShowNav={setShowNav}
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
