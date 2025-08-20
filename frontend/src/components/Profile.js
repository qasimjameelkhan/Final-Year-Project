import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleNavigateToHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileHeader}>
        <h1 style={styles.headerTitle}>User Profile</h1>
        <p style={styles.headerText}>Welcome to your profile page!</p>
      </div>

      <div style={styles.profileBody}>
        <button style={styles.editBtn} onClick={handleEditProfile}>
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>

        <button style={styles.purchaseBtn} onClick={handleNavigateToHome}>
          Go to Home
        </button>

        {isEditing && (
          <div style={styles.editForm}>
            <h2 style={styles.editFormTitle}>Edit your profile details:</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                style={styles.input}
              />
            </div>
            <button style={styles.saveBtn}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles for the Profile component
const styles = {
  profileContainer: {
    backgroundColor: "#f5f7fb",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "20px auto",
    fontFamily: "'Arial', sans-serif",
  },
  profileHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  headerTitle: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "10px",
  },
  headerText: {
    fontSize: "18px",
    color: "#666",
  },
  profileBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  editBtn: {
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s",
    margin: "10px 0",
    backgroundColor: "#4caf50",
    color: "white",
  },
  purchaseBtn: {
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    marginTop: "10px",
  },
  editForm: {
    marginTop: "20px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  editFormTitle: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "15px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "14px",
    color: "#666",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginTop: "5px",
  },
  saveBtn: {
    backgroundColor: "#ff9800",
    color: "white",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    marginTop: "20px",
  },
};

export default Profile;
