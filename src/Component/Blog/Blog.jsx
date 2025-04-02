import { useEffect, useState } from "react";
import "./Blog.scss";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { logoWordpress, searchOutline } from "ionicons/icons";

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Blog">
      <div className="blogPage">
        <section className="blogHero">
          <p className="heading">Blog</p>
          <p>The blog is under construction...</p>
        </section>

        <section className="blogContent">
          
        </section>
      </div>
    </div>
  );
}