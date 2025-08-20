import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction";

import { toast } from "react-toastify";
const Auth = () => {
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const { error, isAuthenticated, user } = useSelector((state) => state.user);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      dispatch(clearErrors());
      toast.error(error);
    }
    // BUYER
    // ARTIST
    // ADMIN
    if (isAuthenticated && user.type === "ADMIN") {
      naviagte("/admin-dashboard");
    } else if (isAuthenticated && user.type === "ARTIST") {
      naviagte("/artist-dashboard");
    } else if (isAuthenticated && user.type === "BUYER") {
      naviagte("/artworks");
    }
  }, [dispatch, error, isAuthenticated, naviagte, user]);

  const handleFileChange = (e) => {
    setErrorMessage(null);
    setFile(e.target.files[0]);
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages

    // Validation for username
    if (isSignUp === true) {
      const usernameRegex = /^.{6,20}$/;
      if (!usernameRegex.test(fullName)) {
        setErrorMessage("Username must be between 8 and 20 characters long.");
        return;
      }

      // Validation for password
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        setErrorMessage(
          "Password must be at least 8 characters long, contain one uppercase letter, and include letters and numbers."
        );
        return;
      }
    }

    const RegisterformData = new FormData();
    RegisterformData.append("username", fullName);
    RegisterformData.append("email", email);
    RegisterformData.append("password", password);
    RegisterformData.append("type", role);
    if (file) {
      RegisterformData.append("files", file); // Attach the file
    }

    const formData = {
      email: email,
      password: password,
    };

    const clearFields = () => {
      setEmail("");
      setPassword("");
      setFullName("");
      setAddress("");
      setRole("");
      setFile(null);
    };

    try {
      if (isSignUp === true) {
        if (role === "ARTIST" && file === null) {
          setErrorMessage("Please upload a file");
          return null;
        }
        dispatch(register(RegisterformData));
        if (error === null) {
          toast.success("Registraction Success");
          clearFields();
        }
      } else {
        dispatch(login(formData));
        if (error === null) {
          toast.success("Login Success");
          clearFields();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    alert("Logged out successfully!");
  };

  return (
    <div>
      <style>
        {`
          .auth-page {
            max-width: 450px;
            margin: 5rem auto;
            padding: 2.5rem;
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            border-radius: 12px;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            font-family: 'Arial', sans-serif;
          }

          .auth-page h1 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: #333;
          }

          .auth-page form {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;
          }

          .auth-page input, .auth-page select {
            margin-bottom: 1rem;
            padding: 0.9rem;
            font-size: 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
          }

          .auth-page button {
            padding: 0.9rem;
            font-size: 1rem;
            border: none;
            border-radius: 6px;
            background-color:rgb(85, 145, 67);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .auth-page button:hover {
            background-color:rgb(85, 151, 75);
          }

          .auth-page .google-login {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 1rem;
            padding: 1rem;
            font-size: 1.1rem;
            font-weight: bold;
            border: 2px solid #db4437;
            border-radius: 6px;
            color: #db4437;
            background-color: white;
            cursor: pointer;
            transition: all 0.3s;
          }

          .auth-page .google-login img {
            margin-right: 0.8rem;
            height: 20px;
          }

          .auth-page .google-login:hover {
            background-color: #db4437;
            color: white;
          }

          .auth-page p {
            text-align: center;
            margin-top: 1rem;
          }

          .auth-page p button {
            background: none;
            border: none;
            color: #007bff;
            text-decoration: underline;
            cursor: pointer;
            font-size: 1rem;
            transition: color 0.3s;
          }

          .auth-page p button:hover {
            color: #0056b3;
          }

          .auth-page .error-message {
            color: red;
            font-size: 0.9rem;
            text-align: center;
            margin-top: 1rem;
          }
        `}
      </style>
      <div className="auth-page">
        <>
          <h1>{isSignUp ? "Sign Up" : "Login"}</h1>

          <p>or</p>

          <form onSubmit={handleAuthAction}>
            {isSignUp === true ? (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="ARTIST">Artist</option>
                  <option value="BUYER">Buyer</option>
                </select>

                {role.length > 0 && role === "ARTIST" && (
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    placeholder="Select a file"
                  />
                )}
              </>
            ) : (
              <div className="login-container">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
          </form>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </>
        {/* )} */}
      </div>
    </div>
  );
};

export default Auth;
