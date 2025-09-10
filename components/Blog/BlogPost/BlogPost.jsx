//components/Blog/BlogPost/BlogPost.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
// import { blogPosts } from "./blogData";
import { shubukan_api } from "@/config";
import Image from "next/image";
import "./BlogPost.scss";

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

function useSlugFromPath() {
  const pathname = usePathname();
  // pathname example: /blogpost/from-fist-to-force-the-secret-behind-karate-tsuki-punch
  return pathname?.split("/").pop() || "";
}

export default function BlogPost() {
  const router = useRouter();
  // const slug = useSlugFromPath();
  const { slug } = useParams();

  // const [blog, setBlog] = useState(blogPosts);

  const [blog, setBlog] = useState(null);
  const [query, setQuery] = useState("");

  // states
  const [showShare, setShowShare] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // OTP + comments
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  // ✅ Fetch blog data from backend
  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await shubukan_api.get(`/blog/${slug}`);
        setBlog(res.data);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error(err);
      }
    }
    if (slug) fetchBlog();
  }, [slug]);

  // 🔹 OTP APIs
  async function sendOtp() {
    if (!email) return alert("Enter a valid email");
    try {
      await shubukan_api.post("/send-otp", { email });
      setOtpSent(true);
      alert(`OTP sent to ${email}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  }

  async function verifyOtp() {
    try {
      const res = await shubukan_api.post("/verify-otp", {
        email,
        otp: otpInput,
      });
      localStorage.setItem("verified_email", email);
      localStorage.setItem("email_token", res.data.token);
      setVerifiedEmail(email);
      setOtpSent(false);
      setOtpInput("");
      alert("Email verified ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  }

  // Helper to get headers
  function getAuthHeaders() {
    return {
      headers: {
        "x-email": localStorage.getItem("verified_email"),
        "x-email-token": localStorage.getItem("email_token"),
      },
    };
  }

  // 🔹 Like
  async function toggleLike() {
    if (!verifiedEmail) return alert("Verify email first");
    try {
      await shubukan_api.post(`/blog/${blog._id}/like`, {}, getAuthHeaders());
      setLiked(true);
      setDisliked(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error liking blog");
    }
  }

  // 🔹 Dislike
  async function toggleDislike() {
    if (!verifiedEmail) return alert("Verify email first");
    try {
      await shubukan_api.post(
        `/blog/${blog._id}/dislike`,
        {},
        getAuthHeaders()
      );
      setDisliked(true);
      setLiked(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error disliking blog");
    }
  }

  // 🔹 Comments
  async function postComment() {
    if (!verifiedEmail) return alert("Verify email first");
    if (!commentText.trim()) return;

    try {
      const res = await shubukan_api.post(
        `/blog/${blog._id}/comment`,
        {
          text: commentText.trim(),
          name: verifiedEmail, // 👈 use verified email as identifier
          avatar: null, // optional
        },
        getAuthHeaders()
      );

      // API currently returns all comments, not just new one
      setComments(res.data);

      setCommentText("");
    } catch (err) {
      alert(err.response?.data?.message || "Error posting comment");
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem("verified_email");
    if (savedEmail) {
      setVerifiedEmail(savedEmail);
    }
  }, []);

  function EmailOtpBox() {
    return (
      <div className="p-3 border rounded mb-4">
        <div className="flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
    );
  }

  // useEffect(() => {
  //   // load like/dislike from localStorage
  //   const likeKey = `like_${slug}`;
  //   const dislikeKey = `dislike_${slug}`;
  //   setLiked(localStorage.getItem(likeKey) === "1");
  //   setDisliked(localStorage.getItem(dislikeKey) === "1");

  //   // load comments from localStorage
  //   const stored = localStorage.getItem("blog_comments_v1");
  //   if (stored) setComments(JSON.parse(stored));

  //   // load verified email
  //   const storedEmail = localStorage.getItem("verified_email");
  //   if (storedEmail) setVerifiedEmail(storedEmail);
  // }, [slug]);

  // useEffect(() => {
  //   if (verifiedEmail) {
  //     localStorage.setItem("verified_email", verifiedEmail);
  //   } else {
  //     localStorage.removeItem("verified_email");
  //   }
  // }, [verifiedEmail]);

  // useEffect(() => {
  //   // persist comments
  //   localStorage.setItem("blog_comments_v1", JSON.stringify(comments));
  // }, [comments]);

  // // const blog = useMemo(() => blog.find((b) => b.slug === slug), [blog, slug]);

  // // previous / next
  // const index = blog ? blog.findIndex((b) => b.slug === blog.slug) : -1;
  // const prev = index > 0 ? blog[index - 1] : null;
  // const next = index >= 0 && index < blog.length - 1 ? blog[index + 1] : null;

  // // related by tag (simple)
  // const related = blog
  //   ? blog
  //       .filter(
  //         (b) =>
  //           b.slug !== blog.slug && b.tags.some((t) => blog.tags.includes(t))
  //       )
  //       .slice(0, 3)
  //   : [];

  // function onSearch(e) {
  //   e.preventDefault();
  //   // filter blog by title or tags
  //   const q = query.trim().toLowerCase();
  //   if (!q) return setBlog(blogPosts);
  //   const filtered = blogPosts.filter(
  //     (b) =>
  //       b.title.toLowerCase().includes(q) ||
  //       b.tags.join(" ").toLowerCase().includes(q)
  //   );
  //   setBlog(filtered);
  // }

  // function requireVerification(action) {
  //   if (!verifiedEmail) {
  //     alert("Please verify your email before you can " + action);
  //     return false;
  //   }
  //   return true;
  // }

  // function toggleLike() {
  //   if (!requireVerification("like")) return;
  //   const likeKey = `like_${slug}`;
  //   const dislikeKey = `dislike_${slug}`;
  //   if (liked) {
  //     setLiked(false);
  //     localStorage.removeItem(likeKey);
  //   } else {
  //     setLiked(true);
  //     setDisliked(false);
  //     localStorage.setItem(likeKey, "1");
  //     localStorage.removeItem(dislikeKey);
  //   }
  // }

  // function toggleDislike() {
  //   if (!requireVerification("dislike")) return;
  //   const likeKey = `like_${slug}`;
  //   const dislikeKey = `dislike_${slug}`;
  //   if (disliked) {
  //     setDisliked(false);
  //     localStorage.removeItem(dislikeKey);
  //   } else {
  //     setDisliked(true);
  //     setLiked(false);
  //     localStorage.setItem(dislikeKey, "1");
  //     localStorage.removeItem(likeKey);
  //   }
  // }

  // function sendOtp() {
  //   if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
  //     return alert("Enter a valid email");
  //   // dummy OTP flow: generate 4-digit code and store in sessionStorage
  //   const code = String(Math.floor(1000 + Math.random() * 9000));
  //   sessionStorage.setItem(`otp_for_${email}`, code);
  //   setOtpSent(true);
  //   alert(
  //     `(Dummy) OTP sent to ${email}: ${code} — enter this to verify (in real app you will send email).`
  //   );
  // }

  // function verifyOtp() {
  //   const code = sessionStorage.getItem(`otp_for_${email}`);
  //   if (code && otpInput === code) {
  //     setVerifiedEmail(email);
  //     setOtpSent(false);
  //     setOtpInput("");
  //     sessionStorage.removeItem(`otp_for_${email}`);
  //     alert("Email verified (dummy)");
  //   } else {
  //     alert("Invalid OTP");
  //   }
  // }

  // function postComment() {
  //   if (!verifiedEmail)
  //     return alert("Please verify your email before commenting");
  //   if (!commentText.trim()) return;
  //   const newComment = {
  //     email: verifiedEmail,
  //     text: commentText.trim(),
  //     date: new Date().toISOString(),
  //   };
  //   setComments((prev) => {
  //     const next = { ...prev };
  //     next[slug] = next[slug] ? [newComment, ...next[slug]] : [newComment];
  //     return next;
  //   });
  //   setCommentText("");
  // }

  function copyLink() {
    const link = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard");
  }

  if (!blog) {
    return (
      <div className="BlogPost">
        <div className="BlogPostPage flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    // <div className="max-w-4xl mx-auto px-5 py-10">
    <div className="BlogPost">
      <div className="BlogPostPage">
        {/* search bar */}
        {/* <form onSubmit={onSearch} className="flex gap-2 mb-6">
          <button
            className="sm:flex hidden px-4 py-2 rounded bg-gray-200"
            onClick={() => router.push("/blog")}
          >
            Back to Blog
          </button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog by title or tag..."
            className="flex-1 p-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Search
          </button>
          <button
            type="button"
            className="sm:flex hidden px-4 py-2 bg-gray-200 rounded"
            onClick={() => {
              setQuery("");
              setBlog(blogPosts);
            }}
          >
            Reset
          </button>
        </form> */}

        {/* Cover Image */}
        <div className="relative w-full md:h-[400px] h-auto aspect-video md:aspect-auto mb-8">
          <Image
            src={blog.coverImage.url}
            alt={blog.coverImage.altText}
            fill
            className="aspect-video object-cover rounded-2xl shadow"
          />
          {blog.isFeatured && (
            <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              Featured
            </span>
          )}
        </div>

        {/* Title & Meta */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{blog.title}</h1>
        <p className="text-gray-600 mb-2">{blog.subtitle}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <span>{new Date(blog.publishedDate).toDateString()}</span>
          <span>· {blog.estimatedReadTime} min read</span>
          <span>· {blog.viewCount} views</span>
          <span>· {blog.likeCount} likes</span>
        </div>

        {/* Author */}
        {blog.authors?.map((author, idx) => (
          <div key={idx} className="flex items-center gap-3 mb-8">
            <Image
              src={author.avatarImage}
              alt={author.name}
              width={50}
              height={50}
              className="rounded-full aspect-square object-cover shadow-sm"
            />
            <div>
              <p className="font-semibold">{author.name}</p>
              <p className="text-sm text-gray-500">{author.title}</p>
            </div>
          </div>
        ))}

        {/* Sections */}
        <div className="prose max-w-none">
          {blog.sections?.map((section, idx) => (
            <div
              key={idx}
              className={`mb-12 ${
                section.layout === "full-width"
                  ? "w-full"
                  : section.layout === "two-column"
                  ? "md:grid md:grid-cols-2 md:gap-8"
                  : section.layout === "sidebar-right"
                  ? "md:grid md:grid-cols-3 md:gap-8"
                  : section.layout === "sidebar-left"
                  ? "md:grid md:grid-cols-3 md:gap-8"
                  : ""
              }`}
            >
              {section.title && (
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    section.layout === "two-column" ||
                    section.layout === "sidebar-right" ||
                    section.layout === "sidebar-left"
                      ? "md:col-span-full"
                      : ""
                  }`}
                >
                  {section.title}
                </h2>
              )}

              {section.subtitle && (
                <h3
                  className={`text-xl text-gray-700 mb-4 ${
                    section.layout === "two-column" ||
                    section.layout === "sidebar-right" ||
                    section.layout === "sidebar-left"
                      ? "md:col-span-full"
                      : ""
                  }`}
                >
                  {section.subtitle}
                </h3>
              )}

              {section.layout === "sidebar-left" ? (
                <>
                  <div className="md:col-span-1 bg-gray-50 p-4 rounded">
                    {/* Sidebar content - typically additional info */}
                    <h4 className="font-medium mb-3">Key Points</h4>
                    <ul className="list-disc pl-5">
                      {section.contentBlocks
                        .filter((block) => block.type === "list")
                        .flatMap((block) => block.listItems)
                        .map((item, i) => (
                          <li key={i} className="mb-2 text-sm text-gray-700">
                            {item}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="md:col-span-2">
                    {section.contentBlocks.map((block, bIdx) => {
                      switch (block.type) {
                        case "text":
                          return (
                            <p
                              key={bIdx}
                              className="mb-4 text-gray-800 leading-relaxed"
                            >
                              {block.text}
                            </p>
                          );
                        case "image":
                          return (
                            <div key={bIdx} className="my-6">
                              <Image
                                src={block.mediaUrl}
                                alt={block.altText}
                                width={800}
                                height={450}
                                className="rounded-xl"
                              />
                              {block.caption && (
                                <p className="text-sm text-gray-500 mt-2">
                                  {block.caption}
                                </p>
                              )}
                            </div>
                          );
                        case "quote":
                          return (
                            <blockquote
                              key={bIdx}
                              className="border-l-4 border-red-600 pl-4 italic my-6 text-gray-700"
                            >
                              {block.text}
                              {block.caption && (
                                <footer className="mt-2 text-sm text-gray-500">
                                  — {block.caption}
                                </footer>
                              )}
                            </blockquote>
                          );
                        case "callout":
                          return (
                            <div
                              key={bIdx}
                              className={`p-4 my-6 rounded-xl bg-blue-50 border-l-4 border-blue-400`}
                            >
                              <p className="text-gray-700">{block.text}</p>
                            </div>
                          );
                        case "list":
                          return null; // Lists are handled in sidebar for this layout
                        default:
                          return null;
                      }
                    })}
                  </div>
                </>
              ) : section.layout === "sidebar-right" ? (
                <>
                  <div className="md:col-span-2">
                    {section.contentBlocks
                      .filter((block) => block.type !== "callout")
                      .map((block, bIdx) => {
                        switch (block.type) {
                          case "text":
                            return (
                              <p
                                key={bIdx}
                                className="mb-4 text-gray-800 leading-relaxed"
                              >
                                {block.text}
                              </p>
                            );
                          case "image":
                            return (
                              <div key={bIdx} className="my-6">
                                <Image
                                  src={block.mediaUrl}
                                  alt={block.altText}
                                  width={800}
                                  height={450}
                                  className="rounded-xl"
                                />
                                {block.caption && (
                                  <p className="text-sm text-gray-500 mt-2">
                                    {block.caption}
                                  </p>
                                )}
                              </div>
                            );
                          case "quote":
                            return (
                              <blockquote
                                key={bIdx}
                                className="border-l-4 border-red-600 pl-4 italic my-6 text-gray-700"
                              >
                                {block.text}
                                {block.caption && (
                                  <footer className="mt-2 text-sm text-gray-500">
                                    — {block.caption}
                                  </footer>
                                )}
                              </blockquote>
                            );
                          case "list":
                            return block.listType === "bullet" ? (
                              <ul key={bIdx} className="list-disc ml-6 mb-4">
                                {block.listItems.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <ol key={bIdx} className="list-decimal ml-6 mb-4">
                                {block.listItems.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ol>
                            );
                          default:
                            return null;
                        }
                      })}
                  </div>
                  {/* <div className="md:col-span-1 bg-gray-50 p-4 rounded">
                    <h4 className="font-medium mb-3">Additional Information</h4>
                    {section.contentBlocks
                      .filter((block) => block.type === "callout")
                      .map((block, bIdx) => (
                        <div
                          key={bIdx}
                          className={`p-4 my-6 rounded-xl bg-blue-50 border-l-4 border-blue-400`}
                        >
                          <p className="text-gray-700">{block.text}</p>
                        </div>
                      ))}
                  </div> */}
                </>
              ) : (
                section.contentBlocks.map((block, bIdx) => {
                  switch (block.type) {
                    case "text":
                      return (
                        <p
                          key={bIdx}
                          className="mb-4 text-gray-800 leading-relaxed"
                        >
                          {block.text}
                        </p>
                      );
                    case "image":
                      return (
                        <div key={bIdx} className="my-6">
                          <Image
                            src={block.mediaUrl}
                            alt={block.altText}
                            width={800}
                            height={450}
                            className="rounded-xl"
                          />
                          {block.caption && (
                            <p className="text-sm text-gray-500 mt-2">
                              {block.caption}
                            </p>
                          )}
                        </div>
                      );
                    case "quote":
                      return (
                        <blockquote
                          key={bIdx}
                          className="border-l-4 border-red-600 pl-4 italic my-6 text-gray-700"
                        >
                          {block.text}
                          {block.caption && (
                            <footer className="mt-2 text-sm text-gray-500">
                              — {block.caption}
                            </footer>
                          )}
                        </blockquote>
                      );
                    case "callout":
                      return (
                        <div
                          key={bIdx}
                          className={`p-4 my-6 rounded-xl bg-blue-50 border-l-4 border-blue-400`}
                        >
                          <p className="text-gray-700">{block.text}</p>
                        </div>
                      );
                    case "list":
                      return block.listType === "bullet" ? (
                        <ul key={bIdx} className="list-disc ml-6 mb-4">
                          {block.listItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <ol key={bIdx} className="list-decimal ml-6 mb-4">
                          {block.listItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      );
                    default:
                      return null;
                  }
                })
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap gap-2">
          {blog.tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 text-gray-700 shadow-sm px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* actions: share, like/dislike */}
        <div className="flex flex-col gap-3 my-6">
          {/* {!verifiedEmail && <EmailOtpBox />} */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowShare(true)}
              className="px-4 py-2 border rounded"
            >
              Share
            </button>
            {/* <button
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
            </button> */}
          </div>
        </div>

        {/* prev / next */}
        {/* <div className="flex justify-between mt-8">
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
        </div> */}

        {/* related */}
        {/* {related.length > 0 && (
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
        )} */}

        {/* comments */}
        {/* <section className="mt-8">
          <h3 className="font-bold">Comments</h3>
          <div className="mt-3">
            {!verifiedEmail && <EmailOtpBox />}

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
        </section> */}

        {/* ✅ OTP verification */}
        {!verifiedEmail && <EmailOtpBox />}

        {/* ✅ Like / Dislike */}
        <div className="flex gap-3 my-4">
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

        {/* ✅ Comments */}
        <section className="mt-8">
          <h3 className="font-bold">Comments</h3>
          {verifiedEmail && (
            <div className="p-3 border rounded mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full p-2 mt-2 border rounded"
                placeholder="Write your comment..."
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={postComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Post comment
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("verified_email");
                    localStorage.removeItem("email_token");
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

          {/* Comment list */}
          <div className="flex flex-col gap-3">
            {comments.length > 0 &&
              comments.map((c, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <div className="text-sm text-gray-600">
                    {c.name} •{" "}
                    <p className="text-xs text-gray-400">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : ""}
                    </p>
                  </div>
                  <div className="mt-1">{c.text}</div>
                </div>
              ))}
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
