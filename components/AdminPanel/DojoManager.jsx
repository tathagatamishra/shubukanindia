"use client";
import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiUpload,
  FiImage,
} from "react-icons/fi";
import { shubukan_api } from "@/config";

function emptyContactPair() {
  return { label: "", value: "" };
}

function emptyGalleryItem() {
  return { url: "", alt: "" };
}

function emptyLocationEntry() {
  return {
    dojoName: "",
    instructor: "",
    profileImage: "",
    contact: [emptyContactPair(), emptyContactPair(), emptyContactPair()],
    landmark: "",
    location: [""], // array of strings (address lines / lat/lng etc.)
  };
}

export default function DojoManager() {
  const [dojos, setDojos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    index: 0,
    dojoType: "",
    dojoName: "",
    instructor: "",
    profileImage: "",
    contact: [emptyContactPair(), emptyContactPair()],
    landmark: "",
    location: [""], // root-level array of strings
    dojoGallery: [],
    dojoLocation: { mainDojo: [], subDojo: [] },
    isDeleted: false,
  });

  const [tempProfileFile, setTempProfileFile] = useState(null);
  const [tempGalleryFiles, setTempGalleryFiles] = useState({});
  const [tempLocationFiles, setTempLocationFiles] = useState({});

  const fetchDojos = async () => {
    setLoading(true);
    try {
      const res = await shubukan_api.get("/dojo");
      setDojos(res.data?.data || []);
    } catch (err) {
      console.error("Fetch dojos error:", err);
      setError("Failed to fetch dojos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDojos();
  }, []);

  const setField = (path, value) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!(p in cur)) cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  async function uploadToCloudinary(file) {
    if (!file) return null;
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin token missing. Please login.");

      const sigRes = await shubukan_api.post(
        "/dojo/signature",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sig = sigRes.data;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", sig.timestamp);
      fd.append("signature", sig.signature);
      fd.append("folder", "Shubukan/Dojo");

      const cloudName = sig.cloudName;
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!resp.ok) {
        const t = await resp.text();
        throw new Error("Cloudinary upload failed: " + t);
      }
      const data = await resp.json();
      return data.secure_url;
    } catch (err) {
      console.error("uploadToCloudinary error:", err);
      throw err;
    }
  }

  const openNew = () => {
    setEditing(null);
    setForm({
      index: 0,
      dojoType: "",
      dojoName: "",
      instructor: "",
      profileImage: "",
      contact: [emptyContactPair(), emptyContactPair()],
      landmark: "",
      location: [""],
      dojoGallery: [],
      dojoLocation: { mainDojo: [], subDojo: [] },
      isDeleted: false,
    });
    setTempProfileFile(null);
    setTempGalleryFiles({});
    setTempLocationFiles({});
    setError("");
    setEditorOpen(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({
      index: d.index || 0,
      dojoType: d.dojoType || "",
      dojoName: d.dojoName || "",
      instructor: d.instructor || "",
      profileImage: d.profileImage || "",
      contact:
        d.contact && Array.isArray(d.contact) && d.contact.length > 0
          ? d.contact
          : [emptyContactPair(), emptyContactPair()],
      landmark: d.landmark || "",
      location:
        Array.isArray(d.location) && d.location.length > 0 ? d.location : [""],
      dojoGallery: (d.dojoGallery || []).map((g) => ({
        url: g.url || "",
        alt: g.alt || "",
      })),
      dojoLocation: {
        mainDojo:
          (d.dojoLocation?.mainDojo || []).map((le) => ({
            dojoName: le.dojoName || "",
            instructor: le.instructor || "",
            profileImage: le.profileImage || "",
            contact:
              le.contact && le.contact.length > 0
                ? le.contact
                : [emptyContactPair(), emptyContactPair(), emptyContactPair()],
            landmark: le.landmark || "",
            location:
              Array.isArray(le.location) && le.location.length > 0
                ? le.location
                : [""],
          })) || [],
        subDojo:
          (d.dojoLocation?.subDojo || []).map((le) => ({
            dojoName: le.dojoName || "",
            instructor: le.instructor || "",
            profileImage: le.profileImage || "",
            contact:
              le.contact && le.contact.length > 0
                ? le.contact
                : [emptyContactPair(), emptyContactPair(), emptyContactPair()],
            landmark: le.landmark || "",
            location:
              Array.isArray(le.location) && le.location.length > 0
                ? le.location
                : [""],
          })) || [],
      },
      isDeleted: !!d.isDeleted,
    });
    setTempProfileFile(null);
    setTempGalleryFiles({});
    setTempLocationFiles({});
    setError("");
    setEditorOpen(true);
  };

  const addRootContact = () =>
    setForm((p) => ({
      ...p,
      contact: [...(p.contact || []), emptyContactPair()],
    }));
  const updateRootContact = (idx, patch) =>
    setForm((p) => {
      const arr = [...(p.contact || [])];
      arr[idx] = { ...arr[idx], ...patch };
      return { ...p, contact: arr };
    });
  const removeRootContact = (idx) =>
    setForm((p) => ({ ...p, contact: p.contact.filter((_, i) => i !== idx) }));

  const addGalleryItem = () =>
    setForm((p) => ({
      ...p,
      dojoGallery: [...(p.dojoGallery || []), emptyGalleryItem()],
    }));
  const updateGalleryItem = (idx, patch) =>
    setForm((p) => {
      const arr = [...(p.dojoGallery || [])];
      arr[idx] = { ...arr[idx], ...patch };
      return { ...p, dojoGallery: arr };
    });
  const removeGalleryItem = (idx) =>
    setForm((p) => ({
      ...p,
      dojoGallery: p.dojoGallery.filter((_, i) => i !== idx),
    }));

  const addLocationEntry = (which) =>
    setForm((p) => ({
      ...p,
      dojoLocation: {
        ...p.dojoLocation,
        [which]: [...(p.dojoLocation?.[which] || []), emptyLocationEntry()],
      },
    }));
  const updateLocationEntry = (which, idx, patch) =>
    setForm((p) => {
      const arr = [...(p.dojoLocation?.[which] || [])];
      arr[idx] = { ...arr[idx], ...patch };
      return { ...p, dojoLocation: { ...p.dojoLocation, [which]: arr } };
    });
  const removeLocationEntry = (which, idx) =>
    setForm((p) => {
      const arr = p.dojoLocation?.[which]?.filter((_, i) => i !== idx) || [];
      return { ...p, dojoLocation: { ...p.dojoLocation, [which]: arr } };
    });

  const addLocationContact = (which, idx) =>
    setForm((p) => {
      const arr = [...(p.dojoLocation?.[which] || [])];
      arr[idx].contact = [...(arr[idx].contact || []), emptyContactPair()];
      return { ...p, dojoLocation: { ...p.dojoLocation, [which]: arr } };
    });
  const updateLocationContact = (which, locIdx, contactIdx, patch) =>
    setForm((p) => {
      const arr = [...(p.dojoLocation?.[which] || [])];
      arr[locIdx].contact = [...(arr[locIdx].contact || [])];
      arr[locIdx].contact[contactIdx] = {
        ...arr[locIdx].contact[contactIdx],
        ...patch,
      };
      return { ...p, dojoLocation: { ...p.dojoLocation, [which]: arr } };
    });
  const removeLocationContact = (which, locIdx, contactIdx) =>
    setForm((p) => {
      const arr = [...(p.dojoLocation?.[which] || [])];
      arr[locIdx].contact = arr[locIdx].contact.filter(
        (_, i) => i !== contactIdx
      );
      return { ...p, dojoLocation: { ...p.dojoLocation, [which]: arr } };
    });

  const onProfileSelected = (file) => {
    setTempProfileFile(file);
    if (file) {
      setForm((p) => ({ ...p, profileImage: URL.createObjectURL(file) }));
    }
  };

  const onGalleryFileSelected = (file, idx) => {
    setTempGalleryFiles((prev) => ({ ...prev, [idx]: file }));
    if (file) {
      updateGalleryItem(idx, { url: URL.createObjectURL(file) });
    }
  };

  const onLocationFileSelected = (file, which, idx) => {
    const key = `${which}.${idx}`;
    setTempLocationFiles((prev) => ({ ...prev, [key]: file }));
    if (file) {
      updateLocationEntry(which, idx, {
        profileImage: URL.createObjectURL(file),
      });
    }
  };

  async function flushUploadsBeforeSave(payload) {
    if (tempProfileFile) {
      const url = await uploadToCloudinary(tempProfileFile);
      payload.profileImage = url;
    }

    if (payload.dojoGallery && payload.dojoGallery.length > 0) {
      for (let i = 0; i < payload.dojoGallery.length; i++) {
        const key = i;
        if (tempGalleryFiles[key]) {
          const url = await uploadToCloudinary(tempGalleryFiles[key]);
          payload.dojoGallery[i].url = url;
        }
      }
    }

    for (const which of ["mainDojo", "subDojo"]) {
      const arr = payload.dojoLocation?.[which] || [];
      for (let i = 0; i < arr.length; i++) {
        const key = `${which}.${i}`;
        if (tempLocationFiles[key]) {
          const url = await uploadToCloudinary(tempLocationFiles[key]);
          payload.dojoLocation[which][i].profileImage = url;
        }
      }
    }

    return payload;
  }

  const saveDojo = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin token missing. Please login.");

      const payload = JSON.parse(JSON.stringify(form));

      payload.index = Number(payload.index || 0);

      payload.contact = (payload.contact || []).map((c) => ({
        label: (c.label || "").trim(),
        value: (c.value || "").trim(),
      }));

      // normalize root location -> array of non-empty trimmed strings
      payload.location = (payload.location || [])
        .map((s) => (s || "").trim())
        .filter(Boolean);

      payload.dojoGallery = (payload.dojoGallery || []).map((g) => ({
        url: g.url || "",
        alt: g.alt || "",
      }));

      payload.dojoLocation = payload.dojoLocation || {
        mainDojo: [],
        subDojo: [],
      };
      for (const which of ["mainDojo", "subDojo"]) {
        payload.dojoLocation[which] = (payload.dojoLocation[which] || []).map(
          (le) => ({
            dojoName: le.dojoName || "",
            instructor: le.instructor || "",
            profileImage: le.profileImage || "",
            contact: (le.contact || []).map((c) => ({
              label: (c.label || "").trim(),
              value: (c.value || "").trim(),
            })),
            landmark: le.landmark || "",
            location: (le.location || [])
              .map((s) => (s || "").trim())
              .filter(Boolean)
              .slice(0, 10),
          })
        );
      }

      await flushUploadsBeforeSave(payload);

      if (editing && editing._id) {
        await shubukan_api.put(`/dojo/${editing._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await shubukan_api.post("/dojo", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setEditorOpen(false);
      fetchDojos();
    } catch (err) {
      console.error("Save dojo error:", err);
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const softDelete = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await shubukan_api.delete(`/dojo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDojos();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const ContactEditor = ({ contactArray, onAdd, onUpdate, onRemove }) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">Contacts</div>
          <button
            onClick={onAdd}
            className="text-sm text-blue-600 flex items-center gap-1"
          >
            <FiPlus /> Add
          </button>
        </div>
        <div className="space-y-2">
          {(contactArray || []).map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                value={c.label}
                onChange={(e) => onUpdate(i, { label: e.target.value })}
                placeholder="Label (Phone, Email...)"
                className="col-span-4 border p-2 rounded"
              />
              <input
                value={c.value}
                onChange={(e) => onUpdate(i, { value: e.target.value })}
                placeholder="Value"
                className="col-span-7 border p-2 rounded"
              />
              <button
                onClick={() => onRemove(i)}
                className="col-span-1 text-red-500"
                title="Remove contact"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const GalleryEditor = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Gallery</div>
          <button
            onClick={addGalleryItem}
            className="text-sm text-blue-600 flex items-center gap-1"
          >
            <FiPlus /> Add
          </button>
        </div>

        <div className="grid gap-3">
          {(form.dojoGallery || []).map((g, i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white p-3 rounded border"
            >
              <div className="h-24 w-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {g.url ? (
                  <img
                    src={g.url}
                    className="w-full h-full object-cover"
                    alt={g.alt || ""}
                  />
                ) : (
                  <FiImage />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2 items-center">
                  <div className="border p-2 rounded flex items-center gap-2">
                    <FiUpload />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        onGalleryFileSelected(e.target.files?.[0], i)
                      }
                    />
                  </div>
                  <input
                    type="text"
                    value={g.url}
                    onChange={(e) =>
                      updateGalleryItem(i, { url: e.target.value })
                    }
                    placeholder="Or paste image URL"
                    className="border p-2 rounded flex-1"
                  />
                </div>
                <input
                  value={g.alt}
                  onChange={(e) =>
                    updateGalleryItem(i, { alt: e.target.value })
                  }
                  placeholder="Alt text"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <button
                  onClick={() => removeGalleryItem(i)}
                  className="text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
          {form.dojoGallery.length === 0 && (
            <div className="text-sm text-gray-500">No gallery items yet.</div>
          )}
        </div>
      </div>
    );
  };

  const LocationListEditor = ({ which }) => {
    const arr = form.dojoLocation?.[which] || [];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            {which === "mainDojo" ? "Main Dojos" : "Sub Dojos"}
          </div>
          <button
            onClick={() => addLocationEntry(which)}
            className="text-sm text-blue-600 flex items-center gap-1"
          >
            <FiPlus /> Add entry
          </button>
        </div>

        <div className="space-y-4">
          {arr.length === 0 && (
            <div className="text-sm text-gray-500">No entries yet.</div>
          )}

          {arr.map((le, i) => (
            <div key={i} className="bg-white p-3 rounded border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      value={le.dojoName}
                      onChange={(e) =>
                        updateLocationEntry(which, i, {
                          dojoName: e.target.value,
                        })
                      }
                      placeholder="Dojo Name"
                      className="border p-2 rounded md:col-span-2"
                    />
                    <input
                      value={le.instructor}
                      onChange={(e) =>
                        updateLocationEntry(which, i, {
                          instructor: e.target.value,
                        })
                      }
                      placeholder="Instructor"
                      className="border p-2 rounded"
                    />
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden">
                      {le.profileImage ? (
                        <img
                          src={le.profileImage}
                          className="w-full h-full object-cover"
                          alt="profile"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FiImage />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="border p-2 rounded flex items-center gap-3">
                        <FiUpload />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            onLocationFileSelected(
                              e.target.files?.[0],
                              which,
                              i
                            )
                          }
                        />
                      </div>
                      <input
                        value={le.profileImage}
                        onChange={(e) =>
                          updateLocationEntry(which, i, {
                            profileImage: e.target.value,
                          })
                        }
                        placeholder="Or paste profile image URL"
                        className="border p-2 rounded w-full"
                      />
                      <input
                        value={le.landmark}
                        onChange={(e) =>
                          updateLocationEntry(which, i, {
                            landmark: e.target.value,
                          })
                        }
                        placeholder="Landmark"
                        className="border p-2 rounded w-full"
                      />

                      {/* location strings array editor for this entry */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Location lines
                          </div>
                          <button
                            onClick={() =>
                              updateLocationEntry(which, i, {
                                location: [...(le.location || []), ""],
                              })
                            }
                            className="text-sm text-blue-600 flex items-center gap-1"
                          >
                            <FiPlus /> Add line
                          </button>
                        </div>

                        <div className="space-y-2 mt-2">
                          {(le.location || []).map((loc, li) => (
                            <div key={li} className="flex gap-2 items-center">
                              <input
                                value={loc}
                                onChange={(e) =>
                                  updateLocationEntry(which, i, {
                                    location: (le.location || []).map(
                                      (v, idx) =>
                                        idx === li ? e.target.value : v
                                    ),
                                  })
                                }
                                placeholder="Address / lat / city"
                                className="border p-2 rounded flex-1"
                              />
                              <button
                                onClick={() =>
                                  updateLocationEntry(which, i, {
                                    location: (le.location || []).filter(
                                      (_, idx) => idx !== li
                                    ),
                                  })
                                }
                                className="text-red-500"
                              >
                                <FiX />
                              </button>
                            </div>
                          ))}
                          {(le.location || []).length === 0 && (
                            <div className="text-xs text-gray-500">
                              No location lines yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* contacts for this location */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Contacts</div>
                      <button
                        onClick={() => addLocationContact(which, i)}
                        className="text-sm text-blue-600"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {(le.contact || []).map((c, ci) => (
                        <div key={ci} className="grid grid-cols-12 gap-2">
                          <input
                            value={c.label}
                            onChange={(e) =>
                              updateLocationContact(which, i, ci, {
                                label: e.target.value,
                              })
                            }
                            placeholder="Label"
                            className="col-span-4 border p-2 rounded"
                          />
                          <input
                            value={c.value}
                            onChange={(e) =>
                              updateLocationContact(which, i, ci, {
                                value: e.target.value,
                              })
                            }
                            placeholder="Value"
                            className="col-span-7 border p-2 rounded"
                          />
                          <button
                            onClick={() => removeLocationContact(which, i, ci)}
                            className="col-span-1 text-red-500"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => removeLocationEntry(which, i)}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Dojos</h2>
        <div className="flex gap-2">
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg"
          >
            <FiPlus /> New Dojo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[30vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
        </div>
      ) : dojos.length === 0 ? (
        <div className="text-gray-500 text-center">No dojos available.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dojos.map((d) => (
            <div
              key={d._id}
              className="bg-white p-4 rounded-lg shadow-sm flex flex-col"
            >
              <div className="h-40 w-full overflow-hidden rounded-md mb-3 bg-gray-100">
                {d.profileImage ? (
                  <img
                    src={d.profileImage}
                    className="w-full h-full object-cover"
                    alt={d.dojoName}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{d.dojoName}</h3>
                <div className="text-sm text-gray-600">{d.instructor}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Type: {d.dojoType}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-500">Index: {d.index}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(d)} className="text-blue-600">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => softDelete(d._id)}
                    className="text-red-600"
                    title="Soft delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-auto">
          <div className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-4 overflow-auto max-h-[95vh]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">
                {editing ? "Edit Dojo" : "New Dojo"}
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditorOpen(false)} className="p-2">
                  <FiX />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-1 space-y-4">
                <div className="border rounded p-3 bg-white">
                  <h4 className="font-semibold mb-2">Basic Info</h4>
                  <input
                    type="number"
                    value={form.index}
                    onChange={(e) => setField("index", Number(e.target.value))}
                    placeholder="Index (unique, number)"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    value={form.dojoType}
                    onChange={(e) => setField("dojoType", e.target.value)}
                    placeholder="Dojo Type"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    value={form.dojoName}
                    onChange={(e) => setField("dojoName", e.target.value)}
                    placeholder="Dojo Name"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    value={form.instructor}
                    onChange={(e) => setField("instructor", e.target.value)}
                    placeholder="Instructor"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    value={form.landmark}
                    onChange={(e) => setField("landmark", e.target.value)}
                    placeholder="Landmark"
                    className="border p-2 rounded w-full"
                  />

                  {/* root-level locations array editor */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Locations (root)
                      </div>
                      <button
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            location: [...(p.location || []), ""],
                          }))
                        }
                        className="text-sm text-blue-600 flex items-center gap-1"
                      >
                        <FiPlus /> Add
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {(form.location || []).map((loc, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            value={loc}
                            onChange={(e) => {
                              const newArr = [...(form.location || [])];
                              newArr[i] = e.target.value;
                              setField("location", newArr);
                            }}
                            placeholder="Address / lat / city"
                            className="border p-2 rounded flex-1"
                          />
                          <button
                            onClick={() => {
                              const newArr = (form.location || []).filter(
                                (_, idx) => idx !== i
                              );
                              setField("location", newArr);
                            }}
                            className="text-red-500"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border rounded p-3 bg-white">
                  <h4 className="font-semibold mb-2">Profile Image</h4>
                  <div className="flex gap-3 items-start">
                    <div className="h-28 w-28 bg-gray-100 rounded overflow-hidden">
                      {form.profileImage ? (
                        <img
                          src={form.profileImage}
                          className="w-full h-full object-cover"
                          alt="profile"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FiImage />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="border p-2 rounded flex items-center gap-3">
                        <FiUpload />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            onProfileSelected(e.target.files?.[0])
                          }
                        />
                      </div>
                      <input
                        value={form.profileImage}
                        onChange={(e) =>
                          setField("profileImage", e.target.value)
                        }
                        placeholder="Or paste image URL"
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded p-3 bg-white">
                  <ContactEditor
                    contactArray={form.contact || []}
                    onAdd={addRootContact}
                    onUpdate={updateRootContact}
                    onRemove={removeRootContact}
                  />
                </div>

                <div className="border rounded p-3 bg-white">
                  <GalleryEditor />
                </div>
              </div>

              <div className="col-span-2 space-y-4">
                <div className="border rounded p-3 bg-white">
                  <h4 className="font-semibold mb-2">Locations</h4>
                  <div className="space-y-4">
                    <LocationListEditor which="mainDojo" />
                    <hr />
                    <LocationListEditor which="subDojo" />
                  </div>
                </div>

                {error && <div className="text-red-500">{error}</div>}

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={() => setEditorOpen(false)}
                    className="bg-gray-200 px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    disabled={loading}
                    onClick={saveDojo}
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
