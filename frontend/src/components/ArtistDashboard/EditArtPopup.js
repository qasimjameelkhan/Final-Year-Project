import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateArt } from "../../actions/artActions";
import { toast } from "react-toastify";

const EditArtPopup = ({ art, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    status: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (art) {
      setFormData({
        title: art.title,
        description: art.description,
        category: art.category,
        price: art.price,
        status: art.status,
      });
      setPreview(art.imageUrl);
    }
  }, [art]);

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
      await dispatch(updateArt(art.id, formData));
      toast.success("Artwork updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update artwork");
    }
  };

  return (
    <div className="edit-popup-overlay">
      <div className="edit-popup">
        <div className="popup-header">
          <h2>Edit Artwork</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
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
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <div className="image-upload">
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
              />
              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>

        <style jsx>{`
          .edit-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .edit-popup {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #eee;
          }

          .popup-header h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #333;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
          }

          .edit-form {
            padding: 1.5rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
          }

          input,
          textarea,
          select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
          }

          textarea {
            resize: vertical;
            min-height: 100px;
          }

          .image-upload {
            margin-top: 0.5rem;
          }

          .image-preview {
            margin-top: 1rem;
          }

          .image-preview img {
            max-width: 100%;
            max-height: 200px;
            object-fit: contain;
            border-radius: 4px;
          }

          .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .cancel-btn,
          .save-btn {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
          }

          .cancel-btn {
            background: #f3f4f6;
            color: #333;
            border: 1px solid #ddd;
          }

          .save-btn {
            background: #4a90e2;
            color: white;
            border: none;
          }

          .cancel-btn:hover {
            background: #e5e7eb;
          }

          .save-btn:hover {
            background: #357abd;
          }
        `}</style>
      </div>
    </div>
  );
};

export default EditArtPopup;
