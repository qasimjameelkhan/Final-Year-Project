import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../actions/cartActions";
import { toast } from "react-toastify";
import { getWalletDetails, clearErrors } from "../actions/walletActions";
const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const { wallet } = useSelector((state) => state.wallet);

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(getWalletDetails());
    dispatch(getCart());
  }, [dispatch]);

  const handleRemoveFromCart = (cartId) => {
    dispatch(removeFromCart(cartId));
    toast.success("Item removed from cart");
  };

  const handleUpdateQuantity = (cartId, quantity) => {
    if (quantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    dispatch(updateCartItem(cartId, quantity));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

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

  useEffect(() => {
    const subtotal = calculateTotal();
    const commission = parseFloat(calculateCommission());
    setTotalAmount(subtotal + commission);
  }, [cartItems]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/artworks" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.art.image} alt={item.art.title} />
                </div>
                <div className="item-details">
                  <h3>{item.art.title}</h3>
                  <p className="artist">By {item?.art?.user?.username}</p>
                  <p className="price">${item.art.price}</p>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="summary-item">
              <span>Commission (5%)</span>
              <span>${calculateCommission()}</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-item total">
              <span>Total</span>
              <span>${calculateGrandTotal()}</span>
            </div>
            <div className="summary-item total">
              <span>Your Wallet</span>
              <span>${wallet?.amount || 0}</span>
            </div>
            <div className="cart-actions">
              <button className="clear-cart" onClick={handleClearCart}>
                Clear Cart
              </button>
              {wallet && wallet.amount >= totalAmount ? (
                <Link to="/make-transaction" className="checkout-btn">
                  Proceed to payment
                </Link>
              ) : (
                <Link to="/wallet" className="checkout-btn">
                  Add Funds
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        h2 {
          margin-bottom: 2rem;
          color: #333;
        }

        .empty-cart {
          text-align: center;
          padding: 2rem;
        }

        .empty-cart p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .continue-shopping {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .continue-shopping:hover {
          background-color: #0056b3;
        }

        .cart-items {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .item-image img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item-details h3 {
          margin: 0;
          color: #333;
        }

        .artist {
          color: #666;
          font-size: 0.9rem;
        }

        .price {
          font-weight: bold;
          color: #007bff;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-controls button {
          padding: 0.3rem 0.6rem;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }

        .quantity-controls button:hover {
          background: #f5f5f5;
        }

        .remove-btn {
          padding: 0.5rem 1rem;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: fit-content;
        }

        .remove-btn:hover {
          background-color: #c82333;
        }

        .cart-summary {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .cart-summary h3 {
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .summary-item.total {
          font-weight: bold;
          font-size: 1.2rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #ddd;
        }

        .cart-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .clear-cart {
          padding: 0.8rem 1.5rem;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .clear-cart:hover {
          background-color: #5a6268;
        }

        .checkout-btn {
          flex: 1;
          padding: 0.8rem 1.5rem;
          background-color: #28a745;
          color: white;
          text-decoration: none;
          text-align: center;
          border-radius: 4px;
        }

        .checkout-btn:hover {
          background-color: #218838;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
          color: #666;
        }

        .error {
          text-align: center;
          padding: 2rem;
          color: #dc3545;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default Cart;
