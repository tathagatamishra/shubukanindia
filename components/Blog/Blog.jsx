"use client";
import { useEffect, useState } from "react";
import "./Blog.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Blog() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const [position, setPosition] = useState({
    height: "4rem",
    top: "6rem",
    zIndex: "15",
  });
  const [searchPos, setSearchPos] = useState({ marginBottom: "0" });
  const [lastScrollTop, setLastScrollTop] = useState(Infinity);

  if (window !== undefined) {
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
  }

  useEffect(() => {
    if (window !== undefined) {
      window.scrollTo({
        top: 0,
      });
    }
  }, []);

  return (
    <div className="Blog">
      <div className="blogPage">

        <section className="blogNav">
          <div className="opt">Top Stories</div>
          <div className="opt">Latest</div>
          <div className="opt">Shubukan</div>
        </section>
        <section className="blogContent"></section>
        <section className="blogFooter"></section>
      </div>
    </div>
  );
}
