import React, { useState } from "react";
import "./Blog.scss";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";

export default function Blog() {
  const [position, setPosition] = useState({
    height: "4rem",
    top: "6rem",
    zIndex: "15",
  });
  const [searchPos, setSearchPos] = useState({ marginBottom: "0" });
  const [lastScrollTop, setLastScrollTop] = useState(Infinity);

  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      setPosition({
        height: "8rem",
        top: "0",
        zIndex: "5",
        boxShadow: "inset 0px 230px 30px -150px rgb(236, 231, 226)",
      });
      setSearchPos({ marginBottom: "4rem" });
    } else {
      setPosition({ height: "4rem", top: "6rem", zIndex: "15" });
      setSearchPos({ marginBottom: "0" });
    }

    setLastScrollTop(scrollTop);
  });

  return (
    <div className="Blog">
      <div id="searchBar" style={position}>
        <div className="search">
          <input type="text" />
          <button>
            <IonIcon icon={searchOutline} />
          </button>
        </div>
        <div className="searchLine" style={searchPos}></div>
      </div>

      <div className="blogPage">
        <section className="blogHero">
          <h1>Harmony of Hikari</h1>
          <p>Discovering the Way of Words</p>
        </section>

        <section className="blogContent">
        </section>
      </div>
    </div>
  );
}
