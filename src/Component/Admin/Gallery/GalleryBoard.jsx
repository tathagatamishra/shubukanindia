import React, { useState, useEffect } from "react";
import "./GalleryBoard.scss";
import { shubukan_api } from "../../../config.js";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";

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
      const { data } = await shubukan_api.get("/gallery");
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

  // create new gallery image
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

      // post api call
      await shubukan_api.post("/gallery", formDataToSend, {
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
      setImagePreview(null);
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

  // put api

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
