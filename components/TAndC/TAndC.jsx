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
        <p className="heading">Terms & Conditions</p>
        <p>
          All rights of this logo reserved with Sensei Sabyasachi and Shubukan
          India. Any use of this logo will be legally punishable.
        </p>
        <br />
        <p>
          Membership of Shubukan India abide by rules and regulation. Please
          contact us for more details.
        </p>
      </section>
    </div>
  );
}
