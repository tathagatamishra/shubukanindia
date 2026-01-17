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

          {dojos.map((dojo, idx) => (
            <article
              key={dojo._id || idx}
              className="paper-scroll p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start bg-white rounded-lg shadow-md border border-neutral-200"
            >
              <div className="shrink-0">
                <div className="scroll-sash">
                  {dojo.profileImage && (
                    <ImageWithFallback
                      src={dojo.profileImage}
                      alt={dojo.dojoName}
                      className="h-40 aspect-3/4 object-cover rounded"
                    />
                  )}
                </div>
                {/* <div className="mt-3 text-center text-sm text-neutral-600">{dojo.dojoType}</div> */}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {dojo.dojoName || "Unnamed Dojo"}
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Instructor:{" "}
                      <span className="font-medium text-neutral-800">
                        {dojo.instructor || "—"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                      Contact
                    </h3>
                    <ul className="space-y-2">
                      {Array.isArray(dojo.contact) &&
                      dojo.contact.length > 0 ? (
                        dojo.contact.map((c, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-neutral-700"
                          >
                            {c.label?.toLowerCase().includes("phone") ? (
                              <FiPhone className="min-w-4 min-h-4" />
                            ) : c.label?.toLowerCase().includes("email") ? (
                              <FiMail className="min-w-4 min-h-4" />
                            ) : (
                              <FiMapPin className="min-w-4 min-h-4" />
                            )}
                            <span className="text-sm">{c.value || "—"}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-neutral-500">
                          No contact info
                        </li>
                      )}
                    </ul>

                    <div className="mt-4">
                      <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                        Landmark
                      </h3>
                      <div className="text-sm text-neutral-700">
                        {dojo.landmark || "—"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase text-neutral-700 tracking-wider w-full mb-2">
                      Locations
                    </h3>
                    <div className="space-y-2">
                      {Array.isArray(dojo.location) &&
                      dojo.location.length > 0 ? (
                        dojo.location.map((loc, i) => (
                          <div
                            key={i}
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

                    {dojo.dojoLocation &&
                      (dojo.dojoLocation.mainDojo?.length ||
                      dojo.dojoLocation.subDojo?.length ? (
                        <div className="mt-4">
                          <button
                            onClick={() =>
                              setOpenIdx(openIdx === idx ? null : idx)
                            }
                            className="w-full flex items-center justify-between p-2 rounded-md border border-neutral-200 bg-neutral-50"
                          >
                            <span className="text-sm font-medium">
                              View nested dojos
                            </span>
                            <span>
                              {openIdx === idx ? (
                                <FiChevronUp />
                              ) : (
                                <FiChevronDown />
                              )}
                            </span>
                          </button>

                          {openIdx === idx && (
                            <div className="mt-3 space-y-3">
                              {dojo.dojoLocation.mainDojo?.map((d, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-md border border-neutral-100 bg-white shadow-sm"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-16 h-16 flex-shrink-0">
                                      <ImageWithFallback
                                        src={d.profileImage}
                                        alt={d.dojoName || d.instructor}
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium">
                                        {d.dojoName ||
                                          d.instructor ||
                                          "Unnamed"}
                                      </div>
                                      <div className="text-xs text-neutral-500">
                                        {d.instructor
                                          ? `Instructor: ${d.instructor}`
                                          : ""}
                                      </div>
                                      <div className="text-xs text-neutral-700 mt-2">
                                        {Array.isArray(d.location)
                                          ? d.location.join(", ")
                                          : ""}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {dojo.dojoLocation.subDojo?.map((d, i) => (
                                <div
                                  key={`sub-${i}`}
                                  className="p-3 rounded-md border border-neutral-100 bg-neutral-50"
                                >
                                  <div className="text-sm font-medium">
                                    {d.dojoName || d.instructor || "Unnamed"}
                                  </div>
                                  <div className="text-xs text-neutral-500">
                                    {d.instructor
                                      ? `Instructor: ${d.instructor}`
                                      : ""}
                                  </div>
                                  <div className="text-xs text-neutral-700 mt-2">
                                    {Array.isArray(d.location)
                                      ? d.location.join(", ")
                                      : ""}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null)}
                  </div>
                </div>
              </div>
            </article>
          ))}
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
