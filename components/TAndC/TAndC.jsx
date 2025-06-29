"use client";
import { useEffect, useState } from "react";
import "./TAndC.scss";

export default function TAndC() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="TAndC">
      <section className="Hero">
        <p className="heading">Terms and Conditions</p>
        <p>
          All rights of this logo reserved with Sensei Sabyasachi and Shubukan
          India. Any use of this logo will be legally punishable.
        </p>
        <br />
        <p>
          All images and videos in the gallery are intended for educational and
          promotional use. Unauthorized use or download of gallery content for
          commercial or personal use is strictly prohibited.
        </p>
        <br />
        <p>
          Membership of Shubukan India abide by rules and regulation. Please
          contact us for more details.
        </p>
        <br />
        <p>
          By using this website, you acknowledge that you have read, understood,
          and agreed to be bound by these terms and conditions. These terms may
          be updated at any time without prior notice, and continued use of the
          site constitutes acceptance of any changes.
        </p>
      </section>
    </div>
  );
}
