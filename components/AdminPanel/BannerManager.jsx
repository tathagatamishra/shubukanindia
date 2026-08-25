"use client";
import React, { useState, useEffect } from "react";
import { shubukan_api } from "@/config";
import { FiEdit, FiSave, FiX, FiPlus, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";

const emptyForm = { title: "", messages: [""], linkUrl: "/contact", linkText: "www.shubukanindia.org/contact" };

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState(emptyForm);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await shubukan_api.get("/admin/banner", authHeaders());
      setBanners(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  // ---------- message list helpers (shared by add + edit forms) ----------
  const setMessage = (setter) => (index, value) =>
    setter((p) => ({ ...p, messages: p.messages.map((m, i) => (i === index ? value : m)) }));

  const addMessage = (setter) => () => setter((p) => ({ ...p, messages: [...p.messages, ""] }));

  const removeMessage = (setter) => (index) =>
    setter((p) => ({ ...p, messages: p.messages.filter((_, i) => i !== index) }));

  // ---------- create ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const messages = formData.messages.map((m) => m.trim()).filter(Boolean);
    if (!formData.title.trim()) return setError("Title is required");
    if (messages.length === 0) return setError("Add at least one message");

    setLoading(true);
    try {
      await shubukan_api.post("/admin/banner", { ...formData, messages }, authHeaders());
      await fetchBanners();
      setFormData(emptyForm);
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  // ---------- edit ----------
  const startEdit = (b) => {
    setEditMode(b._id);
    setEditData({ title: b.title, messages: b.messages.length ? b.messages : [""], linkUrl: b.linkUrl, linkText: b.linkText });
  };

  const handleUpdate = async (id) => {
    setError("");
    const messages = editData.messages.map((m) => m.trim()).filter(Boolean);
    if (!editData.title.trim()) return setError("Title is required");
    if (messages.length === 0) return setError("Add at least one message");

    setLoading(true);
    try {
      await shubukan_api.put(`/admin/banner/${id}`, { ...editData, messages }, authHeaders());
      await fetchBanners();
      setEditMode(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  // ---------- activate / deactivate / delete ----------
  const handleActivate = async (id) => {
    try {
      await shubukan_api.patch(`/admin/banner/${id}/activate`, {}, authHeaders());
      fetchBanners();
    } catch (err) {
      console.error(err);
      setError("Failed to activate banner");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await shubukan_api.patch(`/admin/banner/${id}/deactivate`, {}, authHeaders());
      fetchBanners();
    } catch (err) {
      console.error(err);
      setError("Failed to deactivate banner");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner preset?")) return;
    try {
      await shubukan_api.delete(`/admin/banner/${id}`, authHeaders());
      fetchBanners();
    } catch (err) {
      console.error(err);
      setError("Failed to delete banner");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Banner Manager</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage the scrolling message strip shown at the bottom of the site. Only one banner can be active at a
        time — the site always shows whichever one is marked "Active".
      </p>

      <button
        onClick={() => setOpenAdd(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <FiPlus /> Add Banner
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add new banner modal */}
      {openAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg w-[560px] max-w-full max-h-[85vh] overflow-y-auto space-y-3"
          >
            <h2 className="text-lg font-semibold">New Banner</h2>
            <input
              placeholder="Title (internal label, not shown on site)"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className="w-full border p-2"
              required
            />

            <MessagesEditor
              messages={formData.messages}
              onChange={setMessage(setFormData)}
              onAdd={addMessage(setFormData)}
              onRemove={removeMessage(setFormData)}
            />

            <input
              placeholder="Link URL (e.g. /contact)"
              value={formData.linkUrl}
              onChange={(e) => setFormData((p) => ({ ...p, linkUrl: e.target.value }))}
              className="w-full border p-2"
            />
            <input
              placeholder="Link Text (e.g. www.shubukanindia.org/contact)"
              value={formData.linkText}
              onChange={(e) => setFormData((p) => ({ ...p, linkText: e.target.value }))}
              className="w-full border p-2"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpenAdd(false);
                  setFormData(emptyForm);
                }}
                className="bg-gray-300 px-4 py-2 rounded flex items-center gap-1"
              >
                <FiX /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <FiSave /> Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner list */}
      {loading && banners.length === 0 ? (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-gray-500 text-center">No banners created yet</div>
      ) : (
        <div className="space-y-4">
          {banners.map((b) => (
            <div key={b._id} className="bg-white shadow p-4 rounded border">
              {editMode === b._id ? (
                <div className="space-y-3">
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))}
                    className="w-full border p-2"
                  />
                  <MessagesEditor
                    messages={editData.messages}
                    onChange={setMessage(setEditData)}
                    onAdd={addMessage(setEditData)}
                    onRemove={removeMessage(setEditData)}
                  />
                  <input
                    value={editData.linkUrl}
                    onChange={(e) => setEditData((p) => ({ ...p, linkUrl: e.target.value }))}
                    className="w-full border p-2"
                  />
                  <input
                    value={editData.linkText}
                    onChange={(e) => setEditData((p) => ({ ...p, linkText: e.target.value }))}
                    className="w-full border p-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleUpdate(b._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FiSave /> Save
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-300 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold break-words">{b.title}</p>
                        {b.isActive && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            <FiCheckCircle size={12} /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 break-words">
                        {b.linkText} → {b.linkUrl}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={() => startEdit(b)} className="text-blue-500 flex items-center gap-1">
                        <FiEdit /> Edit
                      </button>
                      {b.isActive ? (
                        <button onClick={() => handleDeactivate(b._id)} className="text-amber-600 flex items-center gap-1">
                          Deactivate
                        </button>
                      ) : (
                        <button onClick={() => handleActivate(b._id)} className="text-green-600 flex items-center gap-1">
                          <FiCheckCircle /> Set Active
                        </button>
                      )}
                      <button onClick={() => handleDelete(b._id)} className="text-red-500 flex items-center gap-1">
                        <RiDeleteBin2Line /> Delete
                      </button>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1 text-sm text-gray-700 list-disc pl-5">
                    {b.messages.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Shared add/remove/edit UI for the `messages` string array, used by both the
// "Add Banner" form and each card's inline edit form.
function MessagesEditor({ messages, onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">Messages (each one scrolls in turn)</label>
      {messages.map((m, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea
            value={m}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={`Message ${i + 1}`}
            className="w-full border p-2"
            rows={2}
            required
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            disabled={messages.length === 1}
            className="text-red-500 disabled:text-gray-300 mt-2"
            title="Remove message"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="text-blue-500 text-sm flex items-center gap-1">
        <FiPlus /> Add another message
      </button>
    </div>
  );
}
