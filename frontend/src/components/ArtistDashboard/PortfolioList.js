import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listPortfolios,
  deletePortfolio,
} from "../../actions/portfolioActions";
import { toast } from "react-toastify";
import PortfolioForm from "./PortfolioForm";

const PortfolioList = () => {
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector(
    (state) => state.portfolio
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  useEffect(() => {
    dispatch(listPortfolios());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      try {
        await dispatch(deletePortfolio(id));
        toast.success("Portfolio deleted successfully");
      } catch (err) {
        toast.error(error || "Something went wrong");
      }
    }
  };

  const handleEdit = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPortfolio(null);
  };

  return (
    <div className="portfolio-list-container">
      <div className="portfolio-header">
        <h2>My Portfolio</h2>
        <button onClick={() => setShowForm(true)} className="btn-add">
          Add New Portfolio
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <PortfolioForm
              portfolio={selectedPortfolio}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : portfolios.length === 0 ? (
        <div className="no-portfolios">No portfolios found. Create one!</div>
      ) : (
        <div className="portfolio-grid">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="portfolio-card">
              <div className="portfolio-image">
                <img src={portfolio.fileUrl} alt={portfolio.title} />
              </div>
              <div className="portfolio-info">
                <h3>{portfolio.title}</h3>
                <p>{portfolio.description}</p>
                <div className="portfolio-actions">
                  <button
                    onClick={() => handleEdit(portfolio)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .portfolio-list-container {
          padding: 20px;
        }

        .portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .btn-add {
          padding: 10px 20px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .btn-add:hover {
          background: #45a049;
        }

        .modal {
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

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .portfolio-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .portfolio-card:hover {
          transform: translateY(-5px);
        }

        .portfolio-image {
          height: 200px;
          overflow: hidden;
        }

        .portfolio-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .portfolio-info {
          padding: 15px;
        }

        .portfolio-info h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .portfolio-info p {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
        }

        .portfolio-actions {
          display: flex;
          gap: 10px;
        }

        .btn-edit,
        .btn-delete {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-edit {
          background: #2196f3;
          color: white;
        }

        .btn-delete {
          background: #f44336;
          color: white;
        }

        .btn-edit:hover {
          background: #1976d2;
        }

        .btn-delete:hover {
          background: #d32f2f;
        }

        .loading,
        .error,
        .no-portfolios {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .error {
          color: #f44336;
        }
      `}</style>
    </div>
  );
};

export default PortfolioList;
