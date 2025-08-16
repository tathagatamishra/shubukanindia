// components/Dojo/DojoBoard.jsx
import React, { useEffect, useState } from "react";
import "./DojoBoard.scss";
import { shubukan_api } from "../../../config.js";
import axios from "axios";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";

export default function DojoBoard() {
  const [dojos, setDojos] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    dojoName: "",
    dojoType: "Branch Dojo",
    password: "",
    image: [], // array of dojo images (optional)
    instructors: [{ name: "", photo: "" }],
    contact: [[]], // compatible with your nested shape
    brunch: [[]],  // compatible
  });

  // Edit
  const [editMode, setEditMode] = useState(false);
  const [editDojo, setEditDojo] = useState(null);

  const token = () => localStorage.getItem("adminToken");

  useEffect(() => { fetchDojos(); }, []);

  async function fetchDojos() {
    try {
      const res = await shubukan_api.get("/dojo");
      setDojos(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch dojos");
    }
  }

  function setField(id, value) {
    setForm((p) => ({ ...p, [id]: value }));
  }

  function addInstructor() {
    setForm((p) => ({ ...p, instructors: [...p.instructors, { name: "", photo: "" }] }));
  }
  function removeInstructor(idx) {
    setForm((p) => ({ ...p, instructors: p.instructors.filter((_, i) => i !== idx) }));
  }

  // Upload an instructor photo to Cloudinary: reuse gallery signature but override folder
  async function uploadInstructorPhoto(file, idx) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      // You can also create a /dojo/signature if you prefer; here we reuse gallery signature.
      const sig = await shubukan_api.post(
        "/gallery/signature",
        {},
        { headers: { Authorization: `Bearer ${token()}` } }
      );

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.data.apiKey);
      fd.append("timestamp", sig.data.timestamp);
      fd.append("signature", sig.data.signature);
      fd.append("folder", "Shubukan/Dojo"); // override folder

      const cloud = await axios.post(
        `https://api.cloudinary.com/v1_1/${sig.data.cloudName}/image/upload`,
        fd
      );

      const url = cloud.data.secure_url;
      setForm((p) => {
        const arr = [...p.instructors];
        arr[idx] = { ...arr[idx], photo: url };
        return { ...p, instructors: arr };
      });
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to upload photo");
    } finally {
      setBusy(false);
    }
  }

  function addContactGroup() {
    setForm((p) => ({ ...p, contact: [...p.contact, []] }));
  }
  function addContactItem(gidx) {
    setForm((p) => {
      const copy = [...p.contact];
      const group = copy[gidx] ? [...copy[gidx]] : [];
      group.push({ label: "", value: "" });
      copy[gidx] = group;
      return { ...p, contact: copy };
    });
  }
  function updateContact(gidx, iidx, key, value) {
    setForm((p) => {
      const copy = [...p.contact];
      const group = [...copy[gidx]];
      group[iidx] = { ...group[iidx], [key]: value };
      copy[gidx] = group;
      return { ...p, contact: copy };
    });
  }

  function addBrunchGroup() {
    setForm((p) => ({ ...p, brunch: [...p.brunch, []] }));
  }
  function addBrunchItem(gidx) {
    setForm((p) => {
      const copy = [...p.brunch];
      const group = copy[gidx] ? [...copy[gidx]] : [];
      group.push({ mainLocation: "", brunchAddress: [""] });
      copy[gidx] = group;
      return { ...p, brunch: copy };
    });
  }
  function updateBrunch(gidx, iidx, key, value, addrIndex = null) {
    setForm((p) => {
      const copy = [...p.brunch];
      const group = [...copy[gidx]];
      const item = { ...group[iidx] };
      if (key === "brunchAddress" && addrIndex !== null) {
        const a = [...item.brunchAddress];
        a[addrIndex] = value;
        item.brunchAddress = a;
      } else {
        item[key] = value;
      }
      group[iidx] = item;
      copy[gidx] = group;
      return { ...p, brunch: copy };
    });
  }
  function addBrunchAddress(gidx, iidx) {
    setForm((p) => {
      const copy = [...p.brunch];
      const group = [...copy[gidx]];
      const item = { ...group[iidx] };
      item.brunchAddress = [...(item.brunchAddress || []), ""];
      group[iidx] = item;
      copy[gidx] = group;
      return { ...p, brunch: copy };
    });
  }

  async function createDojo(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await shubukan_api.post("/dojo", form, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setOpenAdd(false);
      setForm({
        dojoName: "",
        dojoType: "Branch Dojo",
        password: "",
        image: [],
        instructors: [{ name: "", photo: "" }],
        contact: [[]],
        brunch: [[]],
      });
      fetchDojos();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to create dojo");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(d) {
    setEditDojo(d);
    setEditMode(true);
  }
  function cancelEdit() {
    setEditDojo(null);
    setEditMode(false);
  }

  async function saveEdit(d) {
    setBusy(true);
    setError("");
    try {
      await shubukan_api.put(`/dojo/${d._id}`, d, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      cancelEdit();
      fetchDojos();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to update dojo");
    } finally {
      setBusy(false);
    }
  }

  async function deleteDojo(id) {
    setBusy(true);
    setError("");
    try {
      await shubukan_api.delete(`/dojo/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      fetchDojos();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to delete dojo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dojo-board">
      <div className="topbar">
        <button className="add" onClick={() => setOpenAdd(true)}>
          <FiPlus /> Add Dojo
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="list">
        {dojos.map((d) => (
          <div key={d._id} className="dojo-card">
            <div className="head">
              <div>
                <h3>{d.dojoName}</h3>
                <p className="type">{d.dojoType}</p>
              </div>
              <div className="actions">
                <button onClick={() => startEdit(d)}>Edit</button>
                <button className="danger" onClick={() => deleteDojo(d._id)}>
                  <RiDeleteBin2Line /> Delete
                </button>
              </div>
            </div>

            {d.instructors?.length > 0 && (
              <div className="instructors">
                {d.instructors.map((ins) => (
                  <div className="ins" key={ins._id || ins.name}>
                    {ins.photo ? <img src={ins.photo} alt={ins.name} /> : <div className="ph" />}
                    <p>{ins.name}</p>
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(d.contact) && d.contact.length > 0 && (
              <div className="contacts">
                <h4>Contacts</h4>
                {d.contact.map((group, gi) => (
                  <ul key={gi}>
                    {group.map((c, ci) => (
                      <li key={ci}>
                        <b>{c.label}:</b> {c.value}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            )}

            {Array.isArray(d.brunch) && d.brunch.length > 0 && (
              <div className="branches">
                <h4>Branches</h4>
                {d.brunch.map((group, gi) => (
                  <div key={gi} className="branch-group">
                    {group.map((b, bi) => (
                      <div key={bi} className="branch">
                        <p className="loc">{b.mainLocation}</p>
                        <ul>
                          {b.brunchAddress?.map((addr, ai) => (
                            <li key={ai}>{addr}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Dojo Modal */}
      {openAdd && (
        <div className="overlay">
          <form className="modal" onSubmit={createDojo}>
            <h3>Create Dojo</h3>

            <label>Dojo Name</label>
            <input
              value={form.dojoName}
              onChange={(e) => setField("dojoName", e.target.value)}
              required
            />

            <label>Dojo Type</label>
            <input
              value={form.dojoType}
              onChange={(e) => setField("dojoType", e.target.value)}
            />

            <label>Password (for marksheet access)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              required
            />

            <div className="hr" />

            <div className="row between">
              <h4>Instructors</h4>
              <button type="button" onClick={addInstructor}><FiPlus /> Add</button>
            </div>

            {form.instructors.map((ins, idx) => (
              <div className="ins-row" key={idx}>
                <input
                  placeholder="Name"
                  value={ins.name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((p) => {
                      const arr = [...p.instructors];
                      arr[idx] = { ...arr[idx], name: v };
                      return { ...p, instructors: arr };
                    });
                  }}
                  required
                />
                <input
                  placeholder="Photo URL (or upload)"
                  value={ins.photo}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((p) => {
                      const arr = [...p.instructors];
                      arr[idx] = { ...arr[idx], photo: v };
                      return { ...p, instructors: arr };
                    });
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadInstructorPhoto(e.target.files?.[0], idx)}
                />
                <button type="button" className="danger" onClick={() => removeInstructor(idx)}>
                  Remove
                </button>
              </div>
            ))}

            <div className="hr" />
            <div className="row between">
              <h4>Contacts</h4>
              <button type="button" onClick={addContactGroup}><FiPlus /> Add Group</button>
            </div>
            {form.contact.map((group, gi) => (
              <div key={gi} className="contact-group">
                <button type="button" onClick={() => addContactItem(gi)}><FiPlus /> Add Item</button>
                <div className="group-list">
                  {(group || []).map((c, ci) => (
                    <div className="contact-row" key={ci}>
                      <input placeholder="Label" value={c.label || ""} onChange={(e) => updateContact(gi, ci, "label", e.target.value)} />
                      <input placeholder="Value" value={c.value || ""} onChange={(e) => updateContact(gi, ci, "value", e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="hr" />
            <div className="row between">
              <h4>Branches (Brunch)</h4>
              <button type="button" onClick={addBrunchGroup}><FiPlus /> Add Group</button>
            </div>
            {form.brunch.map((group, gi) => (
              <div key={gi} className="branch-group-edit">
                <button type="button" onClick={() => addBrunchItem(gi)}><FiPlus /> Add Branch</button>
                {(group || []).map((b, bi) => (
                  <div className="branch-row" key={bi}>
                    <input
                      placeholder="Main Location"
                      value={b.mainLocation || ""}
                      onChange={(e) => updateBrunch(gi, bi, "mainLocation", e.target.value)}
                    />
                    <div className="addr-list">
                      {(b.brunchAddress || []).map((addr, ai) => (
                        <input
                          key={ai}
                          placeholder={`Address ${ai + 1}`}
                          value={addr}
                          onChange={(e) => updateBrunch(gi, bi, "brunchAddress", e.target.value, ai)}
                        />
                      ))}
                      <button type="button" onClick={() => addBrunchAddress(gi, bi)}><FiPlus /> Add Address</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="rowbtn">
              <button type="button" className="secondary" onClick={() => setOpenAdd(false)}>
                <FiX /> Close
              </button>
              <button className="primary" type="submit" disabled={busy}>
                <FiSave /> Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Dojo inline modal */}
      {editMode && editDojo && (
        <div className="overlay">
          <div className="modal">
            <h3>Edit Dojo</h3>
            <label>Name</label>
            <input
              value={editDojo.dojoName}
              onChange={(e) => setEditDojo({ ...editDojo, dojoName: e.target.value })}
            />
            <label>Type</label>
            <input
              value={editDojo.dojoType || ""}
              onChange={(e) => setEditDojo({ ...editDojo, dojoType: e.target.value })}
            />

            {/* You may add instructor/contact/brunch editors similarly here */}
            <div className="rowbtn">
              <button className="secondary" onClick={cancelEdit}><FiX /> Cancel</button>
              <button className="primary" onClick={() => saveEdit(editDojo)} disabled={busy}><FiSave /> Save</button>
            </div>
          </div>
        </div>
      )}

      {busy && <div className="busy">Working...</div>}
    </div>
  );
}
