import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getPublicArtDetails } from "../actions/artActions";
import { Recommendation } from "./Recommendation";

const ArtDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { publicArt, loading, error } = useSelector((state) => state.art);

  useEffect(() => {
    dispatch(getPublicArtDetails(id));
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading artwork details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading artwork: {error}</p>
      </div>
    );
  }

  if (!publicArt) {
    return (
      <div className="not-found-container">
        <p>Artwork not found</p>
      </div>
    );
  }

  console.log("Public Art Details:", publicArt);

  return (
    <div className="art-details-container">
      <div className="art-details-grid">
        <div className="art-image-section">
          <img
            src={publicArt.imageUrl}
            alt={publicArt.title}
            className="art-image"
          />
          <div className="art-status">
            <span className={`status-badge ${publicArt.status.toLowerCase()}`}>
              {publicArt.status}
            </span>
          </div>
        </div>

        <div className="art-info-section">
          <h1 className="art-title">{publicArt.title}</h1>
          <p className="art-description">{publicArt.description}</p>

          <div className="art-meta">
            <div className="meta-item">
              <span className="meta-label">Price:</span>
              <span className="meta-value">${publicArt.price}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{publicArt.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Created:</span>
              <span className="meta-value">
                {formatDate(publicArt.createdAt)}
              </span>
            </div>
          </div>

          <div className="artist-section">
            <h2 className="section-title">Artist Information</h2>
            <div className="artist-card">
              <img
                src={publicArt.user?.profileImage || "/default-avatar.png"}
                alt={publicArt.user?.name}
                className="artist-avatar"
              />
              <div className="artist-info">
                <h3 className="artist-name">{publicArt.user?.name}</h3>
                <p className="artist-bio">
                  {publicArt.user?.bio || "No bio available"}
                </p>
                <div className="artist-contact">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">{publicArt.user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {publicArt.status === "PUBLISHED" && (
            <button className="purchase-button">Purchase Artwork</button>
          )}
        </div>
      </div>

      <div>
        <Recommendation latestArts={publicArt.relatedArts} />
      </div>

      <style jsx>{`
        .art-details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .art-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .art-image-section {
          position: relative;
        }

        .art-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .art-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
        }

        .status-badge.draft {
          background-color: #6b7280;
        }

        .status-badge.published {
          background-color: #10b981;
        }

        .status-badge.sold {
          background-color: #ef4444;
        }

        .art-info-section {
          padding: 1rem;
        }

        .art-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .art-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .art-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
        }

        .meta-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .meta-value {
          font-size: 1rem;
          color: #333;
          font-weight: 500;
        }

        .artist-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .section-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .artist-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .artist-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        }

        .artist-info {
          flex: 1;
        }

        .artist-name {
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .artist-bio {
          color: #666;
          margin-bottom: 0.5rem;
        }

        .artist-contact {
          display: flex;
          gap: 0.5rem;
          color: #666;
        }

        .contact-label {
          font-weight: 500;
        }

        .purchase-button {
          width: 100%;
          padding: 1rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 2rem;
        }

        .purchase-button:hover {
          background: #059669;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-container {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
          background: #fee2e2;
          border-radius: 8px;
          margin: 2rem auto;
          max-width: 600px;
        }

        .not-found-container {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .art-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ArtDetails;
