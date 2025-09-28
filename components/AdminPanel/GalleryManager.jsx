"use client";
import React, { useState, useEffect } from "react";
import { shubukan_api } from "@/config";
import axios from "axios";
import { FiEdit, FiSave, FiX, FiPlus, FiUpload } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoIosWarning } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

export default function GalleryManager() {
  const [galleries, setGalleries] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    category: "",
    tags: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openAddImage, setOpenAddImage] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Edit state
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await shubukan_api.get("/gallery?limit=1000");
      setGalleries(res.data.images || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch galleries");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (editMode) {
      setEditData((p) => ({ ...p, [id]: value }));
    } else {
      setFormData((p) => ({ ...p, [id]: value }));
    }
  };

  const handleImageChange = (e, forEdit = false) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        forEdit
          ? setEditImagePreview(reader.result)
          : setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      forEdit ? setEditImage(file) : setSelectedImage(file);
    }
  };

  // Upload to Cloudinary with backend signature
  const uploadToCloudinary = async (file) => {
    const token = localStorage.getItem("adminToken");
    const { data: sig } = await shubukan_api.post(
      "/gallery/signature",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", sig.timestamp);
    form.append("signature", sig.signature);
    form.append("folder", "Shubukan/Gallery");

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      form,
      {
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      }
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedImage) return setError("Select image first");
      const url = await uploadToCloudinary(selectedImage);
      const token = localStorage.getItem("adminToken");

      await shubukan_api.post(
        "/gallery",
        {
          image: url,
          ...formData,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .join(","),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchGalleries();
      setFormData({
        title: "",
        description: "",
        year: "",
        category: "",
        tags: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setOpenAddImage(false);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await shubukan_api.delete(`/gallery/perma/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGalleries();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      let imageUrl = editImage
        ? await uploadToCloudinary(editImage)
        : undefined;

      const updateData = {
        ...editData,
        tags: editData.tags
          .split(",")
          .map((t) => t.trim())
          .join(","),
      };
      if (imageUrl) updateData.image = imageUrl;

      await shubukan_api.put(`/gallery/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchGalleries();
      setEditMode(null);
      setEditImage(null);
      setEditImagePreview(null);
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gallery Manager</h1>

      {/* Add button */}
      <button
        onClick={() => setOpenAddImage(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <FiPlus /> Add Image
      </button>

      {/* Add new image modal */}
      {openAddImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg w-[500px] space-y-3"
          >
            <div className="w-full border p-2 flex items-center gap-4">
              <FiUpload />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            {imagePreview && (
              <img src={imagePreview} className="w-full h-48 object-cover" />
            )}
            <input
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border p-2"
              required
            />
            <textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border p-2"
              required
            />
            <input
              id="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
            <input
              id="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
            <input
              id="tags"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full border p-2"
            />

            {error && <p className="text-red-500">{error}</p>}
            {loading && uploadProgress > 0 && (
              <p>Uploading: {uploadProgress}%</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenAddImage(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                <FiX /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                <FiSave /> Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleries.map((g) => (
          <div key={g._id} className="bg-white shadow p-2 rounded">
            <img
              src={g.image}
              alt={g.title}
              className="w-full h-40 object-cover rounded"
            />
            {editMode === g._id ? (
              <div className="space-y-2 mt-2">
                <input
                  id="title"
                  value={editData.title}
                  onChange={handleInputChange}
                  className="w-full border p-1"
                />
                <textarea
                  id="description"
                  value={editData.description}
                  onChange={handleInputChange}
                  className="w-full border p-1"
                />
                <input
                  id="year"
                  value={editData.year}
                  onChange={handleInputChange}
                  className="w-full border p-1"
                />
                <input
                  id="category"
                  value={editData.category}
                  onChange={handleInputChange}
                  className="w-full border p-1"
                />
                <input
                  id="tags"
                  value={editData.tags}
                  onChange={handleInputChange}
                  className="w-full border p-1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                />
                {editImagePreview && (
                  <img
                    src={editImagePreview}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleUpdate(g._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    <FiSave /> Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm">
                <p className="font-semibold">{g.title}</p>
                <p>{g.description}</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => {
                      setEditMode(g._id);
                      setEditData({ ...g, tags: g.tags.join(", ") });
                      setEditImagePreview(g.image);
                    }}
                    className="text-blue-500 flex items-center gap-1"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(g._id)}
                    className="text-red-500 flex items-center gap-1"
                  >
                    <RiDeleteBin2Line /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
