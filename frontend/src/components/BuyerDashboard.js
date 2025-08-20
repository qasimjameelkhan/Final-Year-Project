import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserOrders } from "../actions/orderActions";
import { getWalletDetails } from "../actions/walletActions";
import { toast } from "react-toastify";

const BuyerDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const { wallet } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(getUserOrders());
    dispatch(getWalletDetails());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Buyer Dashboard</h2>
        <div className="wallet-info">
          <span>Wallet Balance:</span>
          <span className="balance">${wallet?.amount?.toFixed(2) || 0}</span>
        </div>
      </div>

      <div className="purchases-section">
        <h3>Your Purchases</h3>
        {orders && orders.length > 0 ? (
          <div className="purchases-grid">
            {orders.map((order) => (
              <div key={order.id} className="purchase-card">
                <div className="purchase-image">
                  <img src={order.art.image} alt={order.art.title} />
                </div>
                <div className="purchase-details">
                  <h4>{order.art.title}</h4>
                  <p className="artist">By {order.art.user.username}</p>
                  <div className="purchase-info">
                    <div className="info-item">
                      <span>Price:</span>
                      <span>${order.totalPrice}</span>
                    </div>
                    <div className="info-item">
                      <span>Status:</span>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="info-item">
                      <span>Date:</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-purchases">
            <p>You haven't made any purchases yet.</p>
            <Link to="/artworks" className="browse-btn">
              Browse Artworks
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        h2 {
          color: #333;
          font-size: 1.8rem;
        }

        .wallet-info {
          background: #f8f9fa;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .balance {
          font-weight: bold;
          color: #28a745;
          font-size: 1.2rem;
        }

        .purchases-section {
          margin-top: 2rem;
        }

        h3 {
          color: #333;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .purchases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .purchase-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .purchase-card:hover {
          transform: translateY(-5px);
        }

        .purchase-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .purchase-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .purchase-details {
          padding: 1.5rem;
        }

        h4 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .artist {
          color: #666;
          margin-bottom: 1rem;
        }

        .purchase-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          color: #666;
        }

        .status {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status.completed {
          background: #d4edda;
          color: #155724;
        }

        .status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status.cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .no-purchases {
          text-align: center;
          padding: 3rem;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .browse-btn {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.8rem 1.5rem;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.3s ease;
        }

        .browse-btn:hover {
          background: #0056b3;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default BuyerDashboard;
