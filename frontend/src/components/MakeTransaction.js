import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getWalletDetails, clearErrors } from "../actions/walletActions";
import { getCart } from "../actions/cartActions";
import {
  createOrder,
  clearErrors as clearOrderErrors,
} from "../actions/orderActions";

const MakeTransaction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const {
    wallet,
    loading: walletLoading,
    error: walletError,
  } = useSelector((state) => state.wallet);
  const {
    loading: orderLoading,
    error: orderError,
    order,
  } = useSelector((state) => state.order);

  useEffect(() => {
    if (walletError) {
      toast.error(walletError);
      dispatch(clearErrors());
    }
    if (orderError) {
      toast.error(orderError);
      dispatch(clearOrderErrors());
    }
    if (order) {
      toast.success("Order placed successfully!");
      navigate("/buyer-dashboard");
    }
  }, [walletError, orderError, order, dispatch, navigate]);

  useEffect(() => {
    dispatch(getWalletDetails());
    dispatch(getCart());
  }, [dispatch]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.art.price, 0);
  };

  const calculateCommission = () => {
    const subtotal = calculateTotal();
    return (subtotal * 0.05).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateTotal();
    const commission = parseFloat(calculateCommission());
    return (subtotal + commission).toFixed(2);
  };

  const handleConfirmTransaction = () => {
    // Create orders for each cart item
    cartItems.forEach((item) => {
      dispatch(
        createOrder({
          artId: item.art.id,
          quantity: 1,
        })
      );
    });
  };

  if (walletLoading || orderLoading) {
    return <div className="loading">Loading...</div>;
  }

  const totalAmount = parseFloat(calculateGrandTotal());
  const remainingBalance = wallet ? wallet.amount - totalAmount : 0;

  return (
    <div className="transaction-container">
      <div className="transaction-card">
        <h2>Confirm Your Purchase</h2>

        <div className="transaction-details">
          <div className="detail-item">
            <span>Total Items:</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="detail-item">
            <span>Subtotal:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>

          <div className="detail-item">
            <span>Commission (5%):</span>
            <span>${calculateCommission()}</span>
          </div>

          <div className="detail-item total">
            <span>Total Amount:</span>
            <span>${totalAmount}</span>
          </div>

          <div className="detail-item">
            <span>Current Wallet Balance:</span>
            <span>${wallet?.amount?.toFixed(2) || 0}</span>
          </div>

          <div className="detail-item remaining">
            <span>Remaining Balance:</span>
            <span>${remainingBalance.toFixed(2)}</span>
          </div>
        </div>

        <div className="transaction-actions">
          <Link to="/cart" className="back-btn">
            Back to Cart
          </Link>
          <button
            className="confirm-btn"
            onClick={handleConfirmTransaction}
            disabled={remainingBalance < 0}
          >
            Confirm Purchase
          </button>
        </div>
      </div>

      <style jsx>{`
        .transaction-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .transaction-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
        }

        .transaction-details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.8rem 0;
          border-bottom: 1px solid #eee;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-item.total {
          font-weight: bold;
          font-size: 1.1rem;
          color: #333;
        }

        .detail-item.remaining {
          font-weight: bold;
          color: ${remainingBalance >= 0 ? "#28a745" : "#dc3545"};
        }

        .transaction-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .back-btn,
        .confirm-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn {
          background: #f8f9fa;
          color: #333;
          text-decoration: none;
          border: 1px solid #ddd;
        }

        .back-btn:hover {
          background: #e9ecef;
        }

        .confirm-btn {
          background: #28a745;
          color: white;
          border: none;
        }

        .confirm-btn:hover {
          background: #218838;
        }

        .confirm-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
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

export default MakeTransaction;
