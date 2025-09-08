"use client";
import { useEffect, useState } from "react";
import "./KarateAndKobudo.scss";

export default function KarateAndKobudo() {

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="KarateAndKobudo">
      <section className="Karate-Hero">
        <p className="heading">Karate</p>
        <h2 className="jap">空手</h2>
        <p>
          Karate means Empty hand. Karate makes its practitioner physically and
          mentally strong along with strong ethical and moral values. Basically
          karateka use legs and hand parts for block, strike, hold, throw etc.
          Karate has three elements - KihonDosa, Kata and Kumite.
        </p>

        <div className="element">
          <h2>KihonDosa</h2>
          <p>
            In the study of basics Kartateka learn block (uke), strike (uchi),
            kick (Keri), stance (Tachi/Dachi), Punch (Tsuki). Main stances in
            Shorin Ryu is Siko Dachi, Neko Ashi Dachi, Zenkutsu Dachi, Kosa
            Dachi, Kokutsu Dachi etc. Blocks are mainly age uke, soto uke, uchi
            uke, gedan uke and shuto uke etc. kicks ar Mae keri, Mawashi keri,
            Kansetsu keri etc.
          </p>
        </div>

        <div className="element">
          <h2>Kata</h2>
          <p>
            Kata is predesigned form using kihons. There are lot of katas in
            Shubukan School. We practice above 50 katas in shubukan Shorin Ryu.
            In our school we study Fukyugata ichi, ni, San and pinan katas,
            passai katas, Kushanku Katas and Rohai, Wanshu etc.
          </p>
        </div>

        <div className="element">
          <h2>Kumite</h2>
          <p>
            Kumite means sparring of fighting. Shubukan maintain traditional old
            style full contact kumite. With care Shubukan focus on self defense
            and teaches its members the true practical application of katas in
            effective way.
          </p>
        </div>
      </section>

      <section className="Kobudo-Hero">
        <p className="heading">Kobudo</p>
        {/* <p>Discovering the Way of Words</p> */}
        <p>
          Shubukan has many kobudo katas also. We shubukani studies these kata
          in a practical and applicable way. There are many weapons we use in
          shubukan school.
        </p>

        <div className="weapon">
          <div className="bo">
            <div className="text">
              <h2>Bo</h2>
              <p>Long stick. There are lot of Bo katas in shubukan.</p>
            </div>
            <div className="img">
              <img src="./karate&kobudo/bo.png" alt="" />
            </div>
          </div>

          <div className="kama">
            <div className="text">
              <h2>Kama</h2>
              <p>It is sickle. Previously it was used in farming.</p>
            </div>
            <div className="img">
              <img src="./karate&kobudo/kama.png" alt="" />
            </div>
          </div>

          <div className="sai">
            <div className="text">
              <h2>Sai</h2>
              <p>
                Fully metal weapon. Sai is excellent defense tool against long
                weapon and sword.
              </p>
            </div>
            <div className="img">
              <img src="./karate&kobudo/sai.png" alt="" />
            </div>
          </div>

          <div className="sai">
            <div className="text">
              <h2>Tonfa</h2>
              <p>It is a wooden weapon. Shubukan has many tonfa katas.</p>
            </div>
            <div className="img">
              <img src="./karate&kobudo/tonfa2.png" alt="" />
            </div>
          </div>

          <div className="eku">
            <div className="text">
              <h2>Eku</h2>
              <p>
                It is fisherman's tool used for rowing. In Okinawan kobudo it
                used as a excellent weapon.
              </p>
            </div>
            <div className="img">
              <img src="./karate&kobudo/eku.png" alt="" />
            </div>
          </div>

          <div className="nunchaku">
            <div className="text">
              <h2>Nunchaku</h2>
              <p>
                It is a wooden weapon. Very important weapon of Okinawa kobudo.
              </p>
            </div>
            <div className="img">
              <img src="./karate&kobudo/nunchuck.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
