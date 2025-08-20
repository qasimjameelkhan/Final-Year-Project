import React, { useState } from "react";
import { Link } from "react-router-dom";
import { VscEyeClosed, VscEye } from "react-icons/vsc";

const Register = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container-master">
      <div className="auth-container">
        <div className="auth-wrapper">
          <p>Register</p>

          <div className="auth-input">
            <input type="text" placeholder="Custom web link" />
          </div>

          <div className="auth-input">
            <input type="email" placeholder="Your Email" />
          </div>

          <div className="auth-password">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {showPassword ? (
              <VscEyeClosed size={20} onClick={togglePasswordVisibility} />
            ) : (
              <VscEye size={20} onClick={togglePasswordVisibility} />
            )}
          </div>
          <div className="auth-links">
            <p>Have an account?</p>
            <Link to="/login">Login</Link>
          </div>

          <button>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
