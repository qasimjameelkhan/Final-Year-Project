import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listArts, deleteArt } from "../../actions/artActions";
import { toast } from "react-toastify";
import EditArtPopup from "./EditArtPopup";

const ArtList = () => {
  const dispatch = useDispatch();
  const { arts, loading, error } = useSelector((state) => state.art);
  const [editingArt, setEditingArt] = useState(null);
  const [artToDelete, setArtToDelete] = useState(null);

  useEffect(() => {
    dispatch(listArts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    setArtToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteArt(artToDelete));
      toast.success("Artwork deleted successfully");
      setArtToDelete(null);
    } catch (err) {
      toast.error(error || "Failed to delete artwork");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "status-draft";
      case "PUBLISHED":
        return "status-published";
      case "SOLD":
        return "status-sold";
      default:
        return "status-default";
    }
  };

  return (
    <div className="art-list-container">
      <h2>My Artworks</h2>
      <p className="subtitle">Manage your uploaded artworks</p>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="art-grid">
          {arts.map((art) => (
            <div key={art.id} className="art-card">
              <div className="art-image-container">
                <img src={art.imageUrl} alt={art.title} className="art-image" />
                <div className={`status-badge ${getStatusColor(art.status)}`}>
                  {art.status}
                </div>
              </div>
              <div className="art-details">
                <h3 className="art-title">{art.title}</h3>
                <p className="art-description">{art.description}</p>
                <div className="art-meta">
                  <span className="art-category">{art.category}</span>
                  <span className="art-price">${art.price}</span>
                </div>
                {art.status !== "SOLD" && (
                  <div className="art-actions">
                    <button
                      onClick={() => setEditingArt(art)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingArt && (
        <EditArtPopup art={editingArt} onClose={() => setEditingArt(null)} />
      )}

      {artToDelete && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this artwork? This action cannot
              be undone.
            </p>
            <div className="confirmation-actions">
              <button
                onClick={() => setArtToDelete(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .art-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
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

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .error {
          color: #dc2626;
          padding: 1rem;
          background: #fee2e2;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .art-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .art-card {
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .art-card:hover {
          transform: translateY(-5px);
        }

        .art-image-container {
          position: relative;
          padding-top: 75%;
        }

        .art-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
        }

        .status-draft {
          background-color: #d97706;
        }

        .status-published {
          background-color: #059669;
        }

        .status-sold {
          background-color: #dc2626;
        }

        .status-default {
          background-color: #4b5563;
        }

        .art-details {
          padding: 1.5rem;
        }

        .art-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .art-description {
          color: #666;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .art-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .art-category {
          color: #4a90e2;
          font-weight: 500;
        }

        .art-price {
          color: #333;
          font-weight: 600;
        }

        .art-actions {
          display: flex;
          gap: 1rem;
        }

        .edit-btn,
        .delete-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .edit-btn {
          background: #4a90e2;
          color: white;
          border: none;
        }

        .edit-btn:hover {
          background: #357abd;
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        .delete-confirmation-overlay {
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

        .delete-confirmation {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }

        .delete-confirmation h3 {
          margin: 0 0 1rem;
          color: #333;
        }

        .delete-confirmation p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .confirmation-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .cancel-btn,
        .confirm-btn {
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #333;
          border: 1px solid #ddd;
        }

        .confirm-btn {
          background: #dc2626;
          color: white;
          border: none;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .confirm-btn:hover {
          background: #b91c1c;
        }
      `}</style>
    </div>
  );
};

export default ArtList;
