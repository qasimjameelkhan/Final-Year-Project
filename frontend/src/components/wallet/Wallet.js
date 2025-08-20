import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWalletDetails,
  getTransactions,
  clearErrors,
} from "../../actions/walletActions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import MetaData from "../MetaData";

const Wallet = () => {
  const dispatch = useDispatch();
  const { wallet, loading, error, transactions } = useSelector(
    (state) => state.wallet
  );

  useEffect(() => {
    dispatch(getWalletDetails());
    dispatch(getTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <>
      <MetaData title="My Wallet" />
      <div className="wallet-container">
        <div className="wallet-content">
          {/* Header */}
          <div className="header">
            <h1>My Wallet</h1>
            <p>View your balance and transaction history</p>
          </div>

          <div className="wallet-sections">
            {/* Wallet Balance Card */}
            <div className="balance-card">
              <div className="balance-content">
                <div className="balance-info">
                  <div className="balance-header">
                    <h2>Available Balance</h2>
                    <p>Your current wallet balance</p>
                  </div>
                  <div className="balance-amount">
                    {loading ? (
                      <div className="loader-container">
                        <Loader />
                      </div>
                    ) : (
                      <>
                        <div className="amount">
                          ${wallet?.amount?.toFixed(2) || "0.00"}
                        </div>
                        <Link to="/checkOut" className="add-funds-button">
                          <svg
                            className="plus-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add Funds
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="transactions-card">
              <div className="transactions-content">
                <div className="transactions-header">
                  <h2>Transaction History</h2>
                  <p>Your recent transactions</p>
                </div>

                {loading ? (
                  <div className="loader-container">
                    <Loader />
                  </div>
                ) : transactions?.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td>
                              <span
                                className={
                                  transaction.from_account ===
                                  transaction.to_account
                                    ? "amount-positive"
                                    : "amount-negative"
                                }
                              >
                                ${transaction.amount.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              {transaction.from_account ===
                              transaction.to_account ? (
                                <span className="badge deposit">
                                  <svg
                                    className="badge-icon"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Deposit
                                </span>
                              ) : (
                                <span className="badge transfer">
                                  <svg
                                    className="badge-icon"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Transfer
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <svg
                      className="empty-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p>No transactions yet</p>
                    <Link to="/checkOut" className="add-first-funds">
                      Add your first funds
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wallet-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
        }

        .wallet-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 16px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          font-size: 36px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.025em;
        }

        .header p {
          margin-top: 16px;
          font-size: 16px;
          color: #6b7280;
        }

        .wallet-sections {
          max-width: 800px;
          margin: 40px auto;
        }

        .balance-card,
        .transactions-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
          overflow: hidden;
        }

        .balance-content,
        .transactions-content {
          padding: 32px;
        }

        .balance-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .balance-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .balance-header p {
          margin-top: 4px;
          font-size: 14px;
          color: #6b7280;
        }

        .amount {
          font-size: 36px;
          font-weight: 700;
          color: #4f46e5;
          margin-bottom: 16px;
        }

        .add-funds-button {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background-color: #4f46e5;
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .add-funds-button:hover {
          background-color: #4338ca;
        }

        .plus-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }

        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .transactions-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .transactions-header p {
          font-size: 14px;
          color: #6b7280;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          padding: 16px 24px;
          text-align: left;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          background-color: #f9fafb;
        }

        td {
          padding: 16px 24px;
          font-size: 14px;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
        }

        tr:hover {
          background-color: #f9fafb;
        }

        .amount-positive {
          color: #059669;
          font-weight: 500;
        }

        .amount-negative {
          color: #dc2626;
          font-weight: 500;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge-icon {
          width: 12px;
          height: 12px;
          margin-right: 6px;
        }

        .deposit {
          background-color: #d1fae5;
          color: #065f46;
        }

        .transfer {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .empty-state {
          text-align: center;
          padding: 48px 0;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto;
          color: #9ca3af;
        }

        .empty-state p {
          margin-top: 16px;
          color: #6b7280;
        }

        .add-first-funds {
          display: inline-block;
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #e0e7ff;
          color: #4f46e5;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .add-first-funds:hover {
          background-color: #c7d2fe;
        }

        .loader-container {
          display: flex;
          justify-content: center;
          padding: 32px;
        }

        @media (max-width: 768px) {
          .balance-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .balance-amount {
            margin-top: 24px;
          }

          .transactions-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .transactions-header p {
            margin-top: 4px;
          }
        }
      `}</style>
    </>
  );
};

export default Wallet;
