"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import "./Footer.scss";
import Image from "next/image";

export default function Footer() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  
  return !isAdminPage ? (
    <div className="Footer relative pt-[50px]">
      {/* <div className="footSub">
        <h1>Subscribe to our newsletter</h1>

        <form action="">
          <input type="email" />
          <button onClick={news}>&#10230;</button>
        </form>

        <div className="underLine"></div>
      </div> */}
      <Image
        className="footHillLeft z-[0] h-auto absolute left-0"
        src="/footer-hill-l.png"
        width={1920}
        height={1920}
        quality={100}
        priority={true}
        sizes="(min-width: 1320px) 450px, (min-width: 820px) 400px, (min-width: 680px) 330px, (min-width: 580px) 290px, (min-width: 480px) 250px, (min-width: 380px) 220px, calc(16.67vw + 130px)"
        alt=""
      />
      <Image
        className="footHillRight z-[0] h-auto absolute right-0 scale-x-[-1]"
        src="/footer-hill-r.png"
        width={1920}
        height={1920}
        quality={100}
        priority={true}
        sizes="(min-width: 1320px) 450px, (min-width: 820px) 400px, (min-width: 680px) 330px, (min-width: 580px) 290px, (min-width: 480px) 250px, (min-width: 380px) 220px, calc(16.67vw + 130px)"
        alt=""
      />

      <div id="cloud-circle"></div>
      <svg width="0" height="0">
        <filter id="filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".01"
            numOctaves="10"
          />
          <feDisplacementMap in="SourceGraphic" scale="100" />
        </filter>
      </svg>

      <div className="footContent z-[1]">
        <div className="footOptions1">
          <div onClick={() => navigate("/contributors")} className="opt">
            <p>Contributors</p>
          </div>
          <div onClick={() => navigate("/membership")} className="opt">
            <p>Membership</p>
          </div>
          <div onClick={() => navigate("/services")} className="opt">
            <p>Service</p>
          </div>
        </div>

        <div className="midLine"></div>

        <div className="footOptions2">
          <div onClick={() => navigate("/blog")} className="opt">
            <p>Blog</p>
          </div>
          <div onClick={() => navigate("/marksheet")} className="opt">
            <p>Marksheet</p>
          </div>
          <div onClick={() => navigate("/registration")} className="opt">
            <p>Registration</p>
          </div>
          {/* <div onClick={()=>navigate("/download")} className="opt">
            <p>Downloads</p>
          </div> */}
        </div>

        <div className="midLine"></div>

        <div className="footOptions3">
          <div onClick={() => navigate("/term-and-condition")} className="opt">
            <p>Terms & Conditions</p>
          </div>
          <div onClick={() => navigate("/help-and-faqs")} className="opt">
            <p>Help and FAQ</p>
          </div>
          <div onClick={() => navigate("/contact")} className="opt">
            <p>Contact Us</p>
          </div>
        </div>
      </div>

      <div className="footSocial"></div>

      <div className="footLogo">
        <Image
          height={1920}
          width={1920}
          quality={100}
          priority={true}
          sizes="(min-width: 820px) 192px, (min-width: 720px) 160px, (min-width: 620px) 144px, (min-width: 520px) 128px, (min-width: 380px) calc(6.67vw + 79px), 80px"
          src="/assets/shubukanIndia-white.png"
          alt=""
          className="z-1 invert-[10%] grayscale-[40%] sepia-[40%]"
        />
        <Image
          height={1920}
          width={1920}
          quality={100}
          priority={true}
          src="/assets/shorinryu.svg"
          alt=""
          className="z-1 invert-[90%] grayscale-[50%] sepia-[50%]"
        />
        <Image
          height={1920}
          width={1920}
          quality={100}
          priority={true}
          src="/assets/shubukan.svg"
          alt=""
          className="z-1 invert-[90%] grayscale-[50%] sepia-[50%]"
        />
        <Image
          height={1920}
          width={1920}
          quality={100}
          priority={true}
          src="/assets/kobudo.svg"
          alt=""
          className="z-1 invert-[90%] grayscale-[50%] sepia-[50%]"
        />
        <Image
          height={1920}
          width={1920}
          quality={100}
          priority={true}
          sizes="(min-width: 820px) 192px, (min-width: 720px) 160px, (min-width: 620px) 144px, (min-width: 520px) 128px, (min-width: 380px) calc(6.67vw + 79px), 80px"
          src="/assets/Hozonkai-white.png"
          alt=""
          className="z-1 invert-[10%] grayscale-[40%] sepia-[40%]"
        />
      </div>

      <div className="footLine"></div>

      <div className="footExtra">
        <p className="">© 2023 Shubukan India</p>
      </div>
    </div>
  ) : null;
}
