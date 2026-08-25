"use client";
import React, { useEffect, useState } from "react";
import "./Banner.scss";
import { usePathname } from "next/navigation";
import { Lekton } from "next/font/google";
import { shubukan_api } from "@/config";

const lekton = Lekton({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lekton",
});

// Shown until the API responds, and kept if the request fails or no banner
// is currently marked active — the strip should never just disappear.
const FALLBACK_BANNER = {
  messages: [
    "The Shubukan Dojo in Okinawa, the heart of Shorin-ryu Karate, has stood strong for many years, preserving tradition and shaping countless lives. Now, as the dojo ages, it needs renovation to carry its legacy forward.",
    "On the occasion of Shubukan's 50th anniversary, we humbly request all members, students, and well-wishers to contribute generously. Your support will help rebuild the dojo and ensure that the spirit of Shubukan continues to inspire future generations.",
  ],
  linkUrl: "/contact",
  linkText: "www.shubukanindia.org/contact",
};

export default function Banner() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isExamPage = pathname.startsWith("/online-exam");
  const [banner, setBanner] = useState(FALLBACK_BANNER);

  useEffect(() => {
    shubukan_api
      .get("/banner/active")
      .then((res) => {
        const data = res.data?.data;
        if (data && Array.isArray(data.messages) && data.messages.length > 0) {
          setBanner({
            messages: data.messages,
            linkUrl: data.linkUrl || FALLBACK_BANNER.linkUrl,
            linkText: data.linkText || FALLBACK_BANNER.linkText,
          });
        }
      })
      .catch(() => {
        // No active banner set, or the request failed — keep the fallback.
      });
  }, []);

  if (isAdminPage || isExamPage) return null;

  // Each message is followed by the link + a red bullet, matching the site's
  // original banner format ("<link>. |red dot| <message> Go to ").
  const content = banner.messages.map((msg, i) => (
    <React.Fragment key={i}>
      <a href={banner.linkUrl}>{banner.linkText}</a>. |🔴| {msg} Go to → {" "}
    </React.Fragment>
  ));

  return (
    <div className={`${lekton.className} banner`}>
      <div className="track">
        <p className={`${lekton.className} content`}>{content}</p>
        {/* An exact duplicate of the same content (not different text) — this is
            what makes translateX(-50%) loop seamlessly instead of jump-cutting
            back to a mismatched start every cycle. */}
        <p className={`${lekton.className} content`} aria-hidden="true">
          {content}
        </p>
      </div>
    </div>
  );
}
