import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { createPaymentIntent, addFunds } from "../../actions/walletActions";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#1F2937",
      "::placeholder": {
        color: "#6B7280",
      },
      ":-webkit-autofill": {
        color: "#1F2937",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

const AddFundsForm = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment system is not ready. Please try again.");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setProcessing(true);

    try {
      const clientSecret = await dispatch(createPaymentIntent(amount));

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        toast.error(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await dispatch(addFunds(paymentIntent.id));
        toast.success("Funds added successfully!");
        setAmount("");
        navigate("/wallet");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Funds to Your Wallet</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Amount Input */}
        <div className="form-group">
          <label htmlFor="amount" className="label">
            Amount to Add
          </label>
          <div className="input-container">
            <div className="currency-symbol">$</div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              placeholder="0.00"
              min="1"
              step="0.01"
              required
              disabled={processing}
            />
            <div className="currency-code">USD</div>
          </div>
        </div>

        {/* Card Element */}
        <div className="form-group">
          <label className="label">Card Information</label>
          <div className="card-element-container">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`submit-button ${processing ? "processing" : ""}`}
        >
          {processing ? (
            <div className="processing-content">
              <svg className="spinner" viewBox="0 0 24 24">
                <circle
                  className="spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="spinner-path"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </div>
          ) : (
            "Add Funds"
          )}
        </button>
      </form>

      <style jsx>{`
        .form-container {
          padding: 2rem;
          background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-symbol,
        .currency-code {
          position: absolute;
          color: #6b7280;
          font-size: 1.125rem;
          pointer-events: none;
        }

        .currency-symbol {
          left: 1rem;
        }

        .currency-code {
          right: 1rem;
        }

        .amount-input {
          width: 100%;
          padding: 0.75rem 3rem;
          font-size: 1.125rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: all 0.2s;
          background: white;
        }

        .amount-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }

        .amount-input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .card-element-container {
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .card-element-container:focus-within {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }

        .submit-button {
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          background-color: #4f46e5;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #4338ca;
        }

        .submit-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .processing-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
          width: 1rem;
          height: 1rem;
        }

        .spinner-circle {
          opacity: 0.25;
        }

        .spinner-path {
          opacity: 0.75;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .form-container {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.25rem;
          }

          .amount-input {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AddFundsForm;
