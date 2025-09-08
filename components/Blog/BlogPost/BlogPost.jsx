"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import "./BlogPost.scss"

/*
  Dynamic blog post page for Next.js 15 app directory
  Path: app/blogpost/[slug]/page.jsx

  Features implemented with dummy data:
  - dynamic route (slug taken from pathname)
  - renders blog content from a local dummy array
  - search bar to filter blog list
  - share modal (copy link + social buttons placeholder)
  - like / dislike stored in localStorage per-slug
  - comment flow with email+OTP verification (dummy OTP, stored in session)
  - previous / next blog navigation
  - read time, related posts by tag

  Styling: Tailwind utility classes (project already uses Tailwind in other files)
  Note: Replace dummyData with fetch from your backend when ready.
*/

const dummyData = [
  {
    id: 1,
    slug: "from-fist-to-force-the-secret-behind-karate-tsuki-punch",
    title: "From Fist to Force: The Secret Behind Karate’s Tsuki Punch",
    excerpt: "A short intro to the tsuki punch and how to train it.",
    content: `## Tsuki Punch\n\nA fist is a basic weapon.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque...`,
    cover: null,
    tags: ["Karate", "Tsuki", "Self Defense"],
    date: "2025-09-01",
  },
  {
    id: 2,
    slug: "how-to-train-seiken-and-develop-power",
    title: "How to train Seiken and develop power",
    excerpt: "Seiken basics and conditioning.",
    content: `Seiken content...`,
    cover: null,
    tags: ["Karate", "Seiken", "Training"],
    date: "2025-08-25",
  },
  {
    id: 3,
    slug: "shotokan-vs-shorin-ryu-key-differences",
    title: "Shotokan vs Shorin Ryu — Key differences",
    excerpt: "Compare styles.",
    content: `Comparison content...`,
    cover: null,
    tags: ["Shotokan", "Shorin Ryu", "Karate"],
    date: "2025-07-10",
  },
  // add more items if you want
];

function useSlugFromPath() {
  const pathname = usePathname();
  // pathname example: /blogpost/from-fist-to-force-the-secret-behind-karate-tsuki-punch
  return pathname?.split("/").pop() || "";
}

function calcReadTime(content) {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function BlogPost() {
  const router = useRouter();
  const slug = useSlugFromPath();

  const [blogs, setBlogs] = useState(dummyData);
  const [query, setQuery] = useState("");

  // UI states
  const [showShare, setShowShare] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // comment + OTP states (dummy)
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(null);
  const [comments, setComments] = useState({}); // { slug: [{name, email, text, date}] }
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    // load like/dislike from localStorage
    const likeKey = `like_${slug}`;
    const dislikeKey = `dislike_${slug}`;
    setLiked(localStorage.getItem(likeKey) === "1");
    setDisliked(localStorage.getItem(dislikeKey) === "1");

    // load comments from localStorage
    const stored = localStorage.getItem("blog_comments_v1");
    if (stored) setComments(JSON.parse(stored));
  }, [slug]);

  useEffect(() => {
    // persist comments
    localStorage.setItem("blog_comments_v1", JSON.stringify(comments));
  }, [comments]);

  const post = useMemo(() => blogs.find((b) => b.slug === slug), [blogs, slug]);

  // previous / next
  const index = post ? blogs.findIndex((b) => b.slug === post.slug) : -1;
  const prev = index > 0 ? blogs[index - 1] : null;
  const next = index >= 0 && index < blogs.length - 1 ? blogs[index + 1] : null;

  // related by tag (simple)
  const related = post
    ? blogs
        .filter(
          (b) =>
            b.slug !== post.slug && b.tags.some((t) => post.tags.includes(t))
        )
        .slice(0, 3)
    : [];

  function onSearch(e) {
    e.preventDefault();
    // filter blogs by title or tags
    const q = query.trim().toLowerCase();
    if (!q) return setBlogs(dummyData);
    const filtered = dummyData.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.tags.join(" ").toLowerCase().includes(q)
    );
    setBlogs(filtered);
  }

  function toggleLike() {
    const likeKey = `like_${slug}`;
    const dislikeKey = `dislike_${slug}`;
    if (liked) {
      setLiked(false);
      localStorage.removeItem(likeKey);
    } else {
      setLiked(true);
      setDisliked(false);
      localStorage.setItem(likeKey, "1");
      localStorage.removeItem(dislikeKey);
    }
  }

  function toggleDislike() {
    const likeKey = `like_${slug}`;
    const dislikeKey = `dislike_${slug}`;
    if (disliked) {
      setDisliked(false);
      localStorage.removeItem(dislikeKey);
    } else {
      setDisliked(true);
      setLiked(false);
      localStorage.setItem(dislikeKey, "1");
      localStorage.removeItem(likeKey);
    }
  }

  function sendOtp() {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return alert("Enter a valid email");
    // dummy OTP flow: generate 4-digit code and store in sessionStorage
    const code = String(Math.floor(1000 + Math.random() * 9000));
    sessionStorage.setItem(`otp_for_${email}`, code);
    setOtpSent(true);
    alert(
      `(Dummy) OTP sent to ${email}: ${code} — enter this to verify (in real app you will send email).`
    );
  }

  function verifyOtp() {
    const code = sessionStorage.getItem(`otp_for_${email}`);
    if (code && otpInput === code) {
      setVerifiedEmail(email);
      setOtpSent(false);
      setOtpInput("");
      sessionStorage.removeItem(`otp_for_${email}`);
      alert("Email verified (dummy)");
    } else {
      alert("Invalid OTP");
    }
  }

  function postComment() {
    if (!verifiedEmail)
      return alert("Please verify your email before commenting");
    if (!commentText.trim()) return;
    const newComment = {
      email: verifiedEmail,
      text: commentText.trim(),
      date: new Date().toISOString(),
    };
    setComments((prev) => {
      const next = { ...prev };
      next[slug] = next[slug] ? [newComment, ...next[slug]] : [newComment];
      return next;
    });
    setCommentText("");
  }

  function copyLink() {
    const link = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard");
  }

  if (!post) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <p className="mt-4">Try the search or go back to the blog listing.</p>
        <div className="mt-4 flex gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200"
            onClick={() => router.push("/blog")}
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    // <div className="p-6 max-w-4xl mx-auto">
    <div className="BlogPost">
      <div className="BlogPostPage">
        {/* search bar */}
        <form onSubmit={onSearch} className="flex gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs by title or tag..."
            className="flex-1 p-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Search
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => {
              setQuery("");
              setBlogs(dummyData);
            }}
          >
            Reset
          </button>
        </form>

        {/* post header */}
        <h1 className="text-3xl font-extrabold">{post.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <div>{new Date(post.date).toLocaleDateString()}</div>
          <div>•</div>
          <div>{calcReadTime(post.content)}</div>
          <div>•</div>
          <div>{post.tags.join(", ")}</div>
        </div>

        {/* cover (if present) */}
        {post.cover && (
          <div className="mt-4 w-full h-60 relative overflow-hidden rounded">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* content */}
        <article className="prose max-w-none mt-6">
          {/* For demo we display markdown-like content as plain text. Replace with MD renderer if you want. */}
          <pre className="whitespace-pre-wrap">{post.content}</pre>
        </article>

        {/* actions: share, like/dislike */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowShare(true)}
            className="px-4 py-2 border rounded"
          >
            Share
          </button>
          <button
            onClick={toggleLike}
            className={`px-4 py-2 border rounded ${
              liked ? "bg-green-100" : ""
            }`}
          >
            Like
          </button>
          <button
            onClick={toggleDislike}
            className={`px-4 py-2 border rounded ${
              disliked ? "bg-red-100" : ""
            }`}
          >
            Dislike
          </button>
        </div>

        {/* prev / next */}
        <div className="flex justify-between mt-8">
          <div>
            {prev && (
              <button
                onClick={() => router.push(`/blogpost/${prev.slug}`)}
                className="text-left"
              >
                <div className="text-sm text-gray-500">Previous</div>
                <div className="font-semibold">{prev.title}</div>
              </button>
            )}
          </div>
          <div>
            {next && (
              <button
                onClick={() => router.push(`/blogpost/${next.slug}`)}
                className="text-right"
              >
                <div className="text-sm text-gray-500">Next</div>
                <div className="font-semibold">{next.title}</div>
              </button>
            )}
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-8">
            <h3 className="font-bold">Related posts</h3>
            <div className="flex gap-4 mt-3">
              {related.map((r) => (
                <div
                  key={r.slug}
                  className="p-3 border rounded cursor-pointer"
                  onClick={() => router.push(`/blogpost/${r.slug}`)}
                >
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm text-gray-500">{r.excerpt}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* comments */}
        <section className="mt-8">
          <h3 className="font-bold">Comments</h3>
          <div className="mt-3">
            {!verifiedEmail && (
              <div className="p-3 border rounded mb-4">
                <div className="flex gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to comment"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={sendOtp}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Send OTP
                  </button>
                </div>
                {otpSent && (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter OTP"
                      className="p-2 border rounded"
                    />
                    <button
                      onClick={verifyOtp}
                      className="px-3 py-2 bg-green-600 text-white rounded"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>
            )}

            {verifiedEmail && (
              <div className="p-3 border rounded mb-4">
                <div className="text-sm text-gray-600">
                  Commenting as: <strong>{verifiedEmail}</strong>
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  className="w-full p-2 mt-2 border rounded"
                  placeholder="Write your comment..."
                ></textarea>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={postComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Post comment
                  </button>
                  <button
                    onClick={() => {
                      setVerifiedEmail(null);
                      setEmail("");
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}

            {/* comments listing */}
            <div className="flex flex-col gap-3">
              {(comments[slug] || []).map((c, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <div className="text-sm text-gray-600">
                    {c.email} • {new Date(c.date).toLocaleString()}
                  </div>
                  <div className="mt-1">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Share modal */}
        {showShare && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded max-w-md w-full">
              <h3 className="font-bold mb-4">Share this post</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    /* placeholder social share */ alert(
                      "Open Facebook share (placeholder)"
                    );
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Facebook
                </button>
                <button
                  onClick={() => {
                    /* placeholder social share */ alert(
                      "Open Twitter share (placeholder)"
                    );
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Twitter
                </button>
                <button
                  onClick={() => {
                    /* placeholder social share */ alert(
                      "Open WhatsApp share (placeholder)"
                    );
                  }}
                  className="px-3 py-2 border rounded"
                >
                  WhatsApp
                </button>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  readOnly
                  value={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button onClick={copyLink} className="px-3 py-2 border rounded">
                  Copy
                </button>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setShowShare(false)}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
