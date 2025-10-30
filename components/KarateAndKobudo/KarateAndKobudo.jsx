"use client";
import { useEffect } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import "./KarateAndKobudo.scss";

export default function KarateAndKobudo() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const kataList = [
    "Fukyu Gata Ichi",
    "Fukyu Gata Ni",
    "Fukyu Gata San",
    "Kihon Kata Ichi",
    "Kihon Kata Ni",
    "Kihon Kata San",
    "Kihon Kata Yon",
    "Kihon Kata Go",
    "Naihanchi Shodan",
    "Naihanchi Nidan",
    "Naihanchi Sandan",
    "Pinan Shodan",
    "Pinan Nidan",
    "Pinan Sandan",
    "Pinan Yondan",
    "Pinan Godan",
    "Pinan Godan Ni",
    "Itosu no Passai",
    "Matsumura no Passai",
    "Oyadomari Passai",
    "Kiyuna no Passai",
    "Gusukuma no Passai",
    "Asato no Passai",
    "Ishimine no Passai",
    "Kusanku Sho",
    "Kusanku Dai",
    "Chatanyara Kusanku",
    "Chinto",
    "Tomari Chinto",
    "Ananku",
    "Annan",
    "Wankan",
    "Chinti",
    "Jion",
    "Jitte",
    "Jiin",
    "Shochin",
    "Niseshi",
    "Sesan",
    "Unsu",
    "Tomari Rohai",
    "Itosu no Rohai Ichi",
    "Itosu no Rohai Ni",
    "Itosu no Rohai San",
    "Wanshu",
    "Tomari Wanshu Dai",
    "Tomari Wanshu Koryu",
    "Itosu Wanshu",
    "Gojushiho",
    "Yashu no Gojushiho",
    "Hakutsuru",
    "Shubuno Te",
    "Shuri Sanchin",
    "Nunfa",
  ];

  const weapons = [
    {
      name: "Bo",
      description: "Long stick. There are lot of Bo katas in shubukan.",
      image: "./karate&kobudo/bo.png",
    },
    {
      name: "Kama",
      description: "It is sickle. Previously it was used in farming.",
      image: "./karate&kobudo/kama.png",
    },
    {
      name: "Sai",
      description:
        "Fully metal weapon. Sai is excellent defense tool against long weapon and sword.",
      image: "./karate&kobudo/sai.png",
    },
    {
      name: "Tonfa",
      description: "It is a wooden weapon. Shubukan has many tonfa katas.",
      image: "./karate&kobudo/tonfa2.png",
    },
    {
      name: "Eku",
      description:
        "It is fisherman's tool used for rowing. In Okinawan kobudo it used as a excellent weapon.",
      image: "./karate&kobudo/eku.png",
    },
    {
      name: "Nunchaku",
      description:
        "It is a wooden weapon. Very important weapon of Okinawa kobudo.",
      image: "./karate&kobudo/nunchuck.png",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center pt-18">
          <h1 className="text-8xl mb-6">Karate</h1>
          <p className="jap text-5xl mb-8 text-neutral-800">空手</p>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            Karate means Empty hand. Karate makes its practitioner physically
            and mentally strong along with strong ethical and moral values.
            Basically karateka use legs and hand parts for block, strike, hold,
            throw etc.
          </p>
        </div>
      </section>

      {/* Three Elements Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Three Elements of Karate</h2>
            <p className="text-neutral-600 text-lg">
              KihonDosa, Kata and Kumite
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* KihonDosa */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border-t-4 border-neutral-900">
              {/* <div className="w-12 h-12 bg-neutral-900 rounded-lg mb-6"></div> */}
              <h3 className="text-2xl mb-2">KihonDosa</h3>
              <p className="text-neutral-500 mb-6">Basic Techniques</p>
              <p className="text-neutral-700 mb-6">
                In the study of basics Kartateka learn block (uke), strike
                (uchi), kick (Keri), stance (Tachi/Dachi), Punch (Tsuki).
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-neutral-500 mb-1">Stances</p>
                  <p className="text-sm text-neutral-700">
                    Siko Dachi, Neko Ashi Dachi, Zenkutsu Dachi, Kosa Dachi,
                    Kokutsu Dachi
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Blocks</p>
                  <p className="text-sm text-neutral-700">
                    Age uke, Soto uke, Uchi uke, Gedan uke, Shuto uke
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Kicks</p>
                  <p className="text-sm text-neutral-700">
                    Mae keri, Mawashi keri, Kansetsu keri
                  </p>
                </div>
              </div>
            </div>

            {/* Kata */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border-t-4 border-neutral-900">
              {/* <div className="w-12 h-12 bg-neutral-900 rounded-lg mb-6"></div> */}
              <h3 className="text-2xl mb-2">Kata</h3>
              <p className="text-neutral-500 mb-6">Predesigned Forms</p>
              <p className="text-neutral-700 mb-6">
                Kata is predesigned form using kihons. There are lot of katas in
                Shubukan School. We practice above 50 katas in shubukan Shorin
                Ryu.
              </p>
              <div className="inline-block px-3 py-1 bg-neutral-100 rounded-md mb-4">
                <span className="text-sm">54+ Katas</span>
              </div>
              <p className="text-sm text-neutral-600">
                Including Fukyugata, Pinan, Passai, Kushanku, Rohai, and Wanshu
              </p>
            </div>

            {/* Kumite */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border-t-4 border-neutral-900">
              {/* <div className="w-12 h-12 bg-neutral-900 rounded-lg mb-6"></div> */}
              <h3 className="text-2xl mb-2">Kumite</h3>
              <p className="text-neutral-500 mb-6">Sparring & Fighting</p>
              <p className="text-sm text-neutral-700 mb-6">
                Kumite means sparring of fighting. Shubukan maintain traditional
                old style full contact kumite.
              </p>
              <p className="text-sm text-neutral-700">
                With care Shubukan focus on self defense and teaches its members
                the true practical application of katas in effective way.
              </p>
            </div>
          </div>

          {/* Kata List */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-8">
              <h3 className="text-3xl mb-2">Complete Kata Curriculum</h3>
              <p className="text-neutral-500 mb-6">
                All {kataList.length} katas practiced in Shubukan Shorin Ryu
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {kataList.map((kata, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <span className="inline-block px-2 py-0.5 bg-white border border-neutral-300 rounded text-sm shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-neutral-800">{kata}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-neutral-600"></div>
      </div>

      {/* Kobudo Section */}
      <section className="py-20 px-6 sm:pb-[200px]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-8xl mb-6">Kobudo</h1>
            {/* <p className="jap text-5xl mb-8 text-neutral-800">空手</p> */}
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              Shubukan has many kobudo katas also. We shubukani studies these
              kata in a practical and applicable way. There are many weapons we
              use in shubukan school.
            </p>
          </div>

          {/* Weapons Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {weapons.map((weapon, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="aspect-[4/2] w-full bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-t-lg flex items-center justify-center p-8">
                  <ImageWithFallback
                    src={weapon.image}
                    alt={weapon.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl mb-3">{weapon.name}</h3>
                  <p className="text-neutral-700">{weapon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-neutral-900 mt-16">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-lg mb-2">Shubukan Shorin Ryu</p>
            <p className="text-neutral-700">
              Traditional Okinawan Karate & Kobudo
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
