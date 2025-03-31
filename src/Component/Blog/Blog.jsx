import { useEffect, useState, useRef } from "react";
import "./Blog.scss";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { logoWordpress, searchOutline } from "ionicons/icons";
import { Pane } from "tweakpane";

export default function Blog() {
  const [position, setPosition] = useState({
    height: "4rem",
    top: "6rem",
    zIndex: "15",
  });
  const [searchPos, setSearchPos] = useState({ marginBottom: "0" });
  const [lastScrollTop, setLastScrollTop] = useState(Infinity);
  const [activeIndex, setActiveIndex] = useState(0);
  const [articleWidth, setArticleWidth] = useState(0);
  const listRef = useRef(null);
  const itemsRef = useRef([]);

  // Theme configuration
  useEffect(() => {
    const config = {
      theme: "system",
    };

    const ctrl = new Pane({
      title: "Config",
      expanded: true,
    });

    const update = () => {
      document.documentElement.dataset.theme = config.theme;
    };

    const sync = (event) => {
      if (
        !document.startViewTransition ||
        event.target.controller.view.labelElement.innerText !== "Theme"
      )
        return update();
      document.startViewTransition(() => update());
    };

    ctrl.addBinding(config, "theme", {
      label: "Theme",
      options: {
        System: "system",
        Light: "light",
        Dark: "dark",
      },
    });

    ctrl.on("change", sync);
    update();

    return () => {
      ctrl.dispose();
    };
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
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
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  // Calculate max article width on resize
  useEffect(() => {
    const calculateMaxWidth = () => {
      if (!itemsRef.current.length) return;
      
      const widths = itemsRef.current.map(item => item ? item.offsetWidth : 0);
      const maxWidth = Math.max(...widths);
      setArticleWidth(maxWidth);
    };

    calculateMaxWidth();
    
    window.addEventListener("resize", calculateMaxWidth);
    
    return () => {
      window.removeEventListener("resize", calculateMaxWidth);
    };
  }, []);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  // Handle article interaction
  const handleItemInteraction = (index) => {
    setActiveIndex(index);
  };

  // Generate grid template columns based on active index
  const getGridTemplateColumns = () => {
    if (listRef.current) {
      return Array(listRef.current.children.length)
        .fill()
        .map((_, i) => (i === activeIndex ? "10fr" : "1fr"))
        .join(" ");
    }
    return "10fr 1fr 1fr 1fr 1fr 1fr 1fr";
  };

  return (
    <div className="Blog">
      <div className="blogPage">
        <section className="blogHero">
          <p className="heading">Blog</p>
          <p className="subHeading">The blog is under construction...</p>
        </section>

        <section className="blogContent">
          <ul 
            ref={listRef}
            style={{ 
              gridTemplateColumns: getGridTemplateColumns(),
              "--article-width": `${articleWidth}px`
            }}
          >
            {[
              {
                title: "The Craft",
                description: "Gain the confidence to build anything you envision, transforming motion, interaction, and design principles into second nature.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 3h12l4 6-10 13L2 9Z" />
                    <path d="M11 3 8 9l4 13 4-13-3-6" />
                    <path d="M2 9h20" />
                  </svg>
                ),
                image: "https://picsum.photos/720/720?random=12"
              },
              {
                title: "CSS Animation",
                description: "Master CSS animations from your very first set of @keyframes right through to things no one else ever teaches you.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 3v18" />
                    <path d="M3 7.5h4" />
                    <path d="M3 12h18" />
                    <path d="M3 16.5h4" />
                    <path d="M17 3v18" />
                    <path d="M17 7.5h4" />
                    <path d="M17 16.5h4" />
                  </svg>
                ),
                image: "https://picsum.photos/720/720?random=17"
              },
              {
                title: "SVG Filters",
                description: "Shaders on a budget. Learn how to use noise to your advantage whilst making flames and stickers.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                ),
                image: "https://picsum.photos/720/720?random=19"
              },
              {
                title: "Scroll Animation",
                description: "Take your users on a journey with the joy of tasteful scroll animation. You might not even need JavaScript.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                    <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
                  </svg>
                ),
                image: "https://picsum.photos/720/720?random=42"
              },
              {
                title: "Taming Canvas",
                description: "Grasp how to tame the pixel playground and when to do so. Whilst building with Performance Driven Development.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                  </svg>
                ),
                image: "https://picsum.photos/720/720?random=128"
              },
              {
                title: "Layout Tricks",
                description: "Do you really need a library for that? Sometimes stepping back and rethinking the problem yields a nifty solution.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
                    <path d="m14 7 3 3" />
                    <path d="M5 6v4" />
                    <path d="M19 14v4" />
                    <path d="M10 2v2" />
                    <path d="M7 8H3" />
                    <path d="M21 16h-4" />
                    <path d="M11 3H9" />
                  </svg>
                ),
                image: "https://picsum.photos/720/720?random=56"
              },
              {
                title: "Mastering Time",
                description: "It's not all just easings and compositions. Time plays a crucial part in various UI patterns that might not seem obvious at first.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 22h14" />
                    <path d="M5 2h14" />
                    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                  </svg>
                ),
                image: "https://picsum.photos/720/720?random=39"
              }
            ].map((item, index) => (
              <li 
                key={index}
                ref={el => itemsRef.current[index] = el}
                data-active={(index === activeIndex).toString()}
                onClick={() => handleItemInteraction(index)}
                onPointerMove={() => handleItemInteraction(index)}
                onFocus={() => handleItemInteraction(index)}
              >
                <article>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.icon}
                  <a href="#">
                    <span>Watch now</span>
                  </a>
                  <img src={item.image} alt="" />
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}