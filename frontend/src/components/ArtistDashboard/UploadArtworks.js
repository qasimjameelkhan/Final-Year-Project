import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createArt } from "../../actions/artActions";
import { toast } from "react-toastify";

const UploadArtworks = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.art);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createArt(formData));
      toast.success("Artwork uploaded successfully");
      window.location.reload();
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        file: null,
      });
      setPreview(null);
    } catch (err) {
      console.error("Error in form submission:", err);
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <div className="upload-artworks-container">
      <h2>Upload Artworks</h2>
      <p className="subtitle">Share your creative work with the world</p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title">Artwork Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter artwork title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your artwork"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="painting">Painting</option>
              <option value="sculpture">Sculpture</option>
              <option value="photography">Photography</option>
              <option value="digital">Digital Art</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="file">Artwork Image</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="file-input"
            />
            <label htmlFor="file" className="file-label">
              Choose File
            </label>
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload Artwork"}
        </button>
      </form>

      <style jsx>{`
        .upload-artworks-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #333;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #666;
          margin-bottom: 2rem;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          font-weight: 600;
          color: #444;
        }

        input,
        textarea,
        select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #4a90e2;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .file-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .file-input {
          display: none;
        }

        .file-label {
          padding: 0.75rem 1.5rem;
          background: #f5f5f5;
          border: 2px dashed #ddd;
          border-radius: 6px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .file-label:hover {
          background: #e9e9e9;
          border-color: #4a90e2;
        }

        .preview-container {
          margin-top: 1rem;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .submit-btn {
          padding: 1rem 1.5rem;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #357abd;
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default UploadArtworks;
