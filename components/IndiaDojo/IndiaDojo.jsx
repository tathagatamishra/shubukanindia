// components/IndiaDojo/IndiaDojo.jsx
"use client";
import React, { useEffect, useState } from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import "./IndiaDojo.scss";

function ImageWithFallback({ src, alt = "dojo image", className = "" }) {
  const [img, setImg] = useState(src || "");
  useEffect(() => setImg(src || ""), [src]);
  function handleError() {
    setImg(
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23f3f3f3'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='20'>No image</text></svg>",
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img || ""}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}

export default function IndiaDojo({ dojoData = [] }) {
  const dojos = Array.isArray(dojoData) ? dojoData : [];
  console.log(dojos);

  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="min-h-screen py-12">
      <section className="max-w-4xl mx-auto py-24 px-6">
        <header className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl mb-6">Shubukan India Dojos</h1>
          <p className="jap text-4xl md:text-5xl mb-8 text-neutral-800">道場</p>
          <p className="md:text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            Okinawan Shorin Ryu Shubukan dojos of Shubukan India
          </p>
        </header>

        <div className="grid gap-8">
          {dojos.length === 0 && (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-neutral-200">
              No dojos found.
            </div>
          )}

          {dojos.map((dojo, idx) => {
            const hasContact =
              Array.isArray(dojo.contact) && dojo.contact.length > 0;
            const hasLandmark = !!(dojo.landmark && dojo.landmark !== "");
            const hasTopLocations =
              Array.isArray(dojo.location) && dojo.location.length > 0;
            const hasMain =
              Array.isArray(dojo.dojoLocation?.mainDojo) &&
              dojo.dojoLocation.mainDojo.length > 0;
            const hasSub =
              Array.isArray(dojo.dojoLocation?.subDojo) &&
              dojo.dojoLocation.subDojo.length > 0;

            return (
              <article
                key={dojo._id || idx}
                className="paper-scroll p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start rounded-lg"
              >
                {dojo.profileImage && (
                  <div className="shrink-0 z-1">
                    <div className="scroll-sash">
                      <ImageWithFallback
                        src={dojo.profileImage}
                        alt={dojo.dojoName}
                        className="h-40 aspect-3/4 object-cover rounded"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 z-1">
                  {(dojo.dojoName || dojo.instructor) && (
                    <div>
                      {dojo.dojoName && (
                        <h2 className="Text-shine text-2xl font-semibold">
                          {dojo.dojoName}
                        </h2>
                      )}
                      {dojo.instructor && (
                        <h3 className="text-neutral-600">
                          Instructor:{" "}
                          <span className="font-medium text-neutral-800">
                            {dojo.instructor}
                          </span>
                        </h3>
                      )}
                    </div>
                  )}

                  {/* Contact / Landmark / Top-level Locations */}
                  {(hasContact || hasLandmark) && (
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {hasContact && (
                        <div className="mb-4">
                          <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                            Contact
                          </h3>
                          <ul className="space-y-2">
                            {dojo.contact.map((c, i) => (
                              <li
                                key={c._id || i}
                                className="flex items-center gap-3 text-neutral-700"
                              >
                                {c.label?.toLowerCase().includes("phone") ? (
                                  <FiPhone className="min-w-4 min-h-4" />
                                ) : c.label?.toLowerCase().includes("email") ? (
                                  <FiMail className="min-w-4 min-h-4" />
                                ) : (
                                  <FiMapPin className="min-w-4 min-h-4" />
                                )}
                                <span className="text-sm">{c.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {hasLandmark && (
                        <div>
                          <div>
                            <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                              Landmark
                            </h3>
                            <div className="text-sm text-neutral-700">
                              {dojo.landmark}
                            </div>
                          </div>

                          <div className="mt-4">
                            <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                              Locations
                            </h3>
                            <div className="space-y-2">
                              {hasTopLocations ? (
                                dojo.location.map((loc, i) => (
                                  <div
                                    key={loc?.id || `loc-${i}`}
                                    className="flex items-start gap-3 text-neutral-700"
                                  >
                                    <FiMapPin className="mt-1 min-w-4 min-h-4" />
                                    <div className="text-sm">{loc}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-neutral-500">
                                  No top-level locations
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* mainDojo / subDojo */}
                  {hasMain && (
                    <div className="w-full flex flex-col gap-6 items-start">
                      {(dojo.dojoLocation?.mainDojo || []).map((d, i) => (
                        <div
                          key={d._id || `main-${i}`}
                          className="flex flex-col md:flex-row gap-6 items-start mt-4"
                        >
                          {d.profileImage && (
                            <div className="shrink-0">
                              <div className="scroll-sash">
                                <ImageWithFallback
                                  src={d.profileImage}
                                  alt={d.dojoName || d.instructor}
                                  className="h-40 aspect-3/4 object-cover rounded"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex-1">
                            {(d.dojoName || d.instructor) && (
                              <div>
                                {d.dojoName && (
                                  <h2 className="Text-shine text-2xl font-semibold">
                                    {d.dojoName}
                                  </h2>
                                )}
                                {d.instructor && (
                                  <h3 className="text-neutral-600">
                                    Instructor:{" "}
                                    <span className="font-medium text-neutral-800">
                                      {d.instructor}
                                    </span>
                                  </h3>
                                )}
                              </div>
                            )}

                            {(d.contact.length > 0 ||
                              d.landmark ||
                              d.location.length > 0) && (
                              <div className="mt-4 grid md:grid-cols-2 gap-4">
                                {d.contact.length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                                      Contact
                                    </h3>
                                    <ul className="space-y-2">
                                      {d.contact.map((c, i) => (
                                        <li
                                          key={c._id || i}
                                          className="flex items-center gap-3 text-neutral-700"
                                        >
                                          {c.label
                                            ?.toLowerCase()
                                            .includes("phone") ? (
                                            <FiPhone className="min-w-4 min-h-4" />
                                          ) : c.label
                                              ?.toLowerCase()
                                              .includes("email") ? (
                                            <FiMail className="min-w-4 min-h-4" />
                                          ) : (
                                            <FiMapPin className="min-w-4 min-h-4" />
                                          )}
                                          <span className="text-sm">
                                            {c.value}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {(d.landmark || d.location.length > 0) && (
                                  <div>
                                    <div>
                                      <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                                        Landmark
                                      </h3>
                                      <div className="text-sm text-neutral-700">
                                        {d.landmark}
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                                        Locations
                                      </h3>
                                      <div className="space-y-2">
                                        {d.location.length > 0 ? (
                                          d.location.map((loc, i) => (
                                            <div
                                              key={loc?.id || `loc-${i}`}
                                              className="flex items-start gap-3 text-neutral-700"
                                            >
                                              <FiMapPin className="mt-1 min-w-4 min-h-4" />
                                              <div className="text-sm">
                                                {loc}
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-sm text-neutral-500">
                                            No top-level locations
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasSub && (
                    <div className="w-full flex flex-col gap-6 items-start">
                      {(dojo.dojoLocation?.subDojo || []).map((d, i) => (
                        <div
                          key={d._id || `sub-${i}`}
                          className="flex flex-col md:flex-row gap-6 items-start mt-4"
                        >
                          {d.profileImage && (
                            <div className="shrink-0">
                              <div className="scroll-sash">
                                <ImageWithFallback
                                  src={d.profileImage}
                                  alt={d.dojoName || d.instructor}
                                  className="h-40 aspect-3/4 object-cover rounded"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex-1">
                            {(d.dojoName || d.instructor) && (
                              <div>
                                {d.dojoName && (
                                  <h2 className="text-2xl font-semibold">
                                    {d.dojoName}
                                  </h2>
                                )}
                                {d.instructor && (
                                  <h3 className="text-neutral-600">
                                    Instructor:{" "}
                                    <span className="font-medium text-neutral-800">
                                      {d.instructor}
                                    </span>
                                  </h3>
                                )}
                              </div>
                            )}

                            {(d.contact.length > 0 ||
                              d.landmark ||
                              d.location.length > 0) && (
                              <div className="mt-4 grid md:grid-cols-2 gap-4">
                                {d.contact.length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                                      Contact
                                    </h3>
                                    <ul className="space-y-2">
                                      {d.contact.map((c, i) => (
                                        <li
                                          key={c._id || i}
                                          className="flex items-center gap-3 text-neutral-700"
                                        >
                                          {c.label
                                            ?.toLowerCase()
                                            .includes("phone") ? (
                                            <FiPhone className="min-w-4 min-h-4" />
                                          ) : c.label
                                              ?.toLowerCase()
                                              .includes("email") ? (
                                            <FiMail className="min-w-4 min-h-4" />
                                          ) : (
                                            <FiMapPin className="min-w-4 min-h-4" />
                                          )}
                                          <span className="text-sm">
                                            {c.value}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {(d.landmark || d.location.length > 0) && (
                                  <div>
                                    <div>
                                      <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                                        Landmark
                                      </h3>
                                      <div className="text-sm text-neutral-700">
                                        {d.landmark}
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                                        Locations
                                      </h3>
                                      <div className="space-y-2">
                                        {d.location.length > 0 ? (
                                          d.location.map((loc, i) => (
                                            <div
                                              key={loc?.id || `loc-${i}`}
                                              className="flex items-start gap-3 text-neutral-700"
                                            >
                                              <FiMapPin className="mt-1 min-w-4 min-h-4" />
                                              <div className="text-sm">
                                                {loc}
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-sm text-neutral-500">
                                            No top-level locations
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="Texture absolute top-0 left-0 w-full h-full rounded-lg z-0 overflow-hidden"></div>
              </article>
            );
          })}
        </div>

        <footer className="text-center mt-12 text-neutral-700">
          <p>Shubukan India</p>
        </footer>
      </section>

      {/* small decorative rope at bottom */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="rope-line mx-auto" />
      </div>
    </main>
  );
}
