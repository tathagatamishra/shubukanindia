// app/page.js
import Script from "next/script";
import Collage from "@/components/Gallery/Collage";
// Dragon animation is unfinished - disabled for production. To bring it back,
// uncomment this import and the "section 0" block below.
// import DragonPath from "@/components/UIComponent/dragon/DragonPath";
import { shubukan_api } from "@/config";
import { cld } from "@/utils/cloudinary";

// Re-render this page in the background at most every 5 minutes, so new
// content from the admin panel shows up without a redeploy, while visitors
// still get a cached page instantly. (axios ignores `cache: "no-store"`, so
// before this the page was frozen at build time.)
export const revalidate = 300;

export const metadata = {
  metadataBase: new URL("https://www.shubukanindia.org"),
  title: "Shubukan India | Traditional Okinawan Karate Dojo",
  description:
    "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
  keywords: [
    "karate",
    "shubukan india",
    "okinawan karate",
    "okinawa shubukan",
    "karate day",
    "shubukan50",
    "japan",
    "japan karate",
    "traditional karate",
    "shorin ryu",
    "full contact karate",
    "shubukan",
  ],
  openGraph: {
    type: "website",
    url: "https://www.shubukanindia.org",
    siteName: "Shubukan India",
    title: "Shubukan India",
    locale: "en_IN",
    description:
      "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
    images: [
      {
        url: "https://www.shubukanindia.org/og-image.jpg",
        secureUrl: "https://www.shubukanindia.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shubukan India",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubukan India",
    description:
      "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/",
  },
};

async function getLatestPosts() {
  try {
    const res = await shubukan_api.get("/blogs", { cache: "no-store" });
    return (res.data.blogs || []).slice(0, 2);
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const posts = await getLatestPosts();

  function formatPostDate(dateStr) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }
  const GALLERY_PHOTOS = [
    { src: "/web_images/shureimon_gate_low.jpg", cls: "p1" },
    { src: "/web_images/chibana_low.jpg", cls: "p2" },
    { src: "/web_images/oldGroup.webp", cls: "p3" },
    { src: "/web_images/uema_family_low.jpg", cls: "p4" },
    { src: "/web_images/joki_sai_low.jpg", cls: "p5" },
    { src: "/web_images/Matsumura_low.jpg", cls: "p6" },
    { src: "/web_images/kaynChotuku_low.jpg", cls: "p7" },
  ];
  return (
    <>
      <Script
        id="shubukan-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Shubukan India | Traditional Okinawan Karate Dojo",
            url: "https://www.shubukanindia.org/",
            description:
              "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
            publisher: {
              "@type": "Organization",
              name: "Shubukan India",
              url: "https://www.shubukanindia.org",
              logo: {
                "@type": "ImageObject",
                url: "https://www.shubukanindia.org/favicon.png",
              },
            },
          }),
        }}
      />

      <div className="Home w-full flex flex-col justify-start items-center">
        {/* section 0 - dragon animation, disabled until it's finished
            (see the DragonPath import note at the top of this file) */}
        {/* <section className="dragon-section">
          <DragonPath />
        </section> */}

        {/* .d-path was the hand-positioned test rig used to find the
            133% / -43% / -5% alignment above - now ported into
            DragonPath.scss's .dragon-path-stage, so this is redundant
            with the live component. Left here, commented, for reference /
            comparison if the alignment ever needs re-checking by eye. */}
        {/* <section className="d-path">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 752 1449" fill="none">
            <path
              d="M387.389 534.512C351.625 611.43 387.389 693.486 485.389 731.511C550.5 756.775 577.889 778.481 577.889 843.011C577.889 902.011 522.889 934.099 522.889 992.011C522.889 1105.01 604.313 1106.65 646.889 1181.51C679.517 1238.88 658.579 1321.06 625.389 1375.51C534.02 1525.4 30.4596 1430.73 14.3893 1181.51C5.91842 1050.14 136.624 1057.58 153.389 927.011C169.889 798.511 -7.88855 755.697 1.88929 626.511C18.3893 408.511 259.077 484.486 368.389 185.511C420.5 42.9865 583.41 -79.0698 698.389 68.5114C895.889 322.011 472.014 352.512 387.389 534.512Z"
              stroke="#0055FF"
              strokeWidth="1"
            />
          </svg>
        </section> */}

        {/* section 1 */}
        <section className="hero-section flex flex-col justify-start items-center">
          <div className="hero-img-holder">
            <img
              src="/assets/home/shubukan.webp"
              alt="Shubukan"
              className="hero-img hero-img--1"
            />
            <img
              src="/assets/home/uemadojoindia.webp"
              alt="Uema Dojo India"
              className="hero-img hero-img--2"
            />
          </div>
          <span className="tagline text-center font-(family-name:--font-babylonica)">
            Pure soul is the preserver of true Karate
          </span>
          <img
            src="/assets/home/red_line_1.webp"
            alt=""
            className="underline underline--1 remove-bg"
          />
        </section>

        {/* section 2 */}
        <section className="values-section w-full flex flex-row items-center justify-center">
          <div className="value-l flex flex-col items-center">
            <span className="value-kanji font-(family-name:--font-kouzan)">
              律
            </span>
            <span className="value-eng font-(family-name:--font-amarante)">
              Discipline
            </span>
          </div>

          <div className="line-vert">
            <div className="line-in"></div>
          </div>

          <div className="value-m flex flex-col items-center">
            <span className="value-kanji font-(family-name:--font-kouzan)">
              敬
            </span>
            <span className="value-eng font-(family-name:--font-amarante)">
              Respect
            </span>
          </div>

          <div className="line-vert">
            <div className="line-in"></div>
          </div>

          <div className="value-r flex flex-col items-center">
            <span className="value-kanji font-(family-name:--font-kouzan)">
              術
            </span>
            <span className="value-eng font-(family-name:--font-amarante)">
              Technique
            </span>
          </div>
        </section>

        {/* section 3 */}
        <section className="ways-section w-full flex flex-col items-center justify-start">
          <h2 className="heading heading--way font-(family-name:--font-amarante)">
            The Shubukan Way
          </h2>

          <img
              loading="lazy"
              decoding="async"
            src="/assets/home/red_line_2.webp"
            alt=""
            className="underline underline--2 remove-bg"
          />

          <div className="way-split flex flex-row items-center justify-between">
            <p className="text-center font-(family-name:--font-bellefair)">
              Shorin Ryu Karate
            </p>
            <div className="line-vert line-vert--2">
              <div className="line-in"></div>
            </div>
            <p className="text-center font-(family-name:--font-bellefair)">
              Okinawan Kobujutsu
            </p>
          </div>

          <p className="body-text text-center font-(family-name:--font-bellefair)">
            Okinawan Karate is simply designed for self-defense and it is the
            bearer of Okinawan tradition, culture and history. Shorin ryu of
            shubukan school carries the orthodox way of karate-kobudo and
            preserving its beauty. Shubukanis are strong and like to walk on a
            pure path of karate. We shubukan members are strong family, always
            trying to educate ourselves through the journey of Okinawan karate.
          </p>
        </section>

        {/* section 4 */}
        <section className="gallery-section w-full relative flex flex-col items-center">
          <div className="gallery-nav flex flex-row items-center justify-between">
            <div className="gallery-title w-[50%] flex flex-col">
              <h2 className="heading heading--sm font-(family-name:--font-amarante)">
                Gallery
              </h2>
              <img
              loading="lazy"
              decoding="async"
                src="/assets/home/red_line_3.webp"
                alt=""
                className="underline underline--3 remove-bg"
              />
            </div>

            <a
              href="/gallery"
              className="link w-[50%] text-right font-(family-name:--font-amarante)"
            >
              View Gallery →
            </a>
          </div>

          <Collage photos={GALLERY_PHOTOS} />
        </section>

        {/* section 5 */}
        <section className="quotes-section flex flex-col items-center">
          <div className="quotes-head flex flex-row justify-evenly items-start">
            <h2 className="heading heading--sm font-(family-name:--font-amarante)">
              Body
            </h2>
            <div className="line-vert line-vert--2">
              <div className="line-in"></div>
            </div>
            <h2 className="heading heading--sm font-(family-name:--font-amarante)">
              Mind
            </h2>
            <div className="line-vert line-vert--2">
              <div className="line-in"></div>
            </div>
            <h2 className="heading heading--sm font-(family-name:--font-amarante)">
              Spirit
            </h2>
          </div>

          <div className="quote-row flex">
            <div className="flex flex-col">
              <p className="quote-1 font-(family-name:--font-bellefair)">
                When you block overall, imagine you are attacking. When someone
                punches you, you don't move to evade the punch, but rather to
                break the arm.
              </p>
              <span className="quote-name italic font-(family-name:--font-bellefair)">
                &mdash; Sensei Takeshi Uema
              </span>
              <span className="quote-dan italic font-(family-name:--font-bellefair)">
                7th Dan Okinawa Shorin-Ryu
              </span>
            </div>

            <div className="quote-photo quote-photo-1">
              <img
              loading="lazy"
              decoding="async" src="/assets/quot (1).jpg" alt="Sensei Takeshi Uema" />
            </div>
          </div>

          <div className="quote-row quote-wrap">
            <p className="quote-2 w-full font-(family-name:--font-bellefair)">
              <img
              loading="lazy"
              decoding="async"
                src="/assets/quot (2).jpg"
                alt="Sensei Yasuhiro Uema"
                className="quote-photo quote-photo-2"
              />
              Our karate is not a sport but a budo. It is about tempering
              oneself. To never give up. This spirit can be reached only if one
              goes through hard training with all one's might. Spiritual
              strength comes only through hard training. It is a way of forging
              oneself.
            </p>

            <span className="flex flex-col">
              <span className="quote-name italic text-right font-(family-name:--font-bellefair)">
                &mdash; Sensei Yasuhiro Uema
              </span>
              <span className="quote-dan italic text-right font-(family-name:--font-bellefair)">
                10th Dan Okinawan Shorin-Ryu
              </span>
            </span>
          </div>

          <img
              loading="lazy"
              decoding="async"
            src="/assets/home/red_line_2.webp"
            alt=""
            className="underline underline--3 remove-bg my-[5vw]"
          />

          <div className="quote-solo">
            <p className="quote-1">
              Okinawan karate is for self-defence and self-development. Okinawan
              karate is not sport. It is education and for philosophical
              development.
            </p>
            <span className="quote-name italic font-(family-name:--font-bellefair)">
              &mdash; Sensei Sabyasachi
            </span>
          </div>

          <div className="photo-pair flex justify-around">
            <img
              loading="lazy"
              decoding="async"
              src="/assets/sg1.webp"
              alt=""
              className="w-[38%] max-w-[300px] rounded-lg"
            />
            <img
              loading="lazy"
              decoding="async"
              src="/assets/sg2.webp"
              alt=""
              className="w-[38%] max-w-[300px] rounded-lg"
            />
          </div>

          <p className="body-text story">
            Karate as a martial art is about self-defense. Overcoming your own
            weaknesses, never bending in any circumstance, it is about
            developing an unshakable spirit. In karate what is important is to
            cultivate the strength to concentrate your spirit on one thing with
            heart and soul.
          </p>

          <p className="body-text story story--center">
            Empty-handed and carrying no weapon, dominating an adversary with
            body and soul only, karate, a martial art of self-defense. To master
            the way, a long and arduous journey awaits.
          </p>
        </section>

        {/* section 6 */}
        <section className="journal-section w-full flex flex-col">
          <div className="journal-nav w-full flex flex-row items-center justify-between">
            <div className="journal-title w-[50%] flex flex-col">
              <h2 className="heading heading--sm font-(family-name:--font-amarante)">
                Journal
              </h2>
              <img
              loading="lazy"
              decoding="async"
                src="/assets/home/red_line_3.webp"
                alt=""
                className="underline underline--3 remove-bg"
              />
            </div>

            <a
              href="/journal"
              className="link w-[50%] text-right font-(family-name:--font-amarante)"
            >
              View Journals →
            </a>
          </div>

          {posts.length > 0 ? (
            <div className="journal-list w-full flex flex-col">
              {posts.map((post) => (
                <div
                  className="journal-card w-full flex flex-row justify-between"
                  key={post._id}
                >
                  {post.thumbnailImage?.url || post.coverImage?.url ? (
                    <div className="journal-thumb w-[48%] aspect-video h-auto object-cover relative z-1">
                      <img
              loading="lazy"
              decoding="async"
                        src={cld(post.thumbnailImage?.url || post.coverImage?.url, {
                          width: 640,
                        })}
                        alt=""
                        className="relative z-1"
                      />
                    </div>
                  ) : null}

                  <div className="journal-info w-[48%] h-auto aspect-video flex flex-col justify-between relative z-2">
                    <div>
                      <h3 className="journal-title font-(family-name:--font-amarante)">
                        {post.title}
                      </h3>

                      <span className="journal-summary font-(family-name:--font-bellefair)">
                        {post.summary || post.shortNote}
                      </span>
                    </div>

                    <div className="journal-meta w-full flex justify-between">
                      <span className="journal-date font-(family-name:--font-bellefair)">
                        {formatPostDate(post.publishedDate)}
                      </span>
                      <a
                        href={`/blogpost/${post.slug}`}
                        className="link w-[60%] text-right font-(family-name:--font-amarante)"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
