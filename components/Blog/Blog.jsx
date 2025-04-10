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


  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
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
