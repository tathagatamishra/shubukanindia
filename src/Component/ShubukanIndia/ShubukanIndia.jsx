import React from "react";
import "./ShubukanIndia.scss";
import logo from "../../assets/shubukan.png";

export default function ShubukanIndia() {
  return (
    <div className="ShubukanIndia">
      <section className="Hero">
        <h1>Shubukan India</h1>
        <p>
          Shubukanindia is approved dojo from Okinawa Shubukan and only sole
          dojo of Shubukan Okinawa school in India. Sensei Sabyasachi visited
          Okinawa for training in 2023. India Shubukan started its journey with
          the help of big hearted human Semsei Jan Gyuris who is head of Czech
          Shubukan School. He is a direct student of Shubukan School founder
          Sensei Uema Joki. Sensei Sabyasachi started his training first in
          Shubukan under Jan Gyuris Sensei. Now he is studying karate kobudo
          under Sensei Uema Takeshi directly. Sensei Takeshi is grandson of
          Sensei Joki Uema and son of Sensei Yaushiro Uema. Shubukan India is
          now preserving the tradition and culture of Shubukan School in India.
          Shubukan India promotes true orthodox karate and kobudo. Shubukan
          India welcome everyone with open heart who want to learn Okinawan
          Shorin Ryu Karate and Kobudo.
        </p>
        <p className="ex-text">Arigato Gozaimasu Minasan.</p>
      </section>

      <section className="Content">
        <p>
          <img src={logo} alt="" />
          Shubukan India lead by Sensei Sabyasachi Giri . Shubukan India logo is
          brain child of sensei Sabyasachi. There is a very nice idea behind
          Shubukan India logo. This logo presents an elephant standing in famous
          shubukan school Rohai kata posture in front of Shureimon Gate of shuri
          Castle. And behind the gate there is Rising Sun. Elephant presents an
          intelligent and powerful soul and its posture come from Sensei
          Yasuhiro Uema's famous Rohai kata movement. Shureimon gate presents
          the Symbol of tradition and culture along with history of Okinawa.
          Shuri castle was the heart point during the development of Shuri
          karate. And at last rising sun; it presents the hope, beginning of
          light and enlightenment for them who believes in humanity, justice and
          education. Thus, the symbol of Shubukan India took birth.
        </p>
      </section>
    </div>
  );
}
