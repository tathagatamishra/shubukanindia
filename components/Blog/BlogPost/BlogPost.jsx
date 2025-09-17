//components/Blog/BlogPost/BlogPost.jsx
"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import Image from "next/image";
import "./BlogPost.scss";
import { IoClose } from "react-icons/io5";
import { useUI } from "@/components/Context/UIContext";

export default function BlogPost({ blog }) {
  // states
  const { setIsModalOpen } = useUI();
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
  const [likes, setLikes] = useState([]);

  // get Like/Dislike/Comments
  async function getComments() {
    try {
      const res = await shubukan_api.get(`/blog/comment/${blog.slug}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      return [];
    }
  }
  async function getLikes() {
    try {
      const res = await shubukan_api.get(`/blog/like/${blog.slug}`);
      setLikes(res.data.likes);
    } catch (error) {
      console.error("Error fetching blog:", error);
      return [];
    }
  }

  // restore email from localStorage
  useEffect(() => {
    // get data
    getComments();
    getLikes();

    // get email
    const savedEmail = localStorage.getItem("verified_email");
    if (savedEmail) setVerifiedEmail(savedEmail);
  }, []);

  // auth headers helper
  function getAuthHeaders() {
    return {
      headers: {
        "x-email": localStorage.getItem("verified_email"),
        "x-email-token": localStorage.getItem("email_token"),
      },
    };
  }

  // OTP APIs
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

  // Like API
  async function toggleLike() {
    if (!verifiedEmail) return alert("Verify email first");
    try {
      await shubukan_api.post(`/blog/like/${blog.slug}`, {}, getAuthHeaders());
      setLiked(true);
      setDisliked(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error liking blog");
    }
  }

  // Dislike API
  async function toggleDislike() {
    if (!verifiedEmail) return alert("Verify email first");
    try {
      await shubukan_api.post(
        `/blog/dislike/${blog.slug}`,
        {},
        getAuthHeaders()
      );
      setDisliked(true);
      setLiked(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error disliking blog");
    }
  }

  // Comment API
  async function postComment() {
    if (!verifiedEmail) return alert("Verify email first");
    if (!commentText.trim()) return;

    try {
      const res = await shubukan_api.post(
        `/blog/comment/${blog.slug}`,
        {
          text: commentText.trim(),
          name: verifiedEmail,
          avatar: null,
        },
        getAuthHeaders()
      );

      getComments();
      setCommentText("");
    } catch (err) {
      alert(err.response?.data?.message || "Error posting comment");
    }
  }

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

  function copyLink() {
    const link = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard");
  }

  if (!blog) {
    return (
      <main className="BlogPost">
        <div className="BlogPostPage flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-[3px] border-[#A64B37]"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="BlogPost">
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
            className="aspect-video object-cover rounded-2xl border-t-[2px] border-[#fff] shadow-sm"
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
          <span>· {likes} likes</span>
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
        <div className="share flex flex-col gap-3 mt-6">
          {/* {!verifiedEmail && <EmailOtpBox />} */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowShare(true);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 border rounded"
            >
              Share
            </button>
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

        {/* ✅ OTP verification */}
        {!verifiedEmail && (
          <div className="verify mb-4 pb-4">
            <h3 className="label" htmlFor="email">Verify to Like and Comment</h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 p-2 border rounded"
                required
              />
              <button
                onClick={sendOtp}
                className="px-4 py-2"
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
                  className="px-3 py-2"
                >
                  Verify
                </button>
              </div>
            )}
          </div>
        )}

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
        <section className="mt-8 min-h-full">
          <h3 className="label">{comments.length} Comments</h3>
          {verifiedEmail && (
            <div className="comment-input pb-3 mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full p-2 mt-2 border rounded"
                placeholder="Write your comment..."
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    localStorage.removeItem("verified_email");
                    localStorage.removeItem("email_token");
                    setVerifiedEmail(null);
                    setEmail("");
                  }}
                  className="px-4 py-2"
                >
                  Sign out
                </button>

                <button
                  onClick={postComment}
                  className="px-4 py-2"
                >
                  Post comment
                </button>
              </div>
            </div>
          )}

          {/* Comment list */}
          <div className="flex flex-col gap-3">
            {comments.length > 0 &&
              comments.map((c, idx) => (
                <div key={idx} className="comment-card p-3">
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
          <>
            <div className="menuBG2"></div>
            <div
              className="menuBG3"
              onClick={() => {
                setShowShare(false);
                setIsModalOpen(false);
              }}
            ></div>

            <div className="share-modal">
              <h3 className="share-content">Share this post</h3>

              <div className="inputBox share-content flex gap-2">
                <input
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? window.location.href.split("//")[1]
                      : ""
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button onClick={copyLink} className="px-3 py-2 border rounded">
                  Copy
                </button>
              </div>

              <button className="crossBtn">
                <IoClose
                  className="icon"
                  onClick={() => {
                    setShowShare(false);
                    setIsModalOpen(false);
                  }}
                />
              </button>
            </div>
          </>
        )}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="0"
        width="0"
      >
        <defs>
          <filter id="wobble">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".06"
              numOctaves="4"
            />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>
    </main>
  );
}
