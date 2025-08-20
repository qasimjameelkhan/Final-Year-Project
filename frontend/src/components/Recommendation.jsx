import React from "react";
import { Link } from "react-router-dom";

export const Recommendation = ({ latestArts }) => {
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

  return (
    <div className="latest-arts-container">
      <h2 className="section-title">Recommended Arts</h2>
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
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        .section-title {
          font-size: 2.25rem;
          font-weight: bold;
          color: #1f2937;
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .arts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }

        .art-card {
          display: block;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease;
        }

        .art-card:hover {
          transform: translateY(-6px);
        }

        .art-image-container {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 1rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .art-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .art-card:hover .art-image {
          transform: scale(1.05);
        }

        .art-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6),
            transparent 60%
          );
          display: flex;
          align-items: flex-end;
          padding: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .art-card:hover .art-overlay {
          opacity: 1;
        }

        .art-info {
          color: #fff;
          width: 100%;
        }

        .art-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .artist-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .artist-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }

        .artist-name {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .art-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          opacity: 0.9;
        }

        .art-price {
          font-weight: 600;
          color: #facc15;
        }

        .status-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 10;
          color: #fff;
        }

        .status-draft {
          background-color: #6b7280;
        }

        .status-published,
        .status-live {
          background-color: #22c55e;
        }

        .status-sold {
          background-color: #ef4444;
        }

        .status-default {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  );
};
