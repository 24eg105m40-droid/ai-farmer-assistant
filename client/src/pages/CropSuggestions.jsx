import { useEffect, useState } from "react";
import api from "../api";

function CropSuggestions() {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("farmerMobile")));

  const cropData = {
    "Black Soil": [
      {
        name: "Cotton",
        emoji: "🌱",
        reason: "Black soil has excellent moisture-retaining capacity and is well suited for cotton.",
      },
      {
        name: "Paddy",
        emoji: "🌾",
        reason: "Paddy can perform well when sufficient water is available.",
      },
      {
        name: "Soybean",
        emoji: "🫘",
        reason: "Soybean is suitable for well-drained black soil.",
      },
      {
        name: "Sugarcane",
        emoji: "🎋",
        reason: "Black soil can support sugarcane when irrigation is available.",
      },
      {
        name: "Wheat",
        emoji: "🌾",
        reason: "Wheat can grow well in fertile black soil during suitable seasons.",
      },
    ],

    "Red Soil": [
      {
        name: "Groundnut",
        emoji: "🥜",
        reason: "Red soil is generally suitable for groundnut with proper moisture management.",
      },
      {
        name: "Millets",
        emoji: "🌾",
        reason: "Millets can perform well in relatively dry conditions.",
      },
      {
        name: "Cotton",
        emoji: "🌱",
        reason: "Cotton can be grown in suitable red soil with proper nutrient management.",
      },
      {
        name: "Pulses",
        emoji: "🫘",
        reason: "Several pulses can grow well in well-drained red soil.",
      },
      {
        name: "Maize",
        emoji: "🌽",
        reason: "Maize can perform well when soil moisture and nutrients are managed properly.",
      },
    ],

    "Alluvial Soil": [
      {
        name: "Rice",
        emoji: "🌾",
        reason: "Fertile alluvial soil is commonly used for rice cultivation.",
      },
      {
        name: "Wheat",
        emoji: "🌾",
        reason: "Alluvial soil provides favorable conditions for wheat.",
      },
      {
        name: "Sugarcane",
        emoji: "🎋",
        reason: "Fertile alluvial soil can support sugarcane production.",
      },
      {
        name: "Maize",
        emoji: "🌽",
        reason: "Maize can perform well in fertile alluvial soil.",
      },
      {
        name: "Vegetables",
        emoji: "🥬",
        reason: "Many vegetables benefit from fertile, well-managed alluvial soil.",
      },
    ],

    "Loamy Soil": [
      {
        name: "Vegetables",
        emoji: "🥬",
        reason: "Loamy soil has a balanced structure that is suitable for many vegetables.",
      },
      {
        name: "Paddy",
        emoji: "🌾",
        reason: "Paddy can grow in loamy soil when sufficient water is available.",
      },
      {
        name: "Wheat",
        emoji: "🌾",
        reason: "Loamy soil can provide favorable conditions for wheat.",
      },
      {
        name: "Maize",
        emoji: "🌽",
        reason: "Maize can perform well in fertile loamy soil.",
      },
      {
        name: "Pulses",
        emoji: "🫘",
        reason: "Loamy soil can support several pulse crops.",
      },
    ],
  };

  useEffect(() => {
    const mobile = localStorage.getItem("farmerMobile");

    if (!mobile) {
      return;
    }

    api
      .get(`/api/farmer/${mobile}`)
      .then((response) => {
        setFarmer(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Unable to get farmer information:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f8ee",
          color: "#2e7d32",
          fontSize: "22px",
        }}
      >
        🌾 Finding suitable crops...
      </div>
    );
  }

  const soilType = farmer?.soilType;
  const recommendations = cropData[soilType] || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f3f8ee",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "10px",
          }}
        >
          🌾 Crop Suggestions
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "35px",
          }}
        >
          Crop recommendations based on your registered soil type.
        </p>

        {farmer && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ color: "#1b5e20" }}>
              👨‍🌾 {farmer.name}
            </h2>

            <p style={{ color: "#666" }}>
              <strong>Location:</strong> {farmer.location}
            </p>

            <p style={{ color: "#666" }}>
              <strong>Soil Type:</strong> {farmer.soilType}
            </p>

            <p style={{ color: "#666" }}>
              <strong>Current Main Crop:</strong> {farmer.crops}
            </p>
          </div>
        )}

        {recommendations.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {recommendations.map((crop) => (
              <div
                key={crop.name}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "18px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.10)",
                  borderTop: "5px solid #66bb6a",
                }}
              >
                <div
                  style={{
                    fontSize: "45px",
                    textAlign: "center",
                  }}
                >
                  {crop.emoji}
                </div>

                <h2
                  style={{
                    textAlign: "center",
                    color: "#2e7d32",
                  }}
                >
                  {crop.name}
                </h2>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.6",
                    textAlign: "center",
                  }}
                >
                  {crop.reason}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <p>
              🌱 Crop recommendations are not available for this soil
              type yet.
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#fff8e1",
            borderRadius: "15px",
            color: "#795548",
            textAlign: "center",
          }}
        >
          ⚠️ These are general crop suggestions. Actual crop selection
          should also consider season, rainfall, irrigation, local
          conditions, and agricultural guidance.
        </div>
      </div>
    </div>
  );
}

export default CropSuggestions;
