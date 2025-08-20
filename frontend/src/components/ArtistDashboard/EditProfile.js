import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../actions/userAction";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        file: null,
      });
      // Check for profileImage first, then fall back to images
      if (user.profileImage) {
        setPreview(user.profileImage);
      } else if (user.images) {
        // Parse the images string if it's stored as JSON
        const images =
          typeof user.images === "string"
            ? JSON.parse(user.images)
            : user.images;
        if (images) {
          setPreview(`${process.env.REACT_APP_API_URL}/Images/${images}`);
        }
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    dispatch(updateUserProfile(formData));
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <div className="profile-preview">
        {preview ? (
          <img src={preview} alt="Profile Preview" className="profile-image" />
        ) : (
          <div className="profile-placeholder">
            <span>No Profile Picture</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
      <style jsx>{`
        .edit-profile {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .profile-preview {
          text-align: center;
          margin-bottom: 20px;
        }
        .profile-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ddd;
        }
        .profile-placeholder {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 3px solid #ddd;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .form-group label {
          font-weight: bold;
        }
        .form-group input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .save-button {
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }
        .save-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
