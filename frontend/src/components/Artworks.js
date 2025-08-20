import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPublicArts } from "../actions/artActions";
import { addToCart } from "../actions/cartActions";
import { toast } from "react-toastify";

const Artworks = () => {
  const dispatch = useDispatch();
  const { publicArts, loading, error } = useSelector((state) => state.art);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [filteredArts, setFilteredArts] = useState([]);

  useEffect(() => {
    dispatch(listPublicArts());
  }, [dispatch]);

  useEffect(() => {
    let filtered = publicArts || [];

    // Apply search filter with case-insensitive matching
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (art) =>
          art.title?.toLowerCase().includes(searchLower) ||
          art.description?.toLowerCase().includes(searchLower) ||
          art.category?.toLowerCase().includes(searchLower) ||
          art.artist?.username?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter with case-insensitive matching
    if (category !== "all") {
      filtered = filtered.filter(
        (art) => art.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((art) => {
        const price = art.price || 0;
        return price >= min && price <= max;
      });
    }

    setFilteredArts(filtered);
  }, [publicArts, searchTerm, category, priceRange]);

  const categories = [
    "all",
    "Painting",
    "Drawing",
    "Sculpture",
    "Photography",
    "Digital Art",
    "Mixed Media",
  ];

  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under $100", value: "0-100" },
    { label: "$100 - $500", value: "100-500" },
    { label: "$500 - $1000", value: "500-1000" },
    { label: "Over $1000", value: "1000-999999" },
  ];

  const handleAddToCart = (artId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(addToCart(artId));
    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading artworks...</p>
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
    <div className="artworks-container">
      <h1 className="page-title">Explore Artworks</h1>
      <p className="page-subtitle">
        Discover amazing artworks from talented artists
      </p>

      <div className="filters-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="price-filter">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="artworks-grid">
        {filteredArts.map((art) => (
          <div key={art._id} className="artwork-card">
            <div className="artwork-image-container">
              <img
                src={
                  art.imageUrl || "/images/albert-dera-ILip77SbmOE-unsplash.jpg"
                }
                alt={art.title}
                className="artwork-image"
                onError={(e) => {
                  e.target.src = "/images/albert-dera-ILip77SbmOE-unsplash.jpg";
                }}
              />
            </div>
            <div className="artwork-info">
              <h3 className="artwork-title">{art.title}</h3>
              <p className="artwork-description">{art.description}</p>
              <div className="artwork-details">
                <span className="artwork-category">{art.category}</span>
                <span className="artwork-price">${art.price || 0}</span>
              </div>
              <div className="artist-info">
                <span className="artist-name">
                  By {art?.user?.username || "Unknown"}
                </span>
              </div>
              {art.status !== "SOLD" && (
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(art.id)}
                >
                  Add to Cart
                </button>
              )}
              {art.status === "SOLD" && (
                <button className="sold" disabled>
                  Sold
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredArts.length === 0 && (
        <div className="no-results">
          <p>No artworks found matching your criteria</p>
        </div>
      )}

      <style jsx>{`
        .artworks-container {
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

        .filters-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-filter input {
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          width: 300px;
          font-size: 1rem;
        }

        .category-filter select,
        .price-filter select {
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          min-width: 200px;
        }

        .artworks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }

        .artwork-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .artwork-card:hover {
          transform: translateY(-5px);
        }

        .artwork-image-container {
          position: relative;
          padding-top: 75%;
          background: #f3f4f6;
        }

        .artwork-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .artwork-info {
          padding: 1.5rem;
        }

        .artwork-title {
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .artwork-description {
          color: #666;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .artwork-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .artwork-category {
          background: #f3f4f6;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #666;
        }

        .artwork-price {
          font-weight: 600;
          color: #333;
        }

        .artist-info {
          color: #666;
          font-size: 0.9rem;
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: #666;
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
          .filters-container {
            flex-direction: column;
          }

          .search-filter input,
          .category-filter select,
          .price-filter select {
            width: 100%;
          }

          .artworks-grid {
            grid-template-columns: 1fr;
          }
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

        .sold {
          width: 100%;
          padding: 0.8rem;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Artworks;
