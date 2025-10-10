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
  const isExamPage = pathname.startsWith("/online-exam");

  return !isAdminPage && !isExamPage ? (
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
        width={1440}
        height={1440}
        quality={100}
        priority={true}
        sizes="(min-width: 1320px) 450px, (min-width: 820px) 400px, (min-width: 680px) 330px, (min-width: 580px) 290px, (min-width: 480px) 250px, (min-width: 380px) 220px, calc(16.67vw + 130px)"
        alt=""
      />
      <Image
        className="footHillRight z-[0] h-auto absolute right-0 scale-x-[-1]"
        src="/footer-hill-r.png"
        width={1440}
        height={1440}
        quality={100}
        priority={true}
        sizes="(min-width: 1320px) 450px, (min-width: 820px) 400px, (min-width: 680px) 330px, (min-width: 580px) 290px, (min-width: 480px) 250px, (min-width: 380px) 220px, calc(16.67vw + 130px)"
        alt=""
      />

      <div
        id="cloud-circle"
        style={{
          zIndex: -1,
          width: "200vw",
          height: "50%",
          borderRadius: "0%",
          filter: "url(#filter)",
          background: "#000000",
          position: "absolute",
          bottom: "0px",
          left: "-20px",
        }}
      ></div>
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

      <div
        className="footContent z-[1]"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none",
          zIndex: 1,
        }}
      >
        <div
          className="footOptions1"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "200ms",
          }}
        >
          <div onClick={() => navigate("/contributors")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Contributors
            </p>
          </div>
          <div onClick={() => navigate("/membership")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Membership
            </p>
          </div>
          <div onClick={() => navigate("/services")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Service
            </p>
          </div>
        </div>

        <div
          className="midLine"
          style={{
            height: "100%",
            width: "1px",
            background:
              "linear-gradient(0deg, rgba(235, 224, 214, 0) 0%, rgba(235, 224, 214, 1) 90%, rgba(235, 224, 214, 0) 100%)",
          }}
        ></div>

        <div
          className="footOptions2"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "200ms",
          }}
        >
          <div onClick={() => navigate("/blog")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Blog
            </p>
          </div>
          <div onClick={() => navigate("/marksheet")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Marksheet
            </p>
          </div>
          <div onClick={() => navigate("/registration")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Registration
            </p>
          </div>
          {/* <div onClick={()=>navigate("/download")} className="opt">
            <p>Downloads</p>
          </div> */}
        </div>

        <div
          className="midLine"
          style={{
            height: "100%",
            width: "1px",
            background:
              "linear-gradient(0deg, rgba(235, 224, 214, 0) 0%, rgba(235, 224, 214, 1) 90%, rgba(235, 224, 214, 0) 100%)",
          }}
        ></div>

        <div
          className="footOptions3"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "200ms",
            textDecoration: "none",
          }}
        >
          <div onClick={() => navigate("/term-and-condition")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Terms & Conditions
            </p>
          </div>
          <div onClick={() => navigate("/help-and-faqs")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Help and FAQ
            </p>
          </div>
          <div onClick={() => navigate("/contact")} className="opt">
            <p
              style={{
                textDecoration: "none",
                lineHeight: "20px",
                margin: "7px 0",
                color: "#ebe0d6",
                fontFamily: "Tenali Ramakrishna, sans-serif",
                userSelect: "none",
              }}
            >
              Contact Us
            </p>
          </div>
        </div>
      </div>

      <div className="footSocial"></div>

      <div
        className="footLogo"
        style={{
          width: "80%",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          transition: "300ms",
        }}
      >
        <Image
          height={1440}
          width={1440}
          quality={100}
          priority={true}
          sizes="(min-width: 820px) 192px, (min-width: 720px) 160px, (min-width: 620px) 144px, (min-width: 520px) 128px, (min-width: 380px) calc(6.67vw + 79px), 80px"
          src="/assets/shubukanIndia-white.png"
          alt=""
          className="z-1 invert-[10%] grayscale-[40%] sepia-[40%]"
          style={{
            height: "100%",
            width: "auto",
            userSelect: "none",
            display: "block",
            backgroundSize: "contain",
            transition: "200ms",
            filter: "invert(10%) grayscale(40%) sepia(40%)",
            zIndex: 1,
          }}
        />
        <Image
          height={1440}
          width={1440}
          quality={100}
          priority={true}
          src="/assets/shorinryu.svg"
          alt=""
          className="z-1 invert-[90%] grayscale-[50%] sepia-[50%]"
          style={{
            height: "100%",
            width: "auto",
            userSelect: "none",
            display: "block",
            backgroundSize: "contain",
            transition: "200ms",
            filter: "invert(90%) grayscale(50%) sepia(50%)",
            zIndex: 1,
          }}
        />
        <Image
          height={1440}
          width={1440}
          quality={100}
          priority={true}
          src="/assets/shubukan.svg"
          alt=""
          className="z-1 invert-[90%] grayscale-[50%] sepia-[50%]"
          style={{
            height: "100%",
            width: "auto",
            userSelect: "none",
            display: "block",
            backgroundSize: "contain",
            transition: "200ms",
            filter: "invert(90%) grayscale(50%) sepia(50%)",
            zIndex: 1,
          }}
        />
        <Image
          height={1440}
          width={1440}
          quality={100}
          priority={true}
          src="/assets/kobudo.svg"
          alt=""
          className="z-1 invert-[90%] grayscale-[50%] sepia-[50%]"
          style={{
            height: "100%",
            width: "auto",
            userSelect: "none",
            display: "block",
            backgroundSize: "contain",
            transition: "200ms",
            filter: "invert(90%) grayscale(50%) sepia(50%)",
            zIndex: 1,
          }}
        />
        <Image
          height={1440}
          width={1440}
          quality={100}
          priority={true}
          sizes="(min-width: 820px) 192px, (min-width: 720px) 160px, (min-width: 620px) 144px, (min-width: 520px) 128px, (min-width: 380px) calc(6.67vw + 79px), 80px"
          src="/assets/Hozonkai-white.png"
          alt=""
          className="z-1 invert-[10%] grayscale-[40%] sepia-[40%]"
          style={{
            height: "100%",
            width: "auto",
            userSelect: "none",
            display: "block",
            backgroundSize: "contain",
            transition: "200ms",
            filter: "invert(10%) grayscale(40%) sepia(40%)",
            zIndex: 1,
          }}
        />
      </div>

      <div
        className="footLine"
        style={{
          height: "1px",
          width: "100%",
          margin: "1rem 0",
          background: "radial-gradient(circle, #ebe0d6 20%, transparent 100%)",
        }}
      ></div>

      <div
        className="footExtra"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "25px",
        }}
      >
        <p
          className=""
          style={{
            margin: "0 1rem 1rem",
            fontSize: ".8rem",
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#ebe0d6",
            userSelect: "none",
          }}
        >
          © 2023 Shubukan India
        </p>
      </div>
    </div>
  ) : null;
}
