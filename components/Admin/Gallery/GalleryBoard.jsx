import React, { useState, useEffect } from "react";
import "./GalleryBoard.scss";
import { shubukan_api } from "../../../config.js";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { FiSave, FiX } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { IoIosWarning } from "react-icons/io";
import { FiPlus } from "react-icons/fi";

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

  const [imgOverlay, setImgOverlay] = useState(false);
  const [imgInfo, setImgInfo] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [imgOfIndex, setImgOfIndex] = useState(null);
  const [imgIndex, setImgIndex] = useState(null);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openAddImage, setOpenAddImage] = useState(false);
  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    year: "",
    category: "",
    tags: "",
  });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setShowDeleteBox(false);
    setEditMode(false);
    setEditImage(null);
    // setEditImagePreview(null);
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

  const handleEditInputChange = (e) => {
    const { id, value } = e.target;
    setEditData((prev) => ({
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

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImage(file);

      // Create image preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEdit = (gallery) => {
    setEditData({
      title: gallery.title,
      description: gallery.description,
      year: gallery.year,
      category: gallery.category,
      tags: gallery.tags.join(", "),
    });
    setEditMode(true);
    setEditImage(null);
    setEditImagePreview(gallery.image);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditData({
      title: "",
      description: "",
      year: "",
      category: "",
      tags: "",
    });
    setEditImage(null);
    setEditImagePreview(null);
    setImgInfo(true);
  };

  const handleUpdate = async (galleryId) => {
    setUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      let imageUrl = null;

      // If new image is selected, upload it to Cloudinary first
      if (editImage) {
        // Step 1: Get upload signature from backend
        const { data: signatureData } = await shubukan_api.post(
          "/gallery/signature",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Step 2: Prepare data for Cloudinary
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", editImage);
        cloudinaryData.append("api_key", signatureData.apiKey);
        cloudinaryData.append("timestamp", signatureData.timestamp);
        cloudinaryData.append("signature", signatureData.signature);
        cloudinaryData.append("folder", "Shubukan/Gallery");

        // Step 3: Upload directly to Cloudinary
        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          cloudinaryData
        );

        imageUrl = cloudinaryResponse.data.secure_url;
      }

      // Prepare update data
      const updateData = {
        token: token,
        title: editData.title,
        description: editData.description,
        year: editData.year,
        category: editData.category,
        tags: editData.tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),
      };

      // Add image URL if new image was uploaded
      if (imageUrl) {
        updateData.image = imageUrl;
      }

      console.log(updateData);

      // Update gallery item
      await shubukan_api.put(`/gallery/${galleryId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // handleDelete(galleryId);

      // Reset states and refresh galleries
      // setEditMode(false);
      setEditData({
        title: "",
        description: "",
        year: "",
        category: "",
        tags: "",
      });
      setEditImage(null);
      setEditImagePreview(null);
      // setImgInfo(true);
      setImgOverlay(false);
      fetchGalleries();
    } catch (error) {
      console.error("Update error:", error);
      setError(
        "Failed to update gallery item: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setUpdating(false);
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

      // Step 1: Get upload signature from backend
      const { data: signatureData } = await shubukan_api.post(
        "/gallery/signature",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        // image url from cloudinary
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
      await shubukan_api.post("/gallery", galleryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowDeleteBox(false);
      setImgIndex(null);
      fetchGalleries();
      setDeleting(false);
      setImgOverlay(false);
      setImgOfIndex(null);
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
    <div className={`gallery-board ${imgOverlay && "!overflow-y-hidden"}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="0"
        width="0"
        className="wobble"
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

      <div className="align-image">
        {galleries.map((gallery, index) => (
          <div
            key={gallery._id}
            className="image"
            onClick={() => {
              setImgOverlay(true);
              setImgIndex(index);
              setImgOfIndex(gallery);
              setImgInfo(true);
            }}
          >
            <img
              src={gallery.image}
              alt={gallery.title}
              // className={`${imgIndex === index ? "w-[100px]" : "w-full"}`}
            />
          </div>
        ))}
      </div>

      {imgOverlay && (
        <div className="popOverlay">
          <div className="popupModal">
            {/* image info */}
            {imgInfo && (
              <div className="image-info">
                <p className="info-label">Image</p>
                <img src={imgOfIndex.image} className="info-img" />

                <p className="info-label">Title</p>
                <p className="info-text">{imgOfIndex.title}</p>

                <p className="info-label">Description</p>
                <p className="info-text">{imgOfIndex.description}</p>

                <p className="info-label">Year</p>
                <p className="info-text">{imgOfIndex.year}</p>

                <p className="info-label">Category</p>
                <p className="info-text">{imgOfIndex.category}</p>

                <p className="info-label">Tags</p>
                <p className="info-text">{imgOfIndex.tags.join(", ")}</p>
              </div>
            )}

            {/* image info buttons */}
            {imgInfo && (
              <div className="button-div">
                <button
                  className="bg-[#edbdb4]"
                  onClick={() => {
                    setShowDeleteBox(true);
                  }}
                >
                  <RiDeleteBin2Line />
                  <p>Delete</p>
                </button>

                <button
                  className="bg-[#c6edb4]"
                  onClick={() => {
                    setEditMode(true);
                    setImgInfo(false);
                    startEdit(imgOfIndex);
                  }}
                >
                  <FiEdit />
                  <p>Edit</p>
                </button>

                <button
                  className="bg-[#ebe4ab]"
                  onClick={() => setImgOverlay(false)}
                >
                  <RxCross2 />
                  <p>Close</p>
                </button>
              </div>
            )}

            {/* image edit form */}
            {editMode && (
              <div className="edit-mode">
                <label htmlFor="edit-image" className="info-label">
                  Update Image
                </label>

                {editImagePreview && (
                  <img
                    src={editImagePreview}
                    alt="Edit Preview"
                    className="image-preview"
                  />
                )}

                <input
                  type="file"
                  id="edit-image"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="edit-image-input"
                />

                <label htmlFor="edit-title" className="info-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={editData.title}
                  onChange={handleEditInputChange}
                />

                <label htmlFor="edit-description" className="info-label">
                  Description
                </label>
                <textarea
                  id="description"
                  value={editData.description}
                  onChange={handleEditInputChange}
                />

                <label htmlFor="edit-year" className="info-label">
                  Year
                </label>
                <input
                  type="text"
                  id="year"
                  value={editData.year}
                  onChange={handleEditInputChange}
                />

                <label htmlFor="edit-category" className="info-label">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={editData.category}
                  onChange={handleEditInputChange}
                />

                <label htmlFor="edit-tags" className="info-label">
                  Tags
                </label>
                <textarea
                  id="tags"
                  value={editData.tags}
                  onChange={handleEditInputChange}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            )}

            {/* edit form buttons */}
            {editMode && (
              <div className="button-div gap-[40px]">
                <button
                  className="bg-[#c6edb4] !w-full"
                  onClick={() => handleUpdate(imgOfIndex._id)}
                  disabled={updating}
                >
                  <FiSave />
                  {updating ? "Saving..." : "Save"}
                </button>

                <button
                  className="bg-[#edbdb4] !w-full"
                  onClick={cancelEdit}
                  disabled={updating}
                >
                  <FiX />
                  Cancel
                </button>
              </div>
            )}

            {/* delete modal */}
            {showDeleteBox && (
              <div className="del-popup">
                <div className="del-modal">
                  <IoIosWarning className="warning" />

                  <p className="info-label">Do you really want to delete?</p>

                  <div className="w-full flex flex-row items-center justify-between gap-[40px]">
                    <button
                      className="red bg-[#edbdb4] text-[#000] w-full"
                      onClick={() => {
                        handleDelete(imgOfIndex._id);
                        setShowDeleteBox(false);
                      }}
                    >
                      Yes
                    </button>

                    <button
                      className="green bg-[#c6edb4] text-[#000] !w-full !justify-center"
                      onClick={() => {
                        setShowDeleteBox(false);
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* loader */}
            {(deleting || updating) && (
              <div className="loading">
                <br />
                <br />
                <br /> {deleting ? "Deleting..." : "Updating..."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* add new image */}
      {openAddImage && (
        <div className="popOverlay">
          <form className="popupModal" onSubmit={handleSubmit}>
            <div className="edit-mode">
              <label className="info-label" htmlFor="image">
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              )}

              <label className="info-label" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              <label className="info-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />

              <label className="info-label" htmlFor="category">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />

              <label className="info-label" htmlFor="year">
                Year
              </label>
              <input
                type="text"
                id="year"
                value={formData.year}
                onChange={handleInputChange}
                required
              />

              <label className="info-label" htmlFor="tags">
                Tags (comma-separated)
              </label>
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
              className="bottom-group"
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
                <div className="w-full flex justify-end gap-[26px]">
                  <button
                    disabled={loading}
                    className="bg-[#edbdb4]"
                    onClick={() => setOpenAddImage(false)}
                  >
                    <FiX />
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#c6edb4]"
                  >
                    <FiSave />
                    Submit
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="add-image">
        <button onClick={() => setOpenAddImage(true)}>
          <FiPlus />
          Add a new image
        </button>
      </div>
    </div>
  );
}
