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
      {/* <div id="searchBar" style={position}>
        <div className="search">
          <input type="text" />
          <button>
            <IonIcon icon={searchOutline} />
          </button>
        </div>
        <div className="searchLine" style={searchPos}></div>
      </div> */}

      <div className="blogPage">
        <section className="blogHero">
          <h1>Blog</h1>
          <p>Discovering the Way of Words</p>
        </section>

        

        <section className="content">
        <div className="link">
            <IonIcon icon={logoWordpress} className="label" />
            <NavLink
              to="https://kenshinsabya.wordpress.com/"
              className="opt"
              target="_blank"
            >
              kenshinsabya.wordpress.com
            </NavLink>
          </div>
        </section>
        
        {/* <section className="blogContent">
          <iframe
            id="iFrameExample"
            title="iFrame Example"
            src="https://kenshinsabya.wordpress.com/"
          ></iframe>
        </section> */}
      </div>
    </div>
  );
}
