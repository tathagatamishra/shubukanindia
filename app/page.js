// app/page.js
import Script from "next/script";
import { shubukan_api } from "@/config";

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
    { src: "/web_images/oldGroup.jpg", cls: "p3" },
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
          <p className="tagline italic text-center">
            Pure soul is the preserver of true karate
          </p>
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
        <section className="ways-section w-full flex flex-col items-center justify-start ">
          <h2 className="heading heading--way font-(family-name:--font-amarante)">
            The Shubukan Way
          </h2>

          <img
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

          <div className="collage">
            {[
              GALLERY_PHOTOS.slice(0, 3), // column 1: p1, p2, p3
              GALLERY_PHOTOS.slice(3, 5), // column 2: p4, p5
              GALLERY_PHOTOS.slice(5, 7), // column 3: p6, p7
            ].map((col, i) => (
              <div className="collage-col" key={i}>
                {col.map((p) => (
                  <div className={`collage-photo ${p.cls}`} key={p.src}>
                    <img src={p.src} alt="" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* section 5 */}
        <section className="quotes-section flex flex-col items-center gap-4">
          <div className="bms w-full flex justify-center gap-4 mb-[20px]">
            <span className="heading heading--sm font-(family-name:--font-amarante)">Body</span>
            <span className="bms-bar" aria-hidden="true" />
            <span className="heading heading--sm font-(family-name:--font-amarante)">Mind</span>
            <span className="bms-bar" aria-hidden="true" />
            <span className="heading heading--sm font-(family-name:--font-amarante)">Spirit</span>
          </div>

          <div className="quote-row flex gap-2">
            <div className="quote">
              <p>
                When you block overall, imagine you are attacking. When someone
                punches you, you don't move to evade the punch, but rather to
                break the arm.
              </p>
              <p className="quote-sensei">Sensei Takeshi Uema</p>
              <p className="quote-sensei">7th Dan Okinawa Shorin-Ryu</p>
            </div>
            <div className="quote-photo">
              <img src="/assets/quot (1).jpg" alt="Sensei Takeshi Uema" />
            </div>
          </div>

          <div className="quote-row quote-row--reverse flex gap-2">
            <div className="quote-photo">
              <img src="/assets/quot (2).jpg" alt="Sensei Yasuhiro Uema" />
            </div>
            <div className="quote quote--right">
              <p>
                Our karate is not a sport but a budo. It is about tempering
                oneself. To never give up. This spirit can be reached only if
                one goes through hard training with all one's might. Spiritual
                strength comes only through hard training. It is a way of
                forging oneself.
              </p>
              <p className="quote-sensei">Sensei Yasuhiro Uema</p>
              <p className="quote-sensei">10th Dan Okinawan Shorin-Ryu</p>
            </div>
          </div>

          <img
            src="/assets/homepage/brush-divider-accent.png"
            alt=""
            className="divider divider--accent"
          />

          <div className="quote quote--solo">
            <p>
              Okinawan karate is for self-defence and self-development. Okinawan
              karate is not sport. It is education and for philosophical
              development.
            </p>
            <p className="quote-sensei">Sensei Sabyasachi</p>
          </div>

          <div className="photo-pair flex justify-around">
            <img src="/assets/sg1.jpg" alt="" className="w-[48%]" />
            <img src="/assets/sg2.jpg" alt="" className="w-[48%]" />
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
        <section className="journal-section">
          {posts.length > 0 ? (
            <section className="journal">
              <div className="journal-nav flex flex-row items-center justify-between">
                <div className="journal-title w-[50%] flex flex-col">
                  <h2 className="heading heading--sm font-(family-name:--font-amarante)">
                    Journal
                  </h2>
                  <img
                    src="/assets/home/red_line_3.webp"
                    alt=""
                    className="underline underline--3 remove-bg"
                  />
                </div>
              </div>

              <div className="journal-list">
                {posts.map((post) => (
                  <div className="journal-card" key={post._id}>
                    {post.thumbnailImage?.url || post.coverImage?.url ? (
                      <img
                        src={post.thumbnailImage?.url || post.coverImage?.url}
                        alt=""
                        className="journal-thumb"
                      />
                    ) : null}
                    <div className="journal-info">
                      <h3 className="journal-title">{post.title}</h3>
                      <div className="journal-meta">
                        <span className="journal-date">
                          {formatPostDate(post.publishedDate)}
                        </span>
                        <a href={`/blogpost/${post.slug}`} className="link">
                          Read More →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </>
  );
}
