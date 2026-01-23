// components/History/History.jsx
"use client";
import { useEffect, useState } from "react";
import "./History.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ImgPop from "../UIComponent/ImgPop";
import Image from "next/image";

export default function History() {
  const [showNav, setShowNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState("");
  const [comment, setComment] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const openImage = ({ srcHigh, srcLow, credit, title, text }) => {
    setShowNav(false);
    setIsOpen(true);
    setImage(srcHigh || srcLow);
    setComment(credit || "");
    setHeading(title || "");
    setContent(text || "");
  };

  const timeline = [
    {
      year: "Ryukyu Era",
      headline: "The Crossroads of the East China Sea",
      body: "Okinawa - formerly the independent Ryukyu Kingdom - occupied a unique position between China, Japan and Southeast Asia. Through centuries of trade and cultural exchange, indigenous fighting arts absorbed techniques and ideas from Chinese martial systems and local island traditions. These early practices gradually evolved into what Okinawans called 'te' (手) - literally 'hand'.",
    },
    {
      year: "17th–19th c.",
      headline: "Shuri-te, Naha-te and Tomari-te",
      body: "By the early modern period three regional flavours of te developed around the port towns of Shuri, Naha and Tomari. Shuri-te emphasised speed and linear movement; Naha-te emphasised rooted stances and breath work; Tomari-te blended elements of both. Teachers and families guarded techniques closely; practice was embedded in daily life, rituals and local culture.",
    },
    {
      year: "Late 19th c.",
      headline: "Modernising Forces",
      body: "The abolition of the Ryukyu Kingdom (1879) and subsequent contacts with mainland Japan altered social structures and opened new pathways for the martial arts. Weapon bans and changing political conditions encouraged adaptation: empty-hand methods matured and were systematised. Kobudo (古武道) - the study of traditional Okinawan weapons - continued alongside empty-hand practice in many schools.",
    },
    {
      year: "1930s–1940s",
      headline: "Naming and Organisation",
      body: "In the 20th century Okinawan masters began to formalise styles and share their teachings outside the islands. In 1933 Master Choshin Chibana chose the name 'Shorin-ryū' for a stream that preserved Shuri-te principles. After the war, organisations and associations assisted the transmission of practice and pedagogy to mainland Japan and beyond.",
    },
    {
      year: "Post-war - present",
      headline: "From Local Tradition to Global Art",
      body: "Karate travelled the world through students, instructors and returning soldiers. Today there are countless dojos worldwide, but the living heart of karate and kobudo remains Okinawa: as heritage, everyday practice and community ritual. Shorin Ryu Shubukan - founded within this living tradition by Sensei Joki Uema - carries specific forms, etiquette and training methods that trace back to the islands' older streams.",
    },
  ];

  return (
    <main
      className="History min-h-screen py-12"
      aria-labelledby="history-heading"
    >
      <section className="Hero">
        <div>
          <p
            id="history-heading"
            className="heading jap xl:text-[40px] lg:text-[38px] md:text-[34px] sm:text-[30px] min-[440px]:text-[28px] min-[340px]:text-[24px] text-[20px]"
          >
            歴史
          </p>

          <h1 className="sub xl:text-[66px] lg:text-[64px] md:text-[48px] sm:text-[44px] min-[440px]:text-[34px] min-[340px]:text-[28px] text-[24px] md:leading-[70px] sm:leading-[50px] leading-[34px] flex flex-col md:flex-row">
            <span className="mr-[10px]">History of</span>Okinawan Karate and
            Kobudo
          </h1>
        </div>

        <div className="mt-[10px]">
          <div className="w-full flex md:flex-row flex-col items-stretch gap-[18px]">
            <div className="hero-img w-full overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src="/web_images/shureimon_gate_low.jpg"
                alt="Shureimon gate"
                onClick={() =>
                  openImage({
                    srcHigh: "/web_images/shureimon_gate_high.jpg",
                    srcLow: "/web_images/shureimon_gate_low.jpg",
                    credit: "Photo: Sensei Sabyasachi Giri",
                    title: "Shureimon - gate of Shuri",
                    text: "Shureimon stands at Shuri, the historical heart of the Ryukyu court. Its form and ornamentation echo the cultural connections that shaped early Okinawan society - the same currents that carried martial ideas across the sea.",
                  })
                }
              />
            </div>
            <div className="paragraph w-full">
              Okinawan karate and kobudo grew from island life: pragmatic,
              ritualised and transmitted within families and local communities.
              The styles you see today are the result of centuries of adaptation
              - a living practice that balances combat efficacy, moral
              discipline and cultural tradition.
            </div>
          </div>

          <p className="caption">Shureimon Gate - Naha, Okinawa</p>
        </div>
      </section>

      <section className="content">
        <article className="paper-block">
          <h2 className="section-title">Origins & Influences</h2>
          <p className="paragraph">
            Okinawa's geographical position made it a meeting point for traders,
            scholars and martial traditions. Techniques and training methods
            were exchanged with Chinese styles (notably Fujian White Crane and
            other southern systems) and then localised. This exchange produced
            systems focused on both empty-hand striking and the use of simple
            farming implements as weapons - later formalised as kobudo.
          </p>

          <h3 className="mini">What is Kobudo?</h3>
          <p className="paragraph">
            Kobudo (古武道) is the collective term for Okinawan traditional
            weapons arts. Common implements include the bo (staff), sai (iron
            truncheon), tonfa, nunchaku and kama. Many weapons forms were
            adapted from agricultural tools and kept alive alongside unarmed
            practice.
          </p>

          <div className="two-col">
            <div>
              <img
                src={"/assets/map.jpg"}
                alt="Map of Okinawa"
                onClick={() =>
                  openImage({
                    srcHigh: "/assets/map.jpg",
                    srcLow: "/assets/map.jpg",
                    credit: "Map: historical sources",
                    title: "Ryukyu Islands - geography",
                    text: "Okinawa was the political and cultural core of the Ryukyu Kingdom, a hub in the maritime routes of East Asia. Geography shaped both necessity and technique in its martial arts.",
                  })
                }
              />
              <p className="comment">Map of the Ryukyu Islands</p>
            </div>

            <div>
              <img
                src={"/assets/map2.jpg"}
                alt="Regional styles"
                onClick={() =>
                  openImage({
                    srcHigh: "/assets/map2.jpg",
                    srcLow: "/assets/map2.jpg",
                    credit: "Map: okinawankarate.org",
                    title: "Shuri, Naha, Tomari - three regional streams",
                    text: "Although the towns lay only miles apart, Shuri-te, Naha-te and Tomari-te developed distinctive emphases in movement, breathing and application that later became the foundations for named styles.",
                  })
                }
              />
              <p className="comment">Regional specialisations</p>
            </div>
          </div>

          <h2 className="section-title">A Short Timeline</h2>
          <ol className="timeline">
            {timeline.map((item, i) => (
              <li key={i} className="timeline-item flex flex-col md:flex-row">
                <h2 className="t-year">{item.year}</h2>
                <div>
                  <h4>{item.headline}</h4>
                  <p className="paragraph">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="section-title">
            From Tradition to Shorin Ryu Shubukan
          </h2>
          <p className="paragraph">
            Shorin Ryu preserves many training principles from the Shuri lineage
            - fluidity, speed and natural posture. Masters such as Choshin
            Chibana formalised and named the style in the early 20th century,
            and after World War II associations were formed to protect technique
            and teaching standards. Shubukan - founded by Sensei Joki Uema -
            continues this stewardship, emphasising katas, partner practice,
            weapons and the etiquette that ties practice back to Okinawan
            community life.
          </p>

          <blockquote className="wisdom">
            空手に先手なし - "There is no first attack in karate." - a classic
            maxim that reminds practitioners of restraint, character and the
            moral dimensions of training.
          </blockquote>

          <h3 className="mini">Training & Curriculum (what to expect)</h3>
          <ul>
            <li className="paragraph">
              Kihon - fundamentals: strikes, blocks, stances and footwork
            </li>
            <li className="paragraph">
              Kata - formal sequences that codify technique and principles
            </li>
            <li className="paragraph">
              Yakusoku Kumite - prearranged partner drills
            </li>
            <li className="paragraph">
              Kumite - controlled sparring for timing and application
            </li>
            <li className="paragraph">
              Kobudo - weapons forms and paired practice (where taught)
            </li>
          </ul>
        </article>

        <figure className="photo-figure">
          <img
            className="bottom-img"
            src={"/assets/Karate_ShuriCastle.jpg"}
            alt="Karate at Shuri Castle"
            onClick={() =>
              openImage({
                srcHigh: "/assets/Karate_ShuriCastle.jpg",
                srcLow: "/assets/Karate_ShuriCastle.jpg",
                credit: "Image: historical archive",
                title: "Karate training at Shuri Castle",
                text: "Training and community practice in front of Shuri Castle - a powerful image of place, pedagogy and cultural continuity.",
              })
            }
          />
          <figcaption className="comment">
            Karate training in front of Shuri Castle
          </figcaption>
        </figure>

        <div className="sketchfab-embed-wrapper">
          <iframe
            title="Shuri Castle / Shurijo, Naha - Okinawa .WIP"
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
    </main>
  );
}
