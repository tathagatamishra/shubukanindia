// components/AdminPanel/BlogManager.jsx
"use client";
import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiChevronUp,
  FiChevronDown,
  FiUpload,
  FiImage,
} from "react-icons/fi";
import axios from "axios";
import { shubukan_api } from "@/config";

/**
 * Upload helper: requests signature from backend then uploads to Cloudinary.
 * Ensure backend getCloudBlogSignature uses folder: "Shubukan/Blog"
 */
async function uploadToCloudinary(file, token) {
  if (!file) return null;
  // request signature from backend
  const { data: sig } = await shubukan_api.post(
    "/blog/signature",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", sig.timestamp);
  fd.append("signature", sig.signature);
  fd.append("folder", "Shubukan/Blog");

  const resp = await axios.post(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    fd
  );
  return resp.data.secure_url;
}

/** Utility: estimate read time based on word count (200 wpm) */
function estimateReadTimeFromText(text = "", sections = []) {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  // include section text blocks words
  let sectionWords = 0;
  for (const s of sections) {
    if (s.contentBlocks && Array.isArray(s.contentBlocks)) {
      for (const b of s.contentBlocks) {
        if (b.type === "text" || b.type === "callout" || b.type === "quote") {
          sectionWords += (b.text || "").split(/\s+/).filter(Boolean).length;
        } else if (b.type === "list") {
          sectionWords += (b.listItems || [])
            .join(" ")
            .split(/\s+/)
            .filter(Boolean).length;
        }
      }
    }
  }
  const totalWords = words + sectionWords;
  return Math.max(1, Math.ceil(totalWords / 200));
}

/** Initial empty block factories */
const newTextBlock = () => ({ type: "text", order: 1, text: "" });
const newImageBlock = () => ({
  type: "image",
  order: 1,
  mediaUrl: "",
  caption: "",
  altText: "",
});
const newListBlock = () => ({
  type: "list",
  order: 1,
  listType: "bullet",
  listItems: [],
});
const newCalloutBlock = () => ({
  type: "callout",
  order: 1,
  text: "",
  calloutStyle: "info",
});
const newQuoteBlock = () => ({ type: "quote", order: 1, text: "" });

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    slug: "",
    summary: "",
    shortNote: "",
    category: { primary: "", secondary: [] },
    tags: [],
    coverImage: { url: "", caption: "", altText: "", credit: "" },
    thumbnailImage: { url: "", altText: "" },
    authors: [],
    sections: [],
    status: "draft",
    visibility: "public",
    layout: "longform",
    estimatedReadTime: 0,
    publishedDate: null,
  });

  const [tempCoverFile, setTempCoverFile] = useState(null);
  const [tempThumbnailFile, setTempThumbnailFile] = useState(null);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  /** ---------- Fetch blogs ---------- */
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await shubukan_api.get("/blogs?limit=50");
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /** ---------- Helpers to update nested form ---------- */
  const setField = (path, value) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const addTag = (tag) => {
    const t = tag.trim();
    if (!t) return;
    if (!form.tags.includes(t))
      setForm((p) => ({ ...p, tags: [...p.tags, t] }));
  };
  const removeTag = (tag) =>
    setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

  /** ---------- Authors ---------- */
  const addAuthor = () => {
    setForm((p) => ({
      ...p,
      authors: [
        ...p.authors,
        {
          name: "",
          title: "",
          biography: "",
          avatarImage: "",
          socialMedia: { twitter: "", linkedin: "" },
        },
      ],
    }));
  };
  const updateAuthor = (index, patch) => {
    setForm((prev) => {
      const next = { ...prev, authors: [...prev.authors] };
      next.authors[index] = { ...next.authors[index], ...patch };
      return next;
    });
  };
  const removeAuthor = (index) =>
    setForm((p) => ({
      ...p,
      authors: p.authors.filter((_, i) => i !== index),
    }));

  async function uploadAuthorAvatar(file, index) {
    try {
      const token = localStorage.getItem("adminToken");
      const url = await uploadToCloudinary(file, token);
      updateAuthor(index, { avatarImage: url });
    } catch (err) {
      console.error("Author avatar upload failed", err);
      setError("Author avatar upload failed");
    }
  }

  /** ---------- Sections & Blocks ---------- */
  const addSection = () => {
    const s = {
      title: "",
      subtitle: "",
      layout: "full-width",
      order: form.sections.length + 1,
      contentBlocks: [],
    };
    setForm((p) => ({ ...p, sections: [...p.sections, s] }));
  };

  const updateSection = (idx, patch) => {
    setForm((prev) => {
      const next = { ...prev, sections: [...prev.sections] };
      next.sections[idx] = { ...next.sections[idx], ...patch };
      return next;
    });
  };

  const removeSection = (idx) => {
    setForm((p) => {
      const nextSections = p.sections
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, order: i + 1 }));
      return { ...p, sections: nextSections };
    });
  };

  const moveSection = (idx, dir) => {
    setForm((prev) => {
      const arr = [...prev.sections];
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return { ...prev, sections: arr.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  };

  const addBlock = (sectionIdx, type) => {
    const block =
      type === "text"
        ? newTextBlock()
        : type === "image"
        ? newImageBlock()
        : type === "list"
        ? newListBlock()
        : type === "callout"
        ? newCalloutBlock()
        : type === "quote"
        ? newQuoteBlock()
        : newTextBlock();

    setForm((prev) => {
      const copy = { ...prev, sections: [...prev.sections] };
      const s = { ...copy.sections[sectionIdx] };
      s.contentBlocks = [
        ...(s.contentBlocks || []),
        { ...block, order: (s.contentBlocks?.length || 0) + 1 },
      ];
      copy.sections[sectionIdx] = s;
      return copy;
    });
  };

  const updateBlock = (sectionIdx, blockIdx, patch) => {
    setForm((prev) => {
      const copy = { ...prev, sections: [...prev.sections] };
      const s = { ...copy.sections[sectionIdx] };
      s.contentBlocks = [...s.contentBlocks];
      s.contentBlocks[blockIdx] = { ...s.contentBlocks[blockIdx], ...patch };
      copy.sections[sectionIdx] = s;
      return copy;
    });
  };

  const removeBlock = (sectionIdx, blockIdx) => {
    setForm((prev) => {
      const copy = { ...prev, sections: [...prev.sections] };
      const s = { ...copy.sections[sectionIdx] };
      s.contentBlocks = s.contentBlocks
        .filter((_, i) => i !== blockIdx)
        .map((b, i) => ({ ...b, order: i + 1 }));
      copy.sections[sectionIdx] = s;
      return copy;
    });
  };

  const moveBlock = (sectionIdx, blockIdx, dir) => {
    setForm((prev) => {
      const copy = { ...prev, sections: [...prev.sections] };
      const s = { ...copy.sections[sectionIdx] };
      const arr = [...s.contentBlocks];
      const swapIdx = dir === "up" ? blockIdx - 1 : blockIdx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[blockIdx], arr[swapIdx]] = [arr[swapIdx], arr[blockIdx]];
      s.contentBlocks = arr.map((b, i) => ({ ...b, order: i + 1 }));
      copy.sections[sectionIdx] = s;
      return copy;
    });
  };

  async function uploadBlockImage(sectionIdx, blockIdx, file) {
    try {
      const token = localStorage.getItem("adminToken");
      const url = await uploadToCloudinary(file, token);
      updateBlock(sectionIdx, blockIdx, { mediaUrl: url });
    } catch (err) {
      console.error("Block image upload failed", err);
      setError("Block image upload failed");
    }
  }

  /** ---------- Media (cover / thumbnail) ---------- */
  const onCoverSelected = (file) => {
    setTempCoverFile(file);
    setForm((p) => ({
      ...p,
      coverImage: {
        ...p.coverImage,
        url: file ? URL.createObjectURL(file) : "",
      },
    }));
  };
  const onThumbnailSelected = (file) => {
    setTempThumbnailFile(file);
    setForm((p) => ({
      ...p,
      thumbnailImage: {
        ...p.thumbnailImage,
        url: file ? URL.createObjectURL(file) : "",
      },
    }));
  };

  /** ---------- Open editor for new / edit ---------- */
  const openNew = () => {
    setEditing(null);
    setForm({
      title: "",
      subtitle: "",
      slug: "",
      summary: "",
      shortNote: "",
      category: { primary: "", secondary: [] },
      tags: [],
      coverImage: { url: "", caption: "", altText: "", credit: "" },
      thumbnailImage: { url: "", altText: "" },
      authors: [],
      sections: [],
      status: "draft",
      visibility: "public",
      layout: "longform",
      estimatedReadTime: 0,
      publishedDate: null,
    });
    setTempCoverFile(null);
    setTempThumbnailFile(null);
    setError("");
    setEditorOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    // Map server data into form
    setForm({
      title: b.title || "",
      subtitle: b.subtitle || "",
      slug: b.slug || "",
      summary: b.summary || "",
      shortNote: b.shortNote || "",
      category: b.category || { primary: "", secondary: [] },
      tags: b.tags || [],
      coverImage: b.coverImage || {
        url: "",
        caption: "",
        altText: "",
        credit: "",
      },
      thumbnailImage: b.thumbnailImage || { url: "", altText: "" },
      authors: b.authors || [],
      sections: (b.sections || []).map((s) => ({
        ...s,
        contentBlocks: (s.contentBlocks || []).map((cb) => ({ ...cb })),
      })),
      status: b.status || "draft",
      visibility: b.visibility || "public",
      layout: b.layout || "longform",
      estimatedReadTime: b.estimatedReadTime || 0,
      publishedDate: b.publishedDate
        ? new Date(b.publishedDate).toISOString().slice(0, 16)
        : null,
    });
    setTempCoverFile(null);
    setTempThumbnailFile(null);
    setError("");
    setEditorOpen(true);
  };

  /** ---------- Save blog (create or update) ---------- */
  const saveBlog = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin token missing. Please login.");

      // Upload cover/thumbnail if new file selected (tempFile holds File object)
      let coverUrl = form.coverImage?.url || "";
      let thumbUrl = form.thumbnailImage?.url || "";

      if (tempCoverFile) {
        coverUrl = await uploadToCloudinary(tempCoverFile, token);
      }
      if (tempThumbnailFile) {
        thumbUrl = await uploadToCloudinary(tempThumbnailFile, token);
      }

      // Recalculate estimatedReadTime if 0
      const estimated =
        form.estimatedReadTime ||
        estimateReadTimeFromText(form.summary, form.sections);

      // Prepare payload matching backend schema
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        slug: form.slug,
        summary: form.summary,
        shortNote: form.shortNote,
        category: {
          primary: form.category.primary,
          secondary: form.category.secondary || [],
        },
        tags: form.tags || [],
        coverImage: {
          url: coverUrl,
          caption: form.coverImage.caption,
          altText: form.coverImage.altText,
          credit: form.coverImage.credit,
        },
        thumbnailImage: { url: thumbUrl, altText: form.thumbnailImage.altText },
        authors: (form.authors || []).map((a) => ({
          name: a.name,
          title: a.title,
          biography: a.biography,
          avatarImage: a.avatarImage,
          socialMedia: a.socialMedia || {},
        })),
        sections: (form.sections || []).map((s) => ({
          title: s.title,
          subtitle: s.subtitle,
          layout: s.layout,
          order: s.order,
          contentBlocks: (s.contentBlocks || []).map((cb) => {
            const common = { type: cb.type, order: cb.order };
            if (cb.type === "text")
              return {
                ...common,
                text: cb.text,
                listItems: cb.listItems || [],
              };
            if (cb.type === "image")
              return {
                ...common,
                mediaUrl: cb.mediaUrl,
                caption: cb.caption,
                altText: cb.altText,
              };
            if (cb.type === "list")
              return {
                ...common,
                listType: cb.listType,
                listItems: cb.listItems || [],
              };
            if (cb.type === "callout")
              return {
                ...common,
                text: cb.text,
                calloutStyle: cb.calloutStyle,
              };
            if (cb.type === "quote") return { ...common, text: cb.text };
            return { ...common, text: cb.text || "" };
          }),
        })),
        status: form.status,
        visibility: form.visibility,
        layout: form.layout,
        estimatedReadTime: estimated,
        publishedDate: form.publishedDate
          ? new Date(form.publishedDate).toISOString()
          : undefined,
      };

      if (editing && editing._id) {
        await shubukan_api.put(`/blog/${editing._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await shubukan_api.post("/blog", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setEditorOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error("Save blog error:", err);
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Delete actions ---------- */
  const permaDelete = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await shubukan_api.delete(`/blog/perma/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Small UI components inline for clarity ---------- */

  const TagInput = () => {
    const [t, setT] = useState("");
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 text-xs">
                x
              </button>
            </span>
          ))}
        </div>
        <input
          placeholder="Add tag and press Enter"
          value={t}
          onChange={(e) => setT(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(t);
              setT("");
            }
          }}
          className="border p-2 rounded flex-1"
        />
      </div>
    );
  };

  const AuthorEditor = ({ author, index }) => {
    return (
      <div className="border rounded p-3 mb-3 bg-white">
        <div className="flex justify-between items-start">
          <div className="font-semibold">Author #{index + 1}</div>
          <div className="flex gap-2">
            <button
              onClick={() => removeAuthor(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <input
            value={author.name}
            onChange={(e) => updateAuthor(index, { name: e.target.value })}
            placeholder="Name"
            className="border p-2 rounded"
          />
          <input
            value={author.title}
            onChange={(e) => updateAuthor(index, { title: e.target.value })}
            placeholder="Title"
            className="border p-2 rounded"
          />
          <input
            value={author.socialMedia?.twitter || ""}
            onChange={(e) =>
              updateAuthor(index, {
                socialMedia: { ...author.socialMedia, twitter: e.target.value },
              })
            }
            placeholder="Twitter URL"
            className="border p-2 rounded col-span-1 md:col-span-2"
          />
          <input
            value={author.socialMedia?.linkedin || ""}
            onChange={(e) =>
              updateAuthor(index, {
                socialMedia: {
                  ...author.socialMedia,
                  linkedin: e.target.value,
                },
              })
            }
            placeholder="LinkedIn URL"
            className="border p-2 rounded col-span-1 md:col-span-2"
          />
          <textarea
            value={author.biography}
            onChange={(e) => updateAuthor(index, { biography: e.target.value })}
            placeholder="Biography"
            className="border p-2 rounded md:col-span-2"
          />
          <div className="flex items-center gap-2">
            <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {author.avatarImage ? (
                <img
                  src={author.avatarImage}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : (
                <FiImage />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadAuthorAvatar(e.target.files?.[0], index)}
            />
          </div>
        </div>
      </div>
    );
  };

  const BlockEditor = ({ sectionIdx, block, blockIdx }) => {
    return (
      <div className="border rounded p-3 mb-2 bg-white">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="font-medium">{block.type.toUpperCase()} Block</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveBlock(sectionIdx, blockIdx, "up")}
              title="Move up"
            >
              <FiChevronUp />
            </button>
            <button
              onClick={() => moveBlock(sectionIdx, blockIdx, "down")}
              title="Move down"
            >
              <FiChevronDown />
            </button>
            <button
              onClick={() => removeBlock(sectionIdx, blockIdx)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Render inputs based on block type */}
        {block.type === "text" && (
          <>
            <textarea
              value={block.text || ""}
              onChange={(e) =>
                updateBlock(sectionIdx, blockIdx, { text: e.target.value })
              }
              placeholder="Paragraph text"
              className="border p-2 rounded w-full h-24"
            />
          </>
        )}

        {block.type === "image" && (
          <>
            <div className="flex gap-2 items-center">
              <div className="h-28 w-28 bg-gray-100 rounded overflow-hidden">
                {block.mediaUrl ? (
                  <img
                    src={block.mediaUrl}
                    className="w-full h-full object-cover"
                    alt="block"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {/* File upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    uploadBlockImage(sectionIdx, blockIdx, e.target.files?.[0])
                  }
                />

                {/* OR direct link */}
                <input
                  type="text"
                  value={block.mediaUrl || ""}
                  onChange={(e) =>
                    updateBlock(sectionIdx, blockIdx, {
                      mediaUrl: e.target.value,
                    })
                  }
                  placeholder="Or paste image URL here"
                  className="border p-2 rounded"
                />

                <input
                  value={block.caption || ""}
                  onChange={(e) =>
                    updateBlock(sectionIdx, blockIdx, {
                      caption: e.target.value,
                    })
                  }
                  placeholder="Caption"
                  className="border p-2 rounded"
                />
                <input
                  value={block.altText || ""}
                  onChange={(e) =>
                    updateBlock(sectionIdx, blockIdx, {
                      altText: e.target.value,
                    })
                  }
                  placeholder="Alt text"
                  className="border p-2 rounded"
                />
              </div>
            </div>
          </>
        )}

        {block.type === "list" && (
          <>
            <div className="flex gap-2 items-center mb-2">
              <label className="text-sm">Type</label>
              <select
                value={block.listType || "bullet"}
                onChange={(e) =>
                  updateBlock(sectionIdx, blockIdx, {
                    listType: e.target.value,
                  })
                }
                className="border p-2 rounded"
              >
                <option value="bullet">Bullet</option>
                <option value="number">Number</option>
              </select>
            </div>
            <div className="space-y-2">
              {(block.listItems || []).map((li, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={li}
                    onChange={(e) => {
                      const arr = [...(block.listItems || [])];
                      arr[i] = e.target.value;
                      updateBlock(sectionIdx, blockIdx, { listItems: arr });
                    }}
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    onClick={() => {
                      const arr = [...(block.listItems || [])];
                      arr.splice(i, 1);
                      updateBlock(sectionIdx, blockIdx, { listItems: arr });
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateBlock(sectionIdx, blockIdx, {
                    listItems: [...(block.listItems || []), ""],
                  })
                }
                className="text-sm text-blue-600"
              >
                + Add item
              </button>
            </div>
          </>
        )}

        {block.type === "callout" && (
          <>
            <div className="flex gap-2 items-center mb-2">
              <select
                value={block.calloutStyle || "info"}
                onChange={(e) =>
                  updateBlock(sectionIdx, blockIdx, {
                    calloutStyle: e.target.value,
                  })
                }
                className="border p-2 rounded"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <textarea
              value={block.text || ""}
              onChange={(e) =>
                updateBlock(sectionIdx, blockIdx, { text: e.target.value })
              }
              placeholder="Callout text"
              className="border p-2 rounded w-full h-20"
            />
          </>
        )}

        {block.type === "quote" && (
          <>
            <textarea
              value={block.text || ""}
              onChange={(e) =>
                updateBlock(sectionIdx, blockIdx, { text: e.target.value })
              }
              placeholder="Quote text"
              className="border p-2 rounded w-full h-20"
            />
          </>
        )}
      </div>
    );
  };

  /** ---------- Render ---------- */
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Blogs</h2>
        <div className="flex gap-2">
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg"
          >
            <FiPlus /> New Blog
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="bg-white p-4 rounded-lg shadow-sm flex flex-col"
          >
            <div className="h-40 w-full overflow-hidden rounded-md mb-3">
              {b.coverImage?.url ? (
                <img
                  src={b.coverImage.url}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{b.summary}</p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-500">{b.category?.primary}</div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="text-blue-600">
                  <FiEdit />
                </button>
                <button
                  onClick={() => setDeleteId(b._id)}
                  className="text-red-600"
                  title="Permanent delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this blog? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await permaDelete(deleteId);
                  setDeleteId(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-auto">
          <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-4 overflow-auto max-h-[95vh]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">
                {editing ? "Edit Blog" : "New Blog"}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditorOpen(false);
                  }}
                  className="p-2"
                >
                  <FiX />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left column: Basic + Media + Authors */}
              <div className="col-span-1 space-y-4">
                {/* Basic Info */}
                <div className="border rounded p-3 bg-white">
                  <h4 className="font-semibold mb-2">Basic Info</h4>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Title"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    value={form.subtitle}
                    onChange={(e) => setField("subtitle", e.target.value)}
                    placeholder="Subtitle"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    value={form.slug}
                    onChange={(e) => setField("slug", e.target.value)}
                    placeholder="Slug (unique)"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <textarea
                    value={form.summary}
                    onChange={(e) => setField("summary", e.target.value)}
                    placeholder="Summary"
                    className="border p-2 rounded w-full h-20"
                  />
                  <input
                    value={form.shortNote}
                    onChange={(e) => setField("shortNote", e.target.value)}
                    placeholder="Short note"
                    className="border p-2 rounded w-full mt-2"
                  />

                  <div className="mt-3">
                    <label className="text-sm font-medium">
                      Category (Primary)
                    </label>
                    <input
                      value={form.category.primary}
                      onChange={(e) =>
                        setField("category.primary", e.target.value)
                      }
                      className="border p-2 rounded w-full"
                      placeholder="Primary category"
                    />
                    <label className="text-sm font-medium mt-2 block">
                      Secondary (comma separated)
                    </label>
                    <input
                      value={(form.category.secondary || []).join(", ")}
                      onChange={(e) =>
                        setField(
                          "category.secondary",
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                      className="border p-2 rounded w-full"
                      placeholder="Cat1, Cat2"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-medium">Tags</label>
                    <TagInput />
                  </div>

                  <div className="mt-3 flex gap-2 items-center">
                    <select
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <select
                      value={form.visibility}
                      onChange={(e) => setField("visibility", e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    <input
                      type="datetime-local"
                      value={form.publishedDate || ""}
                      onChange={(e) =>
                        setField("publishedDate", e.target.value)
                      }
                      className="border p-2 rounded flex-1"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="text-sm">
                      Estimated Read Time (minutes)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="0"
                        value={form.estimatedReadTime}
                        onChange={(e) =>
                          setField(
                            "estimatedReadTime",
                            Number(e.target.value || 0)
                          )
                        }
                        className="border p-2 rounded w-24"
                      />
                      <button
                        onClick={() =>
                          setField(
                            "estimatedReadTime",
                            estimateReadTimeFromText(
                              form.summary,
                              form.sections
                            )
                          )
                        }
                        className="text-sm text-blue-600"
                      >
                        Auto-calc
                      </button>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="border rounded p-3 bg-white">
                  <h4 className="font-semibold mb-2">Media</h4>
                  <label className="text-sm block mb-1">Cover image</label>
                  <div className="flex gap-2">
                    <div className="h-28 w-40 bg-gray-100 rounded overflow-hidden">
                      {form.coverImage?.url ? (
                        <img
                          src={form.coverImage.url}
                          className="w-full h-full object-cover"
                          alt="cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {/* File upload */}
                        <div className="border p-2 rounded flex items-center gap-4">
                          <FiUpload />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              onCoverSelected(e.target.files?.[0])
                            }
                          />
                        </div>

                        {/* OR direct link */}
                        <input
                          type="text"
                          value={form.coverImage.url}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              coverImage: {
                                ...p.coverImage,
                                url: e.target.value,
                              },
                            }))
                          }
                          placeholder="Or paste image URL here"
                          className="border p-2 rounded w-full"
                        />
                      </div>

                      <input
                        value={form.coverImage.caption}
                        onChange={(e) =>
                          setField("coverImage.caption", e.target.value)
                        }
                        placeholder="Caption"
                        className="border p-2 rounded w-full mt-2"
                      />
                      <input
                        value={form.coverImage.altText}
                        onChange={(e) =>
                          setField("coverImage.altText", e.target.value)
                        }
                        placeholder="Alt text"
                        className="border p-2 rounded w-full mt-2"
                      />
                      <input
                        value={form.coverImage.credit}
                        onChange={(e) =>
                          setField("coverImage.credit", e.target.value)
                        }
                        placeholder="Credit"
                        className="border p-2 rounded w-full mt-2"
                      />
                    </div>
                  </div>

                  <label className="text-sm block mt-3 mb-1">Thumbnail</label>
                  <div className="flex gap-2 items-start">
                    <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden">
                      {form.thumbnailImage?.url ? (
                        <img
                          src={form.thumbnailImage.url}
                          className="w-full h-full object-cover"
                          alt="thumb"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          No
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* File upload */}
                      <div className="border p-2 rounded flex items-center gap-4">
                        <FiUpload />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            onThumbnailSelected(e.target.files?.[0])
                          }
                        />
                      </div>

                      {/* OR direct link */}
                      <input
                        type="text"
                        value={form.thumbnailImage.url}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            thumbnailImage: {
                              ...p.thumbnailImage,
                              url: e.target.value,
                            },
                          }))
                        }
                        placeholder="Or paste thumbnail URL here"
                        className="border p-2 rounded w-full"
                      />

                      <input
                        value={form.thumbnailImage.altText}
                        onChange={(e) =>
                          setField("thumbnailImage.altText", e.target.value)
                        }
                        placeholder="Alt text"
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Authors */}
                <div className="border rounded p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Authors</h4>
                    <button
                      onClick={addAuthor}
                      className="text-blue-600 flex items-center gap-1"
                    >
                      <FiPlus /> Add
                    </button>
                  </div>
                  <div>
                    {form.authors.length === 0 && (
                      <div className="text-sm text-gray-500">
                        No authors yet
                      </div>
                    )}
                    {form.authors.map((a, i) => (
                      <AuthorEditor key={i} author={a} index={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Sections builder */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Sections</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={addSection}
                      className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
                    >
                      <FiPlus /> Add Section
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {form.sections.length === 0 && (
                    <div className="text-gray-500">
                      No sections yet. Add a section to start composing the
                      article.
                    </div>
                  )}
                  {form.sections.map((sec, si) => (
                    <div key={si} className="border rounded p-3 bg-white">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <input
                            value={sec.title}
                            onChange={(e) =>
                              updateSection(si, { title: e.target.value })
                            }
                            placeholder={`Section ${si + 1} title`}
                            className="border p-2 rounded w-full mb-2"
                          />
                          <input
                            value={sec.subtitle || ""}
                            onChange={(e) =>
                              updateSection(si, { subtitle: e.target.value })
                            }
                            placeholder="Section subtitle"
                            className="border p-2 rounded w-full mb-2"
                          />
                          <div className="flex gap-2 items-center">
                            <label className="text-sm">Layout</label>
                            <select
                              value={sec.layout || "full-width"}
                              onChange={(e) =>
                                updateSection(si, { layout: e.target.value })
                              }
                              className="border p-2 rounded"
                            >
                              <option value="full-width">Full width</option>
                              <option value="two-column">Two column</option>
                              <option value="centered">Centered</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex gap-1">
                            <button onClick={() => moveSection(si, "up")}>
                              <FiChevronUp />
                            </button>
                            <button onClick={() => moveSection(si, "down")}>
                              <FiChevronDown />
                            </button>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => addBlock(si, "text")}
                              className="px-2 py-1 text-xs bg-gray-100 rounded"
                            >
                              + Text
                            </button>
                            <button
                              onClick={() => addBlock(si, "image")}
                              className="px-2 py-1 text-xs bg-gray-100 rounded"
                            >
                              + Image
                            </button>
                            <button
                              onClick={() => addBlock(si, "list")}
                              className="px-2 py-1 text-xs bg-gray-100 rounded"
                            >
                              + List
                            </button>
                            <button
                              onClick={() => addBlock(si, "callout")}
                              className="px-2 py-1 text-xs bg-gray-100 rounded"
                            >
                              + Callout
                            </button>
                            <button
                              onClick={() => addBlock(si, "quote")}
                              className="px-2 py-1 text-xs bg-gray-100 rounded"
                            >
                              + Quote
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => removeSection(si)}
                              className="text-red-500 text-sm"
                            >
                              Remove section
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Blocks */}
                      <div className="mt-3 space-y-2">
                        {sec.contentBlocks && sec.contentBlocks.length > 0 ? (
                          sec.contentBlocks.map((b, bi) => (
                            <BlockEditor
                              key={bi}
                              sectionIdx={si}
                              block={b}
                              blockIdx={bi}
                            />
                          ))
                        ) : (
                          <div className="text-gray-500">
                            No blocks in this section. Use the buttons on the
                            right to add content blocks.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {error && <div className="text-red-500 mt-3">{error}</div>}

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={() => setEditorOpen(false)}
                    className="bg-gray-200 px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    disabled={loading}
                    onClick={saveBlog}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FiSave />{" "}
                    {loading ? "Saving..." : editing ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
