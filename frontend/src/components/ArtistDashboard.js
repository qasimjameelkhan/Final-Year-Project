import React, { useState } from "react";
import { useSelector } from "react-redux";
import PortfolioList from "./ArtistDashboard/PortfolioList";
import UploadArtworks from "./ArtistDashboard/UploadArtworks";
import ArtList from "./ArtistDashboard/ArtList";
import EditProfile from "./ArtistDashboard/EditProfile";

const ArtistDashboard = () => {
  const [activeSection, setActiveSection] = useState("portfolio");
  const { error, user } = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePic: null,
  });

  const renderSection = () => {
    switch (activeSection) {
      case "portfolio":
        return <PortfolioList />;
      case "upload":
        return <UploadArtworks />;
      case "artworks":
        return <ArtList />;
      case "editProfile":
        return <EditProfile />;
      default:
        return <p>Select an option from the dashboard.</p>;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const file = e.target.file.files[0];

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // You can add file upload logic here, e.g., uploading to a server
    alert(`Uploaded artwork: ${title}`);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const profilePic = e.target.profilePic.files[0];

    // Update the profile state
    setProfile({
      name,
      email,
      profilePic,
    });

    alert(`Profile updated for: ${name}`);
  };

  return (
    <div className="dashboard">
      {user.isVerifiedArtist === true ? (
        <div>
          <header className="header">
            <h1>Welcome to the Artist Dashboard</h1>
            <p>Upload, manage, and showcase your art pieces professionally.</p>
          </header>

          <nav className="nav">
            <button
              className={`nav-btn ${
                activeSection === "portfolio" ? "active" : ""
              }`}
              onClick={() => setActiveSection("portfolio")}
            >
              My Portfolio
            </button>
            <button
              className={`nav-btn ${
                activeSection === "upload" ? "active" : ""
              }`}
              onClick={() => setActiveSection("upload")}
            >
              Upload Artworks
            </button>
            <button
              className={`nav-btn ${
                activeSection === "artworks" ? "active" : ""
              }`}
              onClick={() => setActiveSection("artworks")}
            >
              My Artworks
            </button>
            <button
              className={`nav-btn ${
                activeSection === "editProfile" ? "active" : ""
              }`}
              onClick={() => setActiveSection("editProfile")}
            >
              Edit Profile
            </button>
          </nav>

          <main className="content">{renderSection()}</main>
        </div>
      ) : (
        <div className="not-verified">
          <p>You are not approved by admin, Please wait few minutes</p>
        </div>
      )}
      <style jsx>{`
        .dashboard {
          font-family: Arial, sans-serif;
          background: linear-gradient(to right, #e6f7e6, #f9f9f9);
          color: #333;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          max-width: 1200px;
          margin: auto;
          border: 1px solid #d3e9d3;
          margin-top: 30px;
          margin-bottom: 30px;
          min-height: ${user.isVerifiedArtist === true ? "100vh" : "30vh"};
        }

        .header {
          text-align: center;
          background: #e6f7e6;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid #cce5cc;
        }

        .header h1 {
          color: #336633;
          font-size: 2rem;
        }

        .header p {
          color: #555;
        }

        .not-verified {
          font-size: 20px;
          text-align: center;
          padding: 20px;
        }

        .nav {
          display: flex;
          justify-content: space-around;
          background: #f1f1f1;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .nav-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 20px;
          background: #e6e6e6;
          cursor: pointer;
          transition: background 0.3s;
          color: #333;
        }

        .nav-btn:hover {
          background: #d6f5d6;
        }

        .nav-btn.active {
          background: #66cc66;
          color: white;
        }

        .content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          border: 1px solid #d9d9d9;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-label {
          display: flex;
          flex-direction: column;
        }

        .form-label span {
          margin-bottom: 5px;
          color: #666;
          font-weight: bold;
        }

        .input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .btn-submit {
          padding: 10px 15px;
          border: none;
          background: #66cc66;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
          font-weight: bold;
        }

        .btn-submit:hover {
          background: #55aa55;
        }

        .artwork-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .card {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .card img {
          width: 100%;
          height: auto;
        }

        .card h3 {
          margin: 10px;
          font-size: 1.2rem;
        }

        .card p {
          margin: 10px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ArtistDashboard;
