"use client";
import { useEffect, useState } from "react";
import "./ShubukanOkinawa.scss";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ShubukanOkinawa() {
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
    <div className="ShubukanOkinawa">
      <section className="Hero">
        <p className="heading">Shubukan Okinawa</p>

        <div className="img-div">
          <img src="./assets/shubukanDojo.jpg" alt="" />
        </div>

        <p>
          In 1933, Master Choshin Chibana named Shorin Ryu. In 1948, they
          organized Okinawa Shorin Ryu Karate-do Association. They took over the
          Shuri-te stream. There are Dojo not only in Okinawa but also overseas.
          <br />
          <br />
          Shorin Ryu Shubukan was founded by Sensei Joki Uema. Now his son
          Sensei Uema Yasuhiro is now chairman of Okinawa Shubukan.
        </p>

        <div className="family">
          <div className="box">
            <img src="./assets/Frame 3.png" alt="" />
            <p>
              Sensei Uema Yasuhiro <br /> (10th Dan) <br /> ( DOB- 15 August
              1945 <br /> DOD- 2 January 2025 )
            </p>
          </div>

          <div className="box">
            <img src="./assets/Frame 2.png" alt="" />
            <p>
              Sensei Uema Joki <br /> (10th Dan) <br /> ( DOB- 13 June 1920{" "}
              <br /> DOD- 20 July 2011 )
            </p>
          </div>

          <div className="box">
            <img src="./assets/Frame 1.png" alt="" />
            <p>
              Sensei Uema Takeshi <br /> (7th Dan) <br /> ( DOB- 11 February
              1975 )
            </p>
          </div>
        </div>

        <div className="link">
          <FaFacebook className="label" />
          <div
            onClick={() => navigate("https://www.facebook.com/shubukan")}
            className="opt"
            target="_blank"
            rel="facebook link"
          >
            https://www.facebook.com/shubukan
          </div>
        </div>
      </section>
    </div>
  );
}
