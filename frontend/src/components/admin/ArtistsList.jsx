import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllArtists } from "../../actions/usersAction";
import axios from "axios";
import SideBar from "./SideBar";
import Loader from "../Loader";

const ArtistsList = () => {
  const dispatch = useDispatch();
  const { artists, loading, error } = useSelector((state) => state.allArtists);
  const [errorMessage, setErrorMessage] = useState("");
  const [changeStatus, setChangeStatus] = useState("");

  useEffect(() => {
    dispatch(getAllArtists());
  }, [dispatch, error]);

  const handleChangeStatus = async (id, newStatus) => {
    const confirmChange = window.confirm(
      `Are you sure you want to change the status to ${
        newStatus === "true" ? "Approve" : "Block"
      }?`
    );

    if (confirmChange) {
      try {
        const formData = {
          id: id,
          status: newStatus === "true" ? true : false,
        };
        const res = await axios.post(
          `http://192.168.18.8:4000/api/v1/update-artists`,
          formData
        );
        console.log("res", res);
        if (res.status === 200) {
          alert("Status updated successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to update the status. Please try again.");
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <SideBar />
      <div className="main-content">
        <div className="artists-list-container">
          <h1>Artists List</h1>
          {loading ? (
            <Loader />
          ) : (
            <>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {artists && artists.length > 0 ? (
                <div className="table-container">
                  <table className="artists-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Type</th>
                        <th>Is Verified Artist</th>
                        <th>Attachment</th>
                        <th>Action</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artists.map((artist) => (
                        <tr key={artist.userid}>
                          <td>{artist.userid}</td>
                          <td>{artist.email}</td>
                          <td>{artist.username}</td>
                          <td>{artist.type}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                artist.isVerifiedArtist
                                  ? "verified"
                                  : "unverified"
                              }`}
                            >
                              {artist.isVerifiedArtist ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="pdf-button"
                              onClick={() =>
                                window.open(artist.fileUrl, "_blank")
                              }
                            >
                              View PDF
                            </button>
                          </td>
                          <td>
                            <select
                              className="status-select"
                              defaultValue={
                                artist.isVerifiedArtist === true
                                  ? "true"
                                  : "false"
                              }
                              onChange={(e) =>
                                handleChangeStatus(
                                  artist.userid,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select</option>
                              <option value="true">Approve</option>
                              <option value="false">Block</option>
                            </select>
                          </td>
                          <td>{new Date(artist.updatedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !loading && <p className="no-data">No artists found.</p>
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

            .artists-list-container {
              padding: 2rem;
            }

            h1 {
              color: #333;
              margin-bottom: 1.5rem;
              font-size: 1.5rem;
            }

            .error-message {
              color: #dc3545;
              margin-bottom: 1rem;
              padding: 0.5rem;
              background: #f8d7da;
              border-radius: 4px;
            }

            .table-container {
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow-x: auto;
            }

            .artists-table {
              width: 100%;
              border-collapse: collapse;
            }

            .artists-table th,
            .artists-table td {
              padding: 1rem;
              text-align: left;
              border-bottom: 1px solid #eee;
            }

            .artists-table th {
              background-color: #f8f9fa;
              font-weight: 600;
              color: #495057;
            }

            .artists-table tr:hover {
              background-color: #f8f9fa;
            }

            .status-badge {
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.875rem;
              font-weight: 500;
            }

            .status-badge.verified {
              background-color: #d4edda;
              color: #155724;
            }

            .status-badge.unverified {
              background-color: #f8d7da;
              color: #721c24;
            }

            .pdf-button {
              padding: 0.5rem 1rem;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .pdf-button:hover {
              background-color: #0056b3;
            }

            .status-select {
              padding: 0.5rem;
              border: 1px solid #ddd;
              border-radius: 4px;
              background-color: white;
              cursor: pointer;
            }

            .no-data {
              text-align: center;
              color: #6c757d;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            @media (max-width: 768px) {
              .main-content {
                margin-left: 60px;
              }

              .artists-list-container {
                padding: 1rem;
              }

              .artists-table th,
              .artists-table td {
                padding: 0.75rem;
                font-size: 0.875rem;
              }

              .pdf-button {
                padding: 0.25rem 0.5rem;
                font-size: 0.875rem;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default ArtistsList;
