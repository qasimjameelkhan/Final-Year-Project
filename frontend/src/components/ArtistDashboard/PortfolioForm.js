import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPortfolio,
  updatePortfolio,
} from "../../actions/portfolioActions";
import { toast } from "react-toastify";

const PortfolioForm = ({ portfolio = null, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.portfolio);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (portfolio) {
      setFormData({
        title: portfolio.title || "",
        description: portfolio.description || "",
        file: null,
      });
      if (portfolio.fileUrl) {
        setPreview(portfolio.fileUrl);
      }
    }
  }, [portfolio]);

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
      // Log the form data before sending

      if (portfolio) {
        // For update, only include fields that have changed
        const updateData = {
          ...(formData.title !== portfolio.title && { title: formData.title }),
          ...(formData.description !== portfolio.description && {
            description: formData.description,
          }),
          ...(formData.file && { file: formData.file }),
        };

        await dispatch(updatePortfolio(portfolio.id, updateData));
        toast.success("Portfolio updated successfully");
        window.location.reload();
      } else {
        await dispatch(createPortfolio(formData));
        toast.success("Portfolio created successfully");
        window.location.reload();
      }
      onClose();
    } catch (err) {
      console.error("Error in form submission:", err);
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <div className="portfolio-form-container">
      <form onSubmit={handleSubmit} className="portfolio-form">
        <h2>{portfolio ? "Update Portfolio" : "Create Portfolio"}</h2>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter portfolio title"
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
            placeholder="Enter portfolio description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Image</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            accept="image/*"
            required={!portfolio}
          />
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : portfolio ? "Update" : "Create"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .portfolio-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .portfolio-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-weight: 600;
          color: #333;
        }

        input[type="text"],
        textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        input[type="file"] {
          padding: 10px 0;
        }

        .preview-container {
          margin-top: 10px;
        }

        .preview-image {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 4px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-cancel,
        .btn-submit {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-cancel {
          background: #f1f1f1;
          color: #333;
        }

        .btn-submit {
          background: #4caf50;
          color: white;
        }

        .btn-submit:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }

        .btn-cancel:hover {
          background: #e0e0e0;
        }

        .btn-submit:hover:not(:disabled) {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};

export default PortfolioForm;
