import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogOut } from "../actions/userAction";
import {
  FaShoppingCart,
  FaWallet,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { IoChatbox } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(userLogOut());
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const logoStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#4f46e5",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    transition: "color 0.3s ease",
  };

  const linkContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#4b5563",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
  };

  const iconButtonStyle = {
    background: "none",
    border: "none",
    color: "#4b5563",
    fontSize: "1.25rem",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const profileButtonStyle = {
    ...iconButtonStyle,
    position: "relative",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "0.5rem",
    minWidth: "200px",
    display: isDropdownOpen ? "block" : "none",
    marginTop: "0.5rem",
  };

  const dropdownItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#4b5563",
    textDecoration: "none",
    borderRadius: "0.375rem",
    transition: "all 0.2s ease",
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>
        ArtistryHub
      </Link>
      <div style={linkContainerStyle}>
        <Link to="/whatsnew" style={linkStyle}>
          What's New
        </Link>
        <Link to="/artists" style={linkStyle}>
          Artists
        </Link>
        <Link to="/artworks" style={linkStyle}>
          Artworks
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/chat" style={iconButtonStyle} className="cart-icon">
              <IoChatbox />
            </Link>

            {user?.type === "BUYER" && (
              <>
                <Link to="/cart" style={iconButtonStyle} className="cart-icon">
                  <FaShoppingCart />
                  {cartQuantity > 0 && (
                    <span className="cart-quantity">{cartQuantity}</span>
                  )}
                </Link>
                <Link to="/wallet" style={iconButtonStyle}>
                  <FaWallet />
                </Link>
              </>
            )}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                style={profileButtonStyle}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaUserCircle />
                <span>{user?.username || "Profile"}</span>
                <FaChevronDown style={{ fontSize: "0.75rem" }} />
              </button>
              <div style={dropdownStyle}>
                <Link
                  to={
                    user?.type === "ARTIST"
                      ? "/artist-dashboard"
                      : user?.type === "BUYER"
                      ? "/buyer-dashboard"
                      : "/admin-dashboard"
                  }
                  style={dropdownItemStyle}
                >
                  <MdDashboard size={23} />
                  Dashboard
                </Link>
                {user?.type === "BUYER" && (
                  <>
                    <Link to="/cart" style={dropdownItemStyle}>
                      <FaShoppingCart />
                      Cart
                    </Link>
                    <Link to="/wallet" style={dropdownItemStyle}>
                      <FaWallet />
                      Wallet
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    ...dropdownItemStyle,
                    width: "100%",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <IoLogOut size={28} />
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link
            to="/auth"
            style={{
              ...linkStyle,
              backgroundColor: "#4f46e5",
              color: "#ffffff",
            }}
          >
            Login/Sign Up
          </Link>
        )}
      </div>

      <style jsx>{`
        .cart-icon {
          position: relative;
        }
        .cart-quantity {
          position: absolute;
          top: -8px;
          right: -10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #dc3545;
          color: white;
          font-size: 0.75rem;
          border-radius: 50%;
          height: 15px;
          width: 15px;

          text-align: center;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
