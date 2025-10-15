"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiSearch, FiClock, FiChevronRight, FiX } from "react-icons/fi";
import "./Blog.scss";


function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch (e) {
    return iso;
  }
}

function truncate(text, n = 150) {
  if (!text) return "";
  return text.length > n ? text.slice(0, n).trim() + "…" : text;
}

function IconButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 " +
        className
      }
    >
      {children}
    </button>
  );
}

function BlogCard({ blog, onOpen, variant = "card" }) {
  const cover = blog.coverImage?.url || blog.thumbnailImage?.url;
  const alt =
    blog.coverImage?.altText ||
    blog.thumbnailImage?.altText ||
    blog.title ||
    "cover";
  const author = (blog.authors && blog.authors[0]) || null;

  return (
    <article
      tabIndex={0}
      role="article"
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      onClick={onOpen}
      className="group bg-white/60 backdrop-blur-sm border border-amber-100 rounded-2xl overflow-hidden shadow hover:shadow-lg transform hover:-translate-y-1 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
    >
      <div
        className={`relative w-full ${variant === "card" ? "h-40" : "h-28"}`}
      >
        {cover ? (
          <Image
            src={cover}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100" />
        )}

        <div className="absolute inset-0 flex flex-col justify-between p-3">
          <div className="flex justify-between items-start">
            <span className="bg-amber-50/90 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
              {blog.category?.primary || "General"}
            </span>
            {blog.estimatedReadTime ? (
              <span className="bg-black/40 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <FiClock /> {blog.estimatedReadTime}m
              </span>
            ) : null}
          </div>

          <h3 className="text-white text-lg font-bold drop-shadow-md leading-tight">
            {truncate(blog.title, 80)}
          </h3>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-gray-700 text-sm min-h-[44px]">
          {truncate(blog.summary || blog.shortNote, 140)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {author?.avatarImage ? (
              <Image
                src={author.avatarImage}
                alt={author.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            )}

            <div className="text-xs">
              <div className="font-semibold">{author?.name || "Shubukan"}</div>
              <div className="text-gray-500">
                {formatDate(blog.publishedDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {blog.tags?.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-xs bg-gray-100 px-2 py-1 rounded-md"
              >
                {t}
              </span>
            ))}
            <FiChevronRight className="text-gray-400" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BlogImproved({ blogs = [] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("Top Stories");
  const [layout, setLayout] = useState("grid");
  const [selectedTag, setSelectedTag] = useState(null);

  // safe: make a shallow copy and ensure respect to existing ordering
  const items = Array.isArray(blogs) ? blogs : [];

  useEffect(() => {
    // reset scroll when component mounts (helps SSR -> client snap)
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const tags = useMemo(() => {
    const s = new Set();
    items.forEach((b) => (b.tags || []).slice(0, 10).forEach((t) => s.add(t)));
    return Array.from(s).slice(0, 12);
  }, [items]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let out = items.slice();

    if (activeTab === "Latest") {
      out.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    }

    if (selectedTag) {
      out = out.filter((b) => (b.tags || []).includes(selectedTag));
    }

    if (ql) {
      out = out.filter((b) => {
        const hay = (
          b.title +
          " " +
          (b.summary || "") +
          " " +
          (b.tags || []).join(" ")
        ).toLowerCase();
        return hay.includes(ql);
      });
    }

    return out;
  }, [items, q, activeTab, selectedTag]);

  function openBlog(slug) {
    if (!slug) return;
    router.push(`/blogpost/${slug}`);
  }

  return (
    <div className="Blog w-full max-w-6xl mx-auto">
      {/* HERO */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-amanojaku text-3xl sm:text-4xl leading-tight">
            Shubukan India Blog
          </h1>
          {/* <p className="text-gray-600 mt-2">
            Traditional karate, technique breakdowns, and training notes —
            readable, fast, and focused.
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center w-full md:w-[360px] bg-white/70 backdrop-blur-sm border border-amber-100 rounded-full px-3 py-2 shadow-sm">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, summary, tags..."
              className="bg-transparent outline-none w-full text-sm"
              aria-label="Search posts"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="ml-2 text-gray-500"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <IconButton
              onClick={() => setLayout((s) => (s === "grid" ? "list" : "grid"))}
              className="bg-amber-50"
            >
              {layout === "grid" ? "Compact" : "Grid"}
            </IconButton>
          </div>
        </div>
      </header>

      {/* TABS + TAGS */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap pb-1">
          {["Top Stories", "Latest", "Techniques", "Training"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                setSelectedTag(null);
              }}
              className={`w-fit px-3 py-1 rounded-full text-sm ${
                activeTab === t ? "bg-amber-100 text-amber-800" : "bg-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="Dash w-full"></div>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag((s) => (s === t ? null : t))}
              className={`w-fit text-sm px-3 py-1 rounded-full ${
                selectedTag === t ? "bg-amber-200" : "bg-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* GRID / LIST */}
      <main>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No posts found. Try a different search or filter.
          </div>
        ) : (
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filtered.map((b) => (
              <div key={b._id}>
                <BlogCard
                  blog={b}
                  onOpen={() => openBlog(b.slug)}
                  variant={layout === "grid" ? "card" : "compact"}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        Showing {filtered.length} post{filtered.length !== 1 ? "s" : ""} • Built
        for readability and performance
      </footer>
    </div>
  );
}
