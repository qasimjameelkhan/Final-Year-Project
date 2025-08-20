import AddFundsForm from "./AddFundsForm";
import React from "react";

const CheckOut = () => {
  return (
    <div className="checkout-container">
      <AddFundsForm />
      <style jsx>{`
        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
      `}</style>
    </div>
  );
};

export default CheckOut;
