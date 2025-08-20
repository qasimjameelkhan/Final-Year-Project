import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Navbar from "./components/Navbar"; // Navbar component
import Artists from "./components/Artists";
import Artworks from "./components/Artworks";
import ArtistDashboard from "./components/ArtistDashboard";
import BuyerDashboard from "./components/BuyerDashboard";
import HeroSection from "./components/HeroSection"; // Moved inside Home
import RoleSelection from "./components/RoleSelection";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./components/admin/Dashboard";
import ArtistsList from "./components/admin/ArtistsList";
import { ToastContainer } from "react-toastify";
import LatestArts from "./components/LatestArts";
import ArtDetails from "./components/ArtDetails";
import Cart from "./components/Cart";
import Wallet from "./components/wallet/Wallet";
import WalletWrapper from "./components/wallet/WalletWrapper";
import MakeTransaction from "./components/MakeTransaction";
import BuyersList from "./components/admin/BuyersList";
import ChatView from "./components/chat/ChatView";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/auth" element={<Auth />} /> {/* Login/Sign Up route */}
        {/* Routes for other sections */}
        <Route path="/whatsnew" element={<LatestArts />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/art/:id" element={<ArtDetails />} />
        {/* protected routes */}
        <Route path="/" element={<ProtectedRoute />}>
          {/* admin panel */}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/artists-lists" element={<ArtistsList />} />
          <Route path="/buyer-lists" element={<BuyersList />} />

          {/* Dashboard routes */}
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          {/* Role selection route */}
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/profile" element={<Profile />} />
          {/* Chat route */}
          <Route path="/chat" element={<ChatView />} />
          {/* Latest Arts route */}
          {/* Wallet and Cart routes */}
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/checkOut" element={<WalletWrapper />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/make-transaction" element={<MakeTransaction />} />
        </Route>
      </Routes>

      <Footer />
      <ToastContainer />
    </BrowserRouter>
  );
};

// Redesigned Home Component
const Home = () => {
  const [hoveredCard, setHoveredCard] = React.useState(null);

  const homeStyle = {
    textAlign: "center",
    background: "#f7f3e9",
    color: "#333333",
    padding: "50px 20px",
    borderRadius: "8px",
    margin: "20px auto",
    maxWidth: "1200px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  };

  const titleStyle = {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#6a9438",
  };

  const subtitleStyle = {
    fontSize: "18px",
    marginBottom: "30px",
    color: "#555555",
  };

  const sectionStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "30px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    color: "#0d1117",
    borderRadius: "10px",
    padding: "20px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    margin: "10px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHoverStyle = {
    transform: "translateY(-10px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  };

  const handleMouseEnter = (cardIndex) => {
    setHoveredCard(cardIndex);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div>
      <HeroSection />
      <div style={homeStyle}>
        <h1 style={titleStyle}>Welcome to ArtistryHub</h1>
        <p style={subtitleStyle}>
          Discover, create, and showcase stunning art in one unified platform.
        </p>
        <div style={sectionStyle}>
          {[
            {
              title: "Explore Artists",
              description:
                "Find profiles of talented artists and their amazing works.",
            },
            {
              title: "What's New",
              description:
                "Stay updated with the latest events and exhibitions.",
            },
            {
              title: "Discover Artworks",
              description:
                "Browse through a curated collection of artworks and styles.",
            },
          ].map((card, index) => (
            <div
              key={index}
              style={{
                ...cardStyle,
                ...(hoveredCard === index ? cardHoverStyle : {}),
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
