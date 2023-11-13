import React from "react";
import "./KarateAndKobudo.scss";

import img1 from "../../assets/eku.webp";

export default function KarateAndKobudo() {
  return (
    <div className="KarateAndKobudo">
      <section className="Kata-Hero">
        <h1>Kata</h1>
        {/* <p>Discovering the Way of Words</p> */}
        <p>
          Karate means Empty hand. Karate makes its practitioner physically and
          mentally strong along with strong ethical and moral values. Basically
          karateka use legs and hand parts for block, strike, hold, throw etc.
          Karate has three elements.
        </p>
        <p>
          1. KihonDosa- Study of basics. Kartateka learn block(uke),
          strike(uchi), kick(Keri), stance(Tachi/Dachi), Punch(Tsuki) . Main
          stances in Shorin Ryu is Siko Dachi, Neko Ashi Dachi, Zenkutsu Dachi,
          Kosa Dachi, Kokutsu Dachi etc.. Blocks are mainly age uke, soto uke,
          uchi uke, gedan uke and shuto uke etc. kicks ar Mae keri, Mawashi
          keri, Kansetsu keri etc.
        </p>
        <p>
          2. Kata.- Kata is predesigned form using kihons. There are lot of
          katas in Shubukan School. We practice above 50 katas in shubukan
          Shorin Ryu. In our school we study Fukyugata ichi, ni , San and pinan
          katas, passai katas, Kushanku Katas and Rohai, Wanshu etc.
        </p>
        <p>
          3. Kumite.- Kumite means sparring of fighting. Shubukan maintain
          traditional old style full contact kumite. With care shubukan focus on
          self defense and teaches its members the true practical application of
          katas in effective way.
        </p>
      </section>

      <section className="Kobudo-Hero">
        <h1>Kobudo</h1>
        {/* <p>Discovering the Way of Words</p> */}
        <p>
          Shubukan has many kobudo katas also. We shubukani studies these kata
          in a practical and applicable way. There are many weapons we use in
          shubukan school. Bo:- Long stick. There are lot of Bo katas in
          shubukan. Kama:- It is sickle. Previously it was used in farming.
          Sai:- Fully metal weapon. Sai is excellent defense tool against long
          weapon and sword. Tonfa:- It is a wooden weapon. Shubukan has many
          tonfa katas.
        </p>
        <img src={img1} alt="" />
      </section>
    </div>
  );
}
