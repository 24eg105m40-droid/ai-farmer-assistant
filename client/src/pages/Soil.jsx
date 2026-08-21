import { useEffect, useState } from "react";
import api from "../api";

function Soil() {
  const [soilType, setSoilType] = useState("");
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("farmerMobile")));

  const soilData = {
    "Black Soil": {
      emoji: "🖤",
      description:
        "Black soil is rich in clay and has good moisture-retaining capacity.",
      crops: ["Cotton", "Paddy", "Soybean", "Sugarcane", "Wheat"],
      water: "Medium to high",
      fertilizer:
        "Nitrogen, phosphorus and potassium based fertilizers",
    },

    "Red Soil": {
      emoji: "🟥",
      description:
        "Red soil is generally well drained and is suitable for several dryland crops.",
      crops: ["Groundnut", "Millets", "Cotton", "Pulses", "Maize"],
      water: "Medium",
      fertilizer:
        "Organic manure with balanced NPK fertilizer",
    },

    "Alluvial Soil": {
      emoji: "🟨",
      description:
        "Alluvial soil is fertile and commonly found near river basins.",
      crops: ["Rice", "Wheat", "Sugarcane", "Maize", "Vegetables"],
      water: "Medium to high",
      fertilizer:
        "Balanced NPK and organic manure",
    },

    "Loamy Soil": {
      emoji: "🟫",
      description:
        "Loamy soil has a balanced mixture of sand, silt and clay and is suitable for many crops.",
      crops: ["Vegetables", "Paddy", "Wheat", "Maize", "Pulses"],
      water: "Medium",
      fertilizer:
        "Compost and balanced NPK fertilizer",
    },
  };

  // Get farmer soil type from MongoDB
  useEffect(() => {
    const mobile = localStorage.getItem("farmerMobile");

    if (!mobile) {
      return;
    }

    api
      .get(`/api/farmer/${mobile}`)
      .then((response) => {
        setSoilType(response.data.soilType);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Unable to get soil information:", error);
        setLoading(false);
      });
  }, []);

  const selectedSoil = soilData[soilType];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f8ee",
          fontSize: "22px",
          color: "#2e7d32",
        }}
      >
        🌱 Loading Soil Information...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f3f8ee",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          color: "#2e7d32",
          marginBottom: "10px",
        }}
      >
        🌱 Soil Information
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Information based on your registered soil type.
      </p>

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        {selectedSoil ? (
          <div
            style={{
              textAlign: "left",
              padding: "25px",
              background: "#f8fff5",
              borderRadius: "15px",
              border: "1px solid #d8ead2",
            }}
          >
            <h2
              style={{
                color: "#2e7d32",
                textAlign: "center",
              }}
            >
              {selectedSoil.emoji} {soilType}
            </h2>

            <p>
              <strong>Description:</strong>
              <br />
              {selectedSoil.description}
            </p>

            <h3>🌾 Suitable Crops</h3>

            <ul>
              {selectedSoil.crops.map((crop) => (
                <li key={crop}>{crop}</li>
              ))}
            </ul>

            <h3>💧 Water Requirement</h3>

            <p>{selectedSoil.water}</p>

            <h3>🌿 Fertilizer Guidance</h3>

            <p>{selectedSoil.fertilizer}</p>
          </div>
        ) : (
          <p style={{ color: "#777" }}>
            Soil information is not available for this farmer.
          </p>
        )}
      </div>
    </div>
  );
}

export default Soil;
