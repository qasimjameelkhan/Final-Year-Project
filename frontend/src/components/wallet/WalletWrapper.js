import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "../Loader";
import CheckOut from "./CheckOut";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Stripe appearance configuration
const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#4F46E5",
    colorBackground: "#ffffff",
    colorText: "#1F2937",
    colorDanger: "#EF4444",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    spacingUnit: "4px",
    borderRadius: "8px",
    fontSizeBase: "16px",
  },
  rules: {
    ".Input": {
      border: "1px solid #E5E7EB",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      padding: "12px",
    },
    ".Input:focus": {
      border: "2px solid #4F46E5",
      boxShadow:
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
    ".Label": {
      fontWeight: "500",
    },
    ".Error": {
      color: "#EF4444",
      marginTop: "2px",
    },
  },
};

const WalletWrapper = () => {
  const [stripeReady, setStripeReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializeStripe = async () => {
      try {
        const stripe = await stripePromise;
        if (mounted && stripe) {
          setStripeReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to initialize payment system");
          console.error("Error loading Stripe:", err);
        }
      }
    };

    initializeStripe();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-title">Error</p>
          <p className="error-message">{error}</p>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .error-content {
            text-align: center;
            color: #ef4444;
          }
          .error-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .error-message {
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }

  if (!stripeReady) {
    return (
      <div className="loader-container">
        <Loader />
        <style jsx>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wallet-wrapper">
      <Elements stripe={stripePromise} options={{ appearance }}>
        <CheckOut />
      </Elements>
      <style jsx>{`
        .wallet-wrapper {
          min-height: 100vh;
          background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
        }
      `}</style>
    </div>
  );
};

export default WalletWrapper;
