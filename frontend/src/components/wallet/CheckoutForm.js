import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { createPaymentIntent, addFunds } from "../../actions/walletActions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "../Loader";

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

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Amount, 2: Card Details

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
        setStep(1);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setProcessing(false);
    }
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Add Funds to Wallet
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Securely add funds to your wallet using your credit card
            </p>
          </div>

          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center ${
                  step === 1 ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step === 1
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300"
                  }`}
                >
                  1
                </span>
                <span className="ml-2 text-sm font-medium">Amount</span>
              </div>
              <div
                className={`w-16 h-0.5 mx-2 ${
                  step === 2 ? "bg-indigo-600" : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center ${
                  step === 2 ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step === 2
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300"
                  }`}
                >
                  2
                </span>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>

          {/* Forms */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="p-8">
              {step === 1 ? (
                <form onSubmit={handleAmountSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount to Add
                    </label>
                    <div className="mt-2 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-lg">$</span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block w-full pl-8 pr-12 py-3 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-lg">USD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      to="/wallet"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back to Wallet
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Card Information
                      </label>
                      <span className="text-sm text-gray-500">
                        Amount: ${amount}
                      </span>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!stripe || processing}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        processing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      }`}
                    >
                      {processing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Add Funds"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm text-gray-600">Secured by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
