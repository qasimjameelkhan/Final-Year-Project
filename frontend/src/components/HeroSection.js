import React, { useState } from "react";

const HeroSection = () => {
  // Array of events with images, titles, descriptions, and captions
  const events = [
    {
      image:
        "eddd.png", // Replace with your first image path
      title: "Curators’ Picks: Miami Art Week",
      description:
        "As the city's major fairs return, browse highlights from our favorite booths.",
      caption: "Seth Armstrong, Neutra, 2024.",
    },
    {
      image:
        "b2b.jpg", // Replace with your second image path
      title: "Global Highlights",
      description:
        "Discover the world's finest art exhibitions and collections.",
      caption: "Art Exhibit, 2024.",
    },
    {
      image:
        "https://i1.wp.com/artmeetsjewellery.com/wp-content/uploads/2019/11/75412339_2460198860934982_5406621195753750528_n-1.jpg?w=1920&ssl=1", // Replace with your third image path
      title: "Local Gems",
      description:
        "Find unique art pieces from emerging artists around the globe.",
      caption: "Local Art Showcase, 2024.",
    },
  ];

  const [currentEvent, setCurrentEvent] = useState(0); // Track the current event

  // Handle navigation to the next or previous event
  const handleNext = () => {
    setCurrentEvent((prev) => (prev + 1) % events.length);
  };

  const handlePrevious = () => {
    setCurrentEvent((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <div style={styles.container}>
      {/* Image Section */}
      <div style={styles.imageContainer}>
        <img
          src={events[currentEvent].image} // Display current event's image
          alt={events[currentEvent].title}
          style={styles.image}
        />
        <p style={styles.imageCaption}>{events[currentEvent].caption}</p>
      </div>

      {/* Content Section */}
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>{events[currentEvent].title}</h1>
        <p style={styles.description}>{events[currentEvent].description}</p>
        <button style={styles.button}>Browse Works</button>

        {/* Navigation Buttons */}
        <div style={styles.navigation}>
          <button onClick={handlePrevious} style={styles.navButton}>
            &lt;
          </button>
          <button onClick={handleNext} style={styles.navButton}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

// Styling
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f7f3e9",
    marginTop: "30px",
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  imageCaption: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
  },
  contentContainer: {
    flex: 1,
    textAlign: "left",
    padding: "20px",
  },
  title: {
    fontSize: "36px",
    color: "#333333",
    margin: "0 0 10px",
  },
  description: {
    fontSize: "18px",
    color: "#555555",
    margin: "0 0 20px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#6a9438",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
  },
  navigation: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  navButton: {
    padding: "10px",
    fontSize: "18px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "50%",
    cursor: "pointer",
  },
};

export default HeroSection;
