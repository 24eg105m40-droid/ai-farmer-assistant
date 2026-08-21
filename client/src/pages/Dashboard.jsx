import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("farmerMobile")));

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
        console.error("Unable to get farmer details:", error);
        setLoading(false);
      });
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f1f8e9",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>🌾 Loading Farmer Dashboard...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f8e9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}

      <header
        style={{
          background: "#2e7d32",
          color: "white",
          padding: "18px 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>
          🌾 AI Farmer Assistant
        </h2>

        <div
          style={{
            fontSize: "18px",
          }}
        >
          👨‍🌾 Farmer
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "45px 25px",
        }}
      >

        {/* Welcome */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              color: "#1b5e20",
              marginBottom: "10px",
            }}
          >
            Welcome, Farmer! 👋
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#9aa3b2",
            }}
          >
            Your farming information and assistance in one place.
          </p>
        </div>


        {/* ================= FARMER INFORMATION ================= */}

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.10)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#1b5e20",
              marginBottom: "15px",
            }}
          >
            👨‍🌾 Farmer Information
          </h2>

          {farmer ? (
            <>
              <p
                style={{
                  fontSize: "20px",
                  color: "#8c96a6",
                  margin: "8px",
                }}
              >
                <strong>Farmer ID:</strong>{" "}
                {farmer.farmerId}
              </p>

              <p
                style={{
                  fontSize: "20px",
                  color: "#8c96a6",
                  margin: "8px",
                }}
              >
                <strong>Location:</strong>{" "}
                {farmer.location}
              </p>

              <p
                style={{
                  fontSize: "20px",
                  color: "#8c96a6",
                  margin: "8px",
                }}
              >
                <strong>Soil Type:</strong>{" "}
                {farmer.soilType}
              </p>

              <p
                style={{
                  fontSize: "20px",
                  color: "#8c96a6",
                  margin: "8px",
                }}
              >
                <strong>Main Crop:</strong>{" "}
                {farmer.crops}
              </p>
            </>
          ) : (
            <p
              style={{
                color: "#999",
              }}
            >
              Farmer information not available.
            </p>
          )}
        </div>


        {/* ================= FEATURE CARDS ================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "22px",
          }}
        >

          {/* WEATHER */}

          <div
            onClick={() => navigate("/weather")}
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "30px 20px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.10)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            <div style={{ fontSize: "50px" }}>
              🌦️
            </div>

            <h2
              style={{
                color: "#2e7d32",
              }}
            >
              Weather
            </h2>

            <p
              style={{
                color: "#9aa3b2",
                fontSize: "18px",
              }}
            >
              Check today's weather
              <br />
              and rainfall.
            </p>
          </div>


          {/* SOIL INFORMATION */}

          {/* SOIL INFORMATION */}

<div
  onClick={() => navigate("/soil")}
  style={{
    background: "white",
    borderRadius: "18px",
    padding: "30px 20px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.10)",
    cursor: "pointer",
    transition: "transform 0.2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-5px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
            <div style={{ fontSize: "50px" }}>
              🌱
            </div>

            <h2
              style={{
                color: "#2e7d32",
              }}
            >
              Soil Information
            </h2>

            <p
              style={{
                color: "#9aa3b2",
                fontSize: "18px",
              }}
            >
              Learn about your soil
              <br />
              and its condition.
            </p>
          </div>


          {/* CROP SUGGESTIONS */}

          <div
          onClick={() => navigate("/crops")}
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "30px 20px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.10)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "50px" }}>
              🌾
            </div>

            <h2
              style={{
                color: "#2e7d32",
              }}
            >
              Crop Suggestions
            </h2>

            <p
              style={{
                color: "#9aa3b2",
                fontSize: "18px",
              }}
            >
              Get seasonal crop
              <br />
              recommendations.
            </p>
          </div>


          {/* AI CHATBOT */}

          <div
          onClick={() => navigate("/chatbot")}
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "30px 20px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.10)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "50px" }}>
              🤖
            </div>

            <h2
              style={{
                color: "#2e7d32",
              }}
            >
              AI Farmer Chatbot
            </h2>

            <p
              style={{
                color: "#9aa3b2",
                fontSize: "18px",
              }}
            >
              Ask farming questions in
              <br />
              Telugu.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;
