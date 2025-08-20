import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const alert = useAlert();

  const { error, isAuthenticated, user } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    const formData = {
      email: email,
      password: password,
    };

    console.log("form", formData);

    dispatch(login(formData));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      naviagte("/");
    }
  }, [alert, dispatch, error, isAuthenticated, naviagte, user]);

  return (
    <div className="auth-container-master">
      <div className="auth-container">
        <div className="auth-wrapper">
          <p>Login</p>

          <div className="auth-input">
            <input
              placeholder="Your Email"
              type="email"
              onChange={handleEmailChange}
              value={email}
              required
            />
          </div>

          <div className="auth-password">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {showPassword ? (
              <VscEyeClosed size={20} onClick={togglePasswordVisibility} />
            ) : (
              <VscEye size={20} onClick={togglePasswordVisibility} />
            )}
          </div>
          <div className="auth-links">
            <Link to="/forget-path">Forget Password</Link>
            <Link to="/register">Register</Link>
          </div>

          <button onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
