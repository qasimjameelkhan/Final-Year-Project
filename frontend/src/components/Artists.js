import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPublicArtists } from "../actions/usersAction";
import defaultImage from "../images/albert-dera-ILip77SbmOE-unsplash.jpg";
import { useNavigate } from "react-router-dom";

const Artists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { publicArtists, loading, error } = useSelector(
    (state) => state.allArtists
  );
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    dispatch(listPublicArtists());
  }, [dispatch]);

  const handleViewPortfolio = (artist) => {
    setSelectedArtist(artist);
  };

  const handleClosePortfolio = () => {
    setSelectedArtist(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading artists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading artists: {error}</p>
      </div>
    );
  }

  const handleNewChat = (artist) => {
    navigate(`/chat?receiverId=${artist.userid}`);
  };

  return (
    <div className="artists-container">
      <h1 className="page-title">Our Artists</h1>
      <p className="page-subtitle">
        Discover talented artists and their amazing works
      </p>

      <div className="artists-grid">
        {publicArtists?.map((artist) => (
          <div key={artist.userid} className="artist-card">
            <div className="artist-image-container">
              <img
                src={artist.profileImage || defaultImage}
                alt={artist.username}
                className="artist-image"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <div className="artist-info">
              <h3 className="artist-name">{artist.username}</h3>
              <p className="artist-bio">
                {artist.type === "ARTIST" ? "Artist" : "User"}
              </p>
              <div className="artist-stats">
                <span className="stat">
                  <strong>
                    {artist.isVerifiedArtist ? "Verified" : "Not Verified"}
                  </strong>
                </span>
              </div>
              <div className="artist-actions-buttons">
                <button
                  className="portfolio-button"
                  onClick={() => handleViewPortfolio(artist)}
                >
                  View Portfolio
                </button>
                <button
                  className="portfolio-button"
                  onClick={() => handleNewChat(artist)}
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedArtist && (
        <div className="portfolio-modal">
          <div className="portfolio-content">
            <button className="close-button" onClick={handleClosePortfolio}>
              ×
            </button>
            <div className="portfolio-header">
              <h2>{selectedArtist.username}'s Portfolio</h2>
              <p className="artist-type">
                {selectedArtist.type === "ARTIST" ? "Artist" : "User"}
                {selectedArtist.isVerifiedArtist && (
                  <span className="verified-badge">Verified</span>
                )}
              </p>
            </div>
            <div className="portfolio-grid">
              {selectedArtist.portfolio?.length > 0 ? (
                selectedArtist.portfolio.map((item, index) => (
                  <div key={index} className="portfolio-item">
                    <div className="portfolio-image-container">
                      <img
                        src={
                          item.image ||
                          "/images/albert-dera-ILip77SbmOE-unsplash.jpg"
                        }
                        alt={`Portfolio item ${index + 1}`}
                        onError={(e) => {
                          e.target.src =
                            "/images/albert-dera-ILip77SbmOE-unsplash.jpg";
                        }}
                      />
                    </div>
                    <div className="portfolio-item-info">
                      <h4>Portfolio Item {index + 1}</h4>
                      <p>
                        Uploaded on:{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-portfolio">
                  <p>No portfolio items available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .artists-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-title {
          font-size: 2.5rem;
          color: #333;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #666;
          text-align: center;
          margin-bottom: 2rem;
        }

        .artists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }

        .artist-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .artist-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        .artist-image-container {
          position: relative;
          padding-top: 100%;
          background: #f3f4f6;
        }

        .artist-actions-buttons {
          display: flex;
          flex-direction: row;
          gap: 10px;
          margin-top: 10px;
        }

        .artist-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .artist-info {
          padding: 1.5rem;
        }

        .artist-name {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .artist-bio {
          color: #666;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .artist-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat {
          color: #666;
        }

        .stat strong {
          color: #333;
        }

        .portfolio-button {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .portfolio-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .portfolio-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .portfolio-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .portfolio-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .portfolio-header h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .artist-type {
          color: #666;
          font-size: 1.1rem;
        }

        .verified-badge {
          background: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          margin-left: 0.5rem;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 1rem;
        }

        .portfolio-item {
          background: #f9fafb;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .portfolio-item:hover {
          transform: translateY(-5px);
        }

        .portfolio-image-container {
          position: relative;
          padding-top: 75%;
          background: #f3f4f6;
        }

        .portfolio-image-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .portfolio-item-info {
          padding: 1rem;
        }

        .portfolio-item-info h4 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .portfolio-item-info p {
          color: #666;
          font-size: 0.9rem;
        }

        .no-portfolio {
          text-align: center;
          padding: 2rem;
          color: #666;
          grid-column: 1 / -1;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background: #f3f4f6;
          color: #333;
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

        @media (max-width: 768px) {
          .artists-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-content {
            max-width: 95%;
            padding: 1rem;
          }

          .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Artists;
