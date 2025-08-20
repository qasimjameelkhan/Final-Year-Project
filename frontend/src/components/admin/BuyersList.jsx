import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBuyers } from "../../actions/usersAction";
import { toast } from "react-toastify";
import Loader from "../Loader";
import SideBar from "./SideBar";

const BuyersList = () => {
  const dispatch = useDispatch();
  const { buyers, loading, error } = useSelector((state) => state.buyers);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "CLEAR_ERRORS" });
    }
    dispatch(getAllBuyers());
  }, [dispatch, error]);

  return (
    <div className="admin-dashboard">
      <SideBar />
      <div className="main-content">
        <div className="buyers-list-container">
          <h1>Buyers List</h1>
          {loading ? (
            <Loader />
          ) : (
            <>
              {error && <p className="error-message">{error}</p>}
              {buyers && buyers.length > 0 ? (
                <div className="table-container">
                  <table className="buyers-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyers.map((buyer) => (
                        <tr key={buyer.id}>
                          <td>{buyer.username}</td>
                          <td>{buyer.email}</td>
                          <td>{buyer.phone || "N/A"}</td>
                          <td>
                            {buyer.address
                              ? `${buyer.address.street}, ${buyer.address.city}, ${buyer.address.country}`
                              : "N/A"}
                          </td>
                          <td>
                            {new Date(buyer.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !loading && <p className="no-data">No buyers found.</p>
              )}
            </>
          )}

          <style jsx>{`
            .admin-dashboard {
              display: flex;
              min-height: 100vh;
            }

            .main-content {
              flex: 1;
              margin-left: 250px;
              background: #f8f9fa;
              min-height: 100vh;
            }

            .buyers-list-container {
              padding: 2rem;
            }

            h1 {
              color: #333;
              margin-bottom: 1.5rem;
              font-size: 1.5rem;
            }

            .table-container {
              overflow-x: auto;
            }

            .buyers-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1rem;
            }

            .buyers-table th,
            .buyers-table td {
              padding: 1rem;
              text-align: left;
              border-bottom: 1px solid #eee;
            }

            .buyers-table th {
              background-color: #f8f9fa;
              font-weight: 600;
              color: #495057;
            }

            .buyers-table tr:hover {
              background-color: #f8f9fa;
            }

            .status-badge {
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              font-size: 0.875rem;
              font-weight: 500;
            }

            .status-badge.active {
              background-color: #d4edda;
              color: #155724;
            }

            .status-badge.inactive {
              background-color: #f8d7da;
              color: #721c24;
            }

            .error-message {
              color: #721c24;
              margin-bottom: 1rem;
            }

            .no-data {
              text-align: center;
              color: #6c757d;
              padding: 2rem;
            }

            @media (max-width: 768px) {
              .main-content {
                margin-left: 60px;
              }

              .buyers-list-container {
                padding: 1rem;
              }

              .buyers-table th,
              .buyers-table td {
                padding: 0.75rem;
                font-size: 0.875rem;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default BuyersList;
