import React, { useState, useEffect } from "react";
import "./GalleryBoard.scss";
import { shubukan_api } from "../../../config.js";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";

import axios from "axios";

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
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [imgIndex, setImgIndex] = useState(null);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setShowDeleteBox(false);
  }, [imgIndex]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  // get api call
  const fetchGalleries = async () => {
    try {
      const response = await shubukan_api.get("/gallery");
      setGalleries(response.data.images);
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
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create image preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct upload to Cloudinary then save metadata to your backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      if (!selectedImage) {
        setError("Please select an image");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("adminToken");
      console.log(token);

      // Step 1: Get upload signature from backend
      const { data: signatureData } = await shubukan_api.post(
        "/gallery/signature",
        { token: token }
      );

      // Step 2: Prepare data for Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", selectedImage);
      cloudinaryData.append("api_key", signatureData.apiKey);
      cloudinaryData.append("timestamp", signatureData.timestamp);
      cloudinaryData.append("signature", signatureData.signature);
      cloudinaryData.append("folder", "Shubukan/Gallery");

      // Step 3: Upload directly to Cloudinary with progress tracking
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        cloudinaryData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Step 4: Send image URL and metadata to your backend
      const galleryData = {
        image: cloudinaryResponse.data.secure_url,
        title: formData.title,
        description: formData.description,
        year: formData.year,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),
      };

      // Create a new endpoint in your backend to handle pre-uploaded images
      await shubukan_api.post("/gallery", galleryData);

      // Reset form and states
      setFormData({
        title: "",
        description: "",
        year: "",
        category: "",
        tags: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setUploadProgress(0);
      fetchGalleries();
    } catch (error) {
      console.error("Submit error:", error);
      setError(
        "Failed to create gallery item: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // delete api
  const handleDelete = async (id) => {
    try {
      setDeleting(true);

      const token = localStorage.getItem("adminToken");

      await shubukan_api.delete(`/gallery/perma/${id}`, {
        data: { token: token },
      });

      setShowDeleteBox(false);
      setImgIndex(null);
      fetchGalleries();
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      console.error("Delete error:", error);
      setError(
        "Failed to delete gallery item: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="gallery-board">
      <div className="form-section">
        <p className="form-title">Add New Gallery Item</p>

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

            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
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
            <textarea
              type="text"
              id="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="tag1, tag2, tag3"
              required
            />
          </div>

          <div
            className="form-group"
            style={
              error
                ? { justifyContent: "space-between" }
                : { justifyContent: "flex-end" }
            }
          >
            {error && (
              <p className="error-message">
                <IoWarningOutline />
                {error}
              </p>
            )}

            {loading && uploadProgress > 0 ? (
              <div className="upload-progress">
                <div className="progress-bar">
                  <p>Uploading: {uploadProgress}%</p>

                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button type="submit" disabled={loading}>
                Submit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="line"></div>

      <div className="align-image">
        {galleries.map((gallery, index) => (
          <div
            key={gallery._id}
            className="image"
            onClick={() => {
              setImgIndex(index);
            }}
          >
            <img src={gallery.image} alt={gallery.title} />

            {imgIndex === index &&
              (showDeleteBox ? (
                <div className="image-info">
                  <p
                    className="info-label"
                    style={{ borderBottom: "none", marginBottom: "10px" }}
                  >
                    Do you really want to delete?
                  </p>

                  <div className="btns">
                    <button
                      className="red"
                      onClick={() => handleDelete(gallery._id)}
                    >
                      Yes
                    </button>

                    <button
                      className="green"
                      onClick={() => {
                        setShowDeleteBox(false);
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
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

                  <div className="btns">
                    <button className="green">
                      <FiEdit />
                    </button>

                    <button
                      className="red"
                      onClick={() => {
                        setShowDeleteBox(true);
                      }}
                    >
                      <RiDeleteBin2Line />
                    </button>
                  </div>
                </div>
              ))}

            {deleting && imgIndex === index && (
              <div className="loading">
                <br />
                <br />
                <br /> Deleting...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
