import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <div className="sidebar-menu">
        <Link
          to="/admin-dashboard"
          className={`menu-item ${
            isActive("/admin-dashboard") ? "active" : ""
          }`}
        >
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
        <Link
          to="/artists-lists"
          className={`menu-item ${isActive("/artists-lists") ? "active" : ""}`}
        >
          <i className="fas fa-palette"></i>
          <span>Artists</span>
        </Link>
        <Link
          to="/buyer-lists"
          className={`menu-item ${isActive("/buyer-lists") ? "active" : ""}`}
        >
          <i className="fas fa-users"></i>
          <span>Buyers</span>
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          transition: all 0.3s ease;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: white;
        }

        .sidebar-menu {
          padding: 1rem 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: #ecf0f1;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .menu-item.active {
          background: #3498db;
        }

        .menu-item i {
          margin-right: 1rem;
          width: 20px;
          text-align: center;
        }

        .menu-item span {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 60px;
          }

          .sidebar-header h2,
          .menu-item span {
            display: none;
          }

          .menu-item {
            justify-content: center;
            padding: 1rem;
          }

          .menu-item i {
            margin-right: 0;
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SideBar;
