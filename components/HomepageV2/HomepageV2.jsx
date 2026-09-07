"use client";
import React from "react";
import "./HomepageV2.scss";

const GALLERY_PHOTOS = [
  { src: "/web_images/shureimon_gate_low.jpg", cls: "p1" },
  { src: "/web_images/uema_family_low.jpg", cls: "p2" },
  { src: "/web_images/Matsumura_low.jpg", cls: "p3" },
  { src: "/web_images/chibana_low.jpg", cls: "p4" },
  { src: "/web_images/joki_sai_low.jpg", cls: "p5" },
  { src: "/web_images/oldGroup.jpg", cls: "p6" },
  { src: "/web_images/kaynChotuku_low.jpg", cls: "p7" },
];

function formatPostDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

// Standalone preview of a new homepage design at /homepage — the real "/" is
// untouched. Mobile-first: the design only exists for <640px, and is meant to
// look the same across ~360px–640px specifically (see HomepageV2.scss).
// Content/copy/images are the same as the real homepage (components/Home) —
// only the visual treatment is new.
export default function HomepageV2({ posts = [] }) {
  return (
    <main className="hpv2">

      {/* ===== Hero ===== */}
      <section className="hpv2-hero">
        <img src="/assets/home/shubukan.webp" alt="Shubukan" className="hpv2-wordmark hpv2-wordmark--1" />
        <img
          src="/assets/home/uemadojoindia.webp"
          alt="Uema Dojo India"
          className="hpv2-wordmark hpv2-wordmark--2"
        />
        <p className="hpv2-tagline">Pure soul is the preserver of true karate</p>
        <img src="/assets/homepage/brush-divider-main.png" alt="" className="hpv2-divider hpv2-divider--main" />
      </section>

      {/* ===== Values ===== */}
      <section className="hpv2-values">
        <div className="hpv2-value">
          <span className="hpv2-value-kanji">律</span>
          <span className="hpv2-value-label">Discipline</span>
        </div>
        <div className="hpv2-value">
          <span className="hpv2-value-kanji">敬</span>
          <span className="hpv2-value-label">Respect</span>
        </div>
        <div className="hpv2-value">
          <span className="hpv2-value-kanji">術</span>
          <span className="hpv2-value-label">Technique</span>
        </div>
      </section>

      {/* ===== The Shubukan Way ===== */}
      <section className="hpv2-way">
        <h2 className="hpv2-heading hpv2-heading--way">The Shubukan Way</h2>
        <img src="/assets/homepage/brush-divider-accent.png" alt="" className="hpv2-divider hpv2-divider--accent" />
        <div className="hpv2-way-split">
          <span>ShorinRyu Karate</span>
          <span className="hpv2-way-split-bar" aria-hidden="true" />
          <span>Okinawan Kobujutsu</span>
        </div>
        <p className="hpv2-body-text">
          Okinawan Karate is simply designed for self-defense and it is the bearer of Okinawan tradition, culture and
          history. Shorin ryu of shubukan school carries the orthodox way of karate-kobudo and preserving its beauty.
          Shubukanis are strong and like to walk on a pure path of karate. We shubukan members are strong family,
          always trying to educate ourselves through the journey of Okinawan karate.
        </p>
      </section>

      {/* ===== Gallery ===== */}
      <section className="hpv2-gallery">
        <div className="hpv2-section-title-row">
          <h2 className="hpv2-heading hpv2-heading--sm">Gallery</h2>
          <a href="/gallery" className="hpv2-link">
            View Gallery →
          </a>
        </div>
        <img src="/assets/homepage/brush-divider-accent.png" alt="" className="hpv2-divider hpv2-divider--gallery" />
        <div className="hpv2-collage">
          {GALLERY_PHOTOS.map((p) => (
            <div className={`hpv2-collage-photo ${p.cls}`} key={p.src}>
              <img src={p.src} alt="" />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Body / Mind / Spirit testimonials ===== */}
      <section className="hpv2-testimonials">
        <div className="hpv2-bms">
          <span>Body</span>
          <span className="hpv2-bms-bar" aria-hidden="true" />
          <span>Mind</span>
          <span className="hpv2-bms-bar" aria-hidden="true" />
          <span>Spirit</span>
        </div>

        <div className="hpv2-quote-row">
          <div className="hpv2-quote">
            <p>
              When you block overall, imagine you are attacking. When someone punches you, you don't move to evade
              the punch, but rather to break the arm.
            </p>
            <p className="hpv2-quote-sensei">Sensei Takeshi Uema</p>
            <p className="hpv2-quote-sensei">7th Dan Okinawa Shorin-Ryu</p>
          </div>
          <div className="hpv2-quote-photo">
            <img src="/assets/quot (1).jpg" alt="Sensei Takeshi Uema" />
          </div>
        </div>

        <div className="hpv2-quote-row hpv2-quote-row--reverse">
          <div className="hpv2-quote-photo">
            <img src="/assets/quot (2).jpg" alt="Sensei Yasuhiro Uema" />
          </div>
          <div className="hpv2-quote hpv2-quote--right">
            <p>
              Our karate is not a sport but a budo. It is about tempering oneself. To never give up. This spirit can
              be reached only if one goes through hard training with all one's might. Spiritual strength comes only
              through hard training. It is a way of forging oneself.
            </p>
            <p className="hpv2-quote-sensei">Sensei Yasuhiro Uema</p>
            <p className="hpv2-quote-sensei">10th Dan Okinawan Shorin-Ryu</p>
          </div>
        </div>

        <img src="/assets/homepage/brush-divider-accent.png" alt="" className="hpv2-divider hpv2-divider--accent" />

        <div className="hpv2-quote hpv2-quote--solo">
          <p>
            Okinawan karate is for self-defence and self-development. Okinawan karate is not sport. It is education
            and for philosophical development.
          </p>
          <p className="hpv2-quote-sensei">Sensei Sabyasachi</p>
        </div>

        <div className="hpv2-photo-pair">
          <img src="/assets/sg1.jpg" alt="" />
          <img src="/assets/sg2.jpg" alt="" />
        </div>

        <p className="hpv2-body-text hpv2-story">
          Karate as a martial art is about self-defense. Overcoming your own weaknesses, never bending in any
          circumstance, it is about developing an unshakable spirit. In karate what is important is to cultivate the
          strength to concentrate your spirit on one thing with heart and soul.
        </p>

        <p className="hpv2-body-text hpv2-story hpv2-story--center">
          Empty-handed and carrying no weapon, dominating an adversary with body and soul only, karate, a martial art
          of self-defense. To master the way, a long and arduous journey awaits.
        </p>
      </section>

      {/* ===== Journal ===== */}
      {posts.length > 0 ? (
        <section className="hpv2-journal">
          <h2 className="hpv2-heading hpv2-heading--sm">Journal</h2>
          <img src="/assets/homepage/brush-divider-accent.png" alt="" className="hpv2-divider hpv2-divider--gallery" />
          <div className="hpv2-journal-list">
            {posts.map((post) => (
              <div className="hpv2-journal-card" key={post._id}>
                {post.thumbnailImage?.url || post.coverImage?.url ? (
                  <img src={post.thumbnailImage?.url || post.coverImage?.url} alt="" className="hpv2-journal-thumb" />
                ) : null}
                <div className="hpv2-journal-info">
                  <h3 className="hpv2-journal-title">{post.title}</h3>
                  <div className="hpv2-journal-meta">
                    <span className="hpv2-journal-date">{formatPostDate(post.publishedDate)}</span>
                    <a href={`/blogpost/${post.slug}`} className="hpv2-link">
                      Read More →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
