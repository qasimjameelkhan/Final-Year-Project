import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPublicArts } from "../actions/artActions";
import { Link } from "react-router-dom";

const LatestArts = () => {
  const dispatch = useDispatch();
  const { publicArts, loading, error } = useSelector((state) => state.art);

  useEffect(() => {
    dispatch(listPublicArts());
  }, [dispatch]);

  // Get the latest 20 arts
  const latestArts = publicArts.slice(0, 20);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { text: "Draft", className: "status-draft" },
      PUBLISHED: { text: "Available", className: "status-published" },
      SOLD: { text: "Sold", className: "status-sold" },
    };

    const config = statusConfig[status] || {
      text: status,
      className: "status-default",
    };
    return (
      <span className={`status-badge ${config.className}`}>{config.text}</span>
    );
  };

  const handleAddToCart = (art) => {
    // Will implement cart functionality later
    console.log("Added to cart:", art);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading latest artworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading artworks: {error}</p>
      </div>
    );
  }

  return (
    <div className="latest-arts-container">
      <h2 className="section-title">Latest Artworks</h2>
      <div className="arts-grid">
        {latestArts.map((art) => (
          <Link to={`/art/${art.id}`} key={art.id} className="art-card">
            <div className="art-image-container">
              <img src={art.imageUrl} alt={art.title} className="art-image" />
              {getStatusBadge(art.status)}
              <div className="art-overlay">
                <div className="art-info">
                  <h3 className="art-title">{art.title}</h3>
                  <div className="artist-info">
                    <img
                      src={art.user?.profileImage || "/default-avatar.png"}
                      alt={art.user?.username}
                      className="artist-avatar"
                    />
                    <span className="artist-name">{art.user?.username}</span>
                  </div>
                  <div className="art-meta">
                    <p className="art-date">{formatDate(art.createdAt)}</p>
                    <p className="art-price">${art.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .latest-arts-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .section-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 2rem;
          text-align: center;
        }

        .arts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }

        .art-card {
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease;
        }

        .art-card:hover {
          transform: translateY(-5px);
        }

        .art-image-container {
          position: relative;
          padding-top: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .art-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .art-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }

        .art-card:hover .art-overlay {
          opacity: 1;
        }

        .art-info {
          color: white;
          width: 100%;
        }

        .art-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .artist-info {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .artist-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 8px;
          object-fit: cover;
        }

        .artist-name {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .art-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .art-date {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .art-price {
          font-size: 1rem;
          font-weight: 600;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
          z-index: 2;
        }

        .status-draft {
          background-color: #6b7280;
        }

        .status-published {
          background-color: #10b981;
        }

        .status-sold {
          background-color: #ef4444;
        }

        .status-default {
          background-color: #4b5563;
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

        .add-to-cart-button {
          width: 100%;
          padding: 0.75rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .add-to-cart-button:hover {
          background: #4338ca;
          transform: translateY(-2px);
        }

        .add-to-cart-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default LatestArts;
