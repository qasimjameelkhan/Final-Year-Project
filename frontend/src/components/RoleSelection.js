import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { uid, email } = location.state || {};

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      setErrorMessage("Please select a role.");
      return;
    }

    try {
    //  apply logi here

      // Redirect to the appropriate dashboard
      if (role === "artist") {
        navigate("/artist-dashboard");
      } else if (role === "buyer") {
        navigate("/buyer-dashboard");
      }
    } catch (error) {
      setErrorMessage("Error saving role. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <h1>Select Your Role</h1>
      <form onSubmit={handleRoleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="artist">Artist</option>
          <option value="buyer">Buyer</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default RoleSelection;
