import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GalleryBoard.scss";
import { shubukan_api } from "../../../config.js";

// axios config
const api = axios.create({
  baseURL: shubukan_api,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function GalleryBoard() {
  const [galleries, setGalleries] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    category: "",
    tags: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterParams, setFilterParams] = useState({
    category: "",
    tags: "",
    year: "",
    sort: "year-desc",
    page: 1,
  });

  useEffect(() => {
    fetchGalleries();
  }, [filterParams]);

  const fetchGalleries = async () => {
    try {
      // const params = {
      //   ...filterParams,
      //   tags: filterParams.tags
      //     .split(",")
      //     .filter((tag) => tag.trim())
      //     .join(","),
      // };

      const { data } = await api.get("/gallery");
      setGalleries(data.items);
    } catch (error) {
      console.error("Full error:", error);
      setError(
        "Failed to fetch galleries: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", selectedImage);

      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          formDataToSend.append(
            key,
            formData[key]
              .split(",")
              .map((tag) => tag.trim())
              .join(",")
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.post("/gallery", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        title: "",
        description: "",
        year: "",
        category: "",
        tags: "",
      });
      setSelectedImage(null);
      fetchGalleries();
    } catch (error) {
      console.error("Submit error:", error); // Add this for debugging
      setError(
        "Failed to create gallery item: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-board">
      <div className="form-section">
        <p>Add New Gallery Item</p>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="text"
              id="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="tag1, tag2, tag3"
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <div className="line"></div>

      <div className="align-image">
        {galleries.map((gallery) => (
          <div key={gallery._id} className="image">
            <img src={gallery.image} alt={gallery.title} />

            <div className="image-info">
              <p className="info-label">Title</p>
              <p className="info-text">{gallery.title}</p>

              <p className="info-label">Description</p>
              <p className="info-text">{gallery.description}</p>

              <p className="info-label">Year</p>
              <p className="info-text">{gallery.year}</p>

              <p className="info-label">Category</p>
              <p className="info-text">{gallery.category}</p>

              <p className="info-label">Tags</p>
              <p className="info-text">{gallery.tags.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
