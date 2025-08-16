// components/Marksheet/MarksheetBoard.jsx
import React, { useEffect, useState } from "react";
import "./MarksheetBoard.scss";
import { shubukan_api } from "../../../config.js";
import axios from "axios";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoIosWarning } from "react-icons/io";

export default function MarksheetBoard() {
  const [dojos, setDojos] = useState([]);
  const [marksheets, setMarksheets] = useState([]);
  const [selectedDojo, setSelectedDojo] = useState("");
  const [dojoPassword, setDojoPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    dojoId: "",
    title: "",
    category: "",
    year: "",
    date: "",
  });
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Edit
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    year: "",
    date: "",
  });
  const [editPdf, setEditPdf] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDojos();
  }, []);

  const token = () => localStorage.getItem("adminToken");

  async function fetchDojos() {
    try {
      const res = await shubukan_api.get("/dojo");
      setDojos(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch dojos");
    }
  }

  async function fetchMarksheetsSecure() {
    if (!selectedDojo || !dojoPassword) {
      setError("Select a dojo and enter its password");
      return;
    }
    setError("");
    try {
      const res = await shubukan_api.get(
        `/marksheet?dojoId=${selectedDojo}&password=${encodeURIComponent(dojoPassword)}`
      );
      setMarksheets(res.data.marksheets || []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to fetch marksheets");
    }
  }

  function onInput(e, setFn) {
    const { id, value } = e.target;
    setFn((p) => ({ ...p, [id]: value }));
  }

  function onPdfChange(e, setFn) {
    const file = e.target.files?.[0];
    if (file && file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    setFn(file || null);
  }

  // Direct PDF upload to Cloudinary (raw), then POST to backend
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      if (!selectedPdf) {
        setError("Please select a PDF");
        setLoading(false);
        return;
      }
      if (!form.dojoId) {
        setError("Please choose a dojo");
        setLoading(false);
        return;
      }

      // 1) get signature for marksheet (raw upload)
      const sig = await shubukan_api.post(
        "/marksheet/signature",
        {},
        { headers: { Authorization: `Bearer ${token()}` } }
      );

      const fd = new FormData();
      fd.append("file", selectedPdf);
      fd.append("api_key", sig.data.apiKey);
      fd.append("timestamp", sig.data.timestamp);
      fd.append("signature", sig.data.signature);
      fd.append("folder", "Shubukan/Marksheet");

      // 2) upload to Cloudinary RAW endpoint
      const cloud = await axios.post(
        `https://api.cloudinary.com/v1_1/${sig.data.cloudName}/raw/upload`,
        fd,
        {
          onUploadProgress: (pe) => {
            const pct = Math.round((pe.loaded * 100) / (pe.total || 1));
            setUploadProgress(pct);
          },
        }
      );

      const link = cloud.data.secure_url;

      // 3) save to backend
      await shubukan_api.post(
        "/marksheet",
        {
          dojoId: form.dojoId,
          title: form.title,
          category: form.category,
          year: form.year,
          date: form.date, // YYYY-MM-DD
          link,
        },
        { headers: { Authorization: `Bearer ${token()}` } }
      );

      // reset
      setForm({ dojoId: "", title: "", category: "", year: "", date: "" });
      setSelectedPdf(null);
      setUploadProgress(0);
      setOpenAdd(false);

      // refresh if viewing this dojo
      if (selectedDojo && dojoPassword) fetchMarksheetsSecure();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to create marksheet");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(ms) {
    setEditItem(ms);
    setEditForm({
      title: ms.title || "",
      category: ms.category || "",
      year: ms.year || "",
      date: ms.date ? ms.date.substring(0, 10) : "",
    });
    setEditPdf(null);
    setEditMode(true);
  }

  function cancelEdit() {
    setEditMode(false);
    setEditItem(null);
    setEditPdf(null);
    setEditForm({ title: "", category: "", year: "", date: "" });
  }

  async function handleUpdate() {
    if (!editItem) return;
    setUpdating(true);
    setError("");

    try {
      let newLink = null;

      if (editPdf) {
        // Upload replacement PDF
        const sig = await shubukan_api.post(
          "/marksheet/signature",
          {},
          { headers: { Authorization: `Bearer ${token()}` } }
        );

        const fd = new FormData();
        fd.append("file", editPdf);
        fd.append("api_key", sig.data.apiKey);
        fd.append("timestamp", sig.data.timestamp);
        fd.append("signature", sig.data.signature);
        fd.append("folder", "Shubukan/Marksheet");

        const cloud = await axios.post(
          `https://api.cloudinary.com/v1_1/${sig.data.cloudName}/raw/upload`,
          fd
        );
        newLink = cloud.data.secure_url;
      }

      await shubukan_api.put(
        "/marksheet",
        {
          id: editItem._id,
          title: editForm.title,
          category: editForm.category,
          year: editForm.year,
          date: editForm.date,
          ...(newLink ? { link: newLink } : {}),
        },
        { headers: { Authorization: `Bearer ${token()}` } }
      );

      cancelEdit();
      if (selectedDojo && dojoPassword) fetchMarksheetsSecure();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to update marksheet");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    setError("");
    try {
      await shubukan_api.delete(`/marksheet/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (selectedDojo && dojoPassword) fetchMarksheetsSecure();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="marksheet-board">
      <div className="toolbar">
        <div className="filter">
          <select
            value={selectedDojo}
            onChange={(e) => setSelectedDojo(e.target.value)}
          >
            <option value="">Select a Dojo</option>
            {dojos.map((d) => (
              <option key={d._id} value={d._id}>
                {d.dojoName}
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Dojo password"
            value={dojoPassword}
            onChange={(e) => setDojoPassword(e.target.value)}
          />
          <button onClick={fetchMarksheetsSecure}>Load Marksheets</button>
        </div>

        <button className="add-btn" onClick={() => setOpenAdd(true)}>
          <FiPlus /> Add Marksheet (PDF)
        </button>
      </div>

      {error && <div className="error"><IoIosWarning /> {error}</div>}

      <div className="list">
        {marksheets.map((m) => (
          <div className="row" key={m._id}>
            <div className="meta">
              <p className="title">{m.title}</p>
              <p className="sub">
                {m.category ? `${m.category} • ` : ""}
                {m.year || ""}
                {m.date ? ` • ${new Date(m.date).toLocaleDateString()}` : ""}
              </p>
            </div>
            <div className="actions">
              <a className="download" href={m.link} target="_blank" rel="noreferrer">
                View/Download
              </a>
              <button onClick={() => startEdit(m)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(m._id)}>
                <RiDeleteBin2Line /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add modal */}
      {openAdd && (
        <div className="overlay">
          <form className="modal" onSubmit={handleSubmit}>
            <h3>Upload Marksheet (PDF)</h3>
            <label>Dojo</label>
            <select
              id="dojoId"
              value={form.dojoId}
              onChange={(e) => setForm((p) => ({ ...p, dojoId: e.target.value }))}
              required
            >
              <option value="">Select dojo</option>
              {dojos.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.dojoName}
                </option>
              ))}
            </select>

            <label>Title</label>
            <input id="title" value={form.title} onChange={(e) => onInput(e, setForm)} required />

            <label>Category</label>
            <input id="category" value={form.category} onChange={(e) => onInput(e, setForm)} />

            <label>Year</label>
            <input id="year" value={form.year} onChange={(e) => onInput(e, setForm)} />

            <label>Date</label>
            <input id="date" type="date" value={form.date} onChange={(e) => onInput(e, setForm)} required />

            <label>PDF File</label>
            <input type="file" accept="application/pdf" onChange={(e) => onPdfChange(e, setSelectedPdf)} required />

            {loading && uploadProgress > 0 && (
              <div className="progress">
                <div className="bar" style={{ width: `${uploadProgress}%` }} />
                <p>Uploading: {uploadProgress}%</p>
              </div>
            )}

            <div className="rowbtn">
              <button type="button" onClick={() => setOpenAdd(false)} className="secondary">
                <FiX /> Close
              </button>
              <button type="submit" disabled={loading} className="primary">
                <FiSave /> Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit modal */}
      {editMode && editItem && (
        <div className="overlay">
          <div className="modal">
            <h3>Edit Marksheet</h3>
            <label>Title</label>
            <input
              value={editForm.title}
              onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
            />

            <label>Category</label>
            <input
              value={editForm.category}
              onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
            />

            <label>Year</label>
            <input
              value={editForm.year}
              onChange={(e) => setEditForm((p) => ({ ...p, year: e.target.value }))}
            />

            <label>Date</label>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
            />

            <label>Replace PDF (optional)</label>
            <input type="file" accept="application/pdf" onChange={(e) => onPdfChange(e, setEditPdf)} />

            <div className="rowbtn">
              <button onClick={cancelEdit} className="secondary"><FiX /> Cancel</button>
              <button onClick={handleUpdate} disabled={updating} className="primary">
                <FiSave /> {updating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {(updating || deleting) && <div className="busy">{updating ? "Updating..." : "Deleting..."}</div>}
    </div>
  );
}
