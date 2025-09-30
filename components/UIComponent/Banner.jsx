"use client";
import React from "react";
import "./Banner.scss";
import { usePathname } from "next/navigation";

export default function Banner({
  bannerText1,
  bannerText2,
  bannerText3,
  bannerText4,
  linkUrl,
  linkText,
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isExamPage = pathname.startsWith("/online-exam");

  // Default values if props aren't provided
  // const text1 = bannerText1 || "The Registration is Open";
  // const text2 = bannerText2 || "Fill the form with necessary details.";
  // const text3 =
  //   bannerText3 || "To check your email for your registration confirmation.";
  // const text4 = bannerText4 || "Register to Shubukan India.";
 
  // Under development
  // const text1 = bannerText1 || "Website is under development";
  // const text2 = bannerText2 || "Some content may change frequently";
  // const text3 =
  //   bannerText3 || "Pages can be not responsive";
  // const text4 = bannerText4 || "Contact us to know more";

  // Dojo 
  const text1 = bannerText1 || "Contact us to know more";
  const text2 = bannerText2 || "The Shubukan Dojo in Okinawa, the heart of Shorin-ryu Karate, has stood strong for many years, preserving tradition and shaping countless lives. Now, as the dojo ages, it needs renovation to carry its legacy forward.";
  const text3 = bannerText3 || "Contact us to know more";
  const text4 = bannerText4 || "On the occasion of Shubukan's 50th anniversary, we humbly request all members, students, and well-wishers to contribute generously. Your support will help rebuild the dojo and ensure that the spirit of Shubukan continues to inspire future generations.";

  // const text1 = bannerText1 || "To check your marksheet, Obtain your unique code from your instructor.";
  // const text2 = bannerText2 || "Enter the code to view your marksheet.";
  // const text3 = bannerText3 || "To check your marksheet, Obtain your unique code from your instructor.";
  // const text4 = bannerText4 || "Enter the code to view your marksheet.";

  const url = linkUrl || "/contact";
  const urlText = linkText || "www.shubukanindia.org/contact";

  // Create the full message with link included
  const fullMessage = (
    <>
      {/* <a href={url}>{urlText}</a>. |🔴| {" "} */}
      <a href={url}>{urlText}</a>. |🔴| {text2} Go to{" "}
      {/* <a href={url}>{urlText}</a>. |🔴| {" "} */}
      <a href={url}>{urlText}</a>. |🔴| {text4} Go to{" "}
    </>
  );

  return !isAdminPage && !isExamPage ? (
    <div className="banner">
      <div className="track">
        <div className="content">{fullMessage}</div>
      </div>
    </div>
  ) : null;
}
