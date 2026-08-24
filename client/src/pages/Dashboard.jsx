import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);

  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("farmerMobile"))
  );

  // ===============================
  // APP INFO
  // ===============================

  const [showAppInfo, setShowAppInfo] = useState(false);

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("farmerMobile");
    navigate("/");
  };

  // ===============================
  // GET FARMER
  // ===============================

  useEffect(() => {
    const mobile = localStorage.getItem("farmerMobile");

    if (!mobile) {
      setLoading(false);
      return;
    }

    api
      .get(`/api/farmer/${mobile}`)
      .then((response) => {
        setFarmer(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Unable to get farmer details:",
          error
        );

        setLoading(false);
      });
  }, []);

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f8f1",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px" }}>🌾</div>

          <h2 style={{ color: "#1b5e20" }}>
            Loading Farmer Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  // ===============================
  // FEATURE CARD
  // ===============================

  const FeatureCard = ({
    icon,
    title,
    description,
    path,
    badge,
  }) => {
    return (
      <div
        onClick={() => navigate(path)}
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "28px 22px",
          minHeight: "180px",
          textAlign: "center",
          cursor: "pointer",

          border: "1px solid #e4eadf",

          boxShadow:
            "0 6px 18px rgba(31, 70, 35, 0.08)",

          transition:
            "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-7px)";

          e.currentTarget.style.boxShadow =
            "0 14px 30px rgba(31, 70, 35, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(0)";

          e.currentTarget.style.boxShadow =
            "0 6px 18px rgba(31, 70, 35, 0.08)";
        }}
      >
        {badge && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "5px 9px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {badge}
          </span>
        )}

        <div
          style={{
            fontSize: "48px",
            marginBottom: "8px",
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: "8px 0",
            color: "#1b5e20",
            fontSize: "21px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#718071",
            fontSize: "15px",
            lineHeight: "1.5",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    );
  };

  // ===============================
  // DASHBOARD
  // ===============================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f8f1 0%, #edf6e9 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          background:
            "linear-gradient(90deg, #14532d, #2e7d32)",
          color: "white",
          padding: "13px 35px",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          boxShadow:
            "0 3px 12px rgba(0,0,0,0.15)",

          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        {/* LEFT LOGO */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "13px",
          }}
        >
          {/* ============================================
              CLICKABLE INDIAN AGRICULTURE LOGO
          ============================================ */}

          <div
            onClick={() => setShowAppInfo(true)}
            title="About AI Farmer Assistant"
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background: "white",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              position: "relative",

              boxShadow:
                "0 3px 10px rgba(0,0,0,0.2)",

              cursor: "pointer",

              transition:
                "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "scale(1.08)";

              e.currentTarget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "scale(1)";

              e.currentTarget.style.boxShadow =
                "0 3px 10px rgba(0,0,0,0.2)";
            }}
          >
            <div
              style={{
                fontSize: "27px",
              }}
            >
              🌾
            </div>

            {/* Chakra-style circle */}

            <div
              style={{
                position: "absolute",
                width: "15px",
                height: "15px",
                border:
                  "2px solid #1a237e",
                borderRadius: "50%",
                top: "7px",
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: "21px",
                fontWeight: "bold",
                letterSpacing: "0.3px",
              }}
            >
              AI Farmer Assistant
            </div>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.9,
              }}
            >
              🇮🇳 भारत • INDIA
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            👨‍🌾 {farmer?.name || "Farmer"}
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "9px 16px",
              background: "#b71c1c",
              color: "white",

              border: "none",
              borderRadius: "8px",

              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "45px 25px",
        }}
      >
        {/* =================================================
            WELCOME HERO
        ================================================= */}

        <section
          style={{
            position: "relative",

            background:
              "linear-gradient(120deg, #1b5e20, #388e3c)",

            borderRadius: "25px",

            padding: "45px 40px",

            color: "white",

            marginBottom: "28px",

            overflow: "hidden",

            boxShadow:
              "0 10px 25px rgba(27,94,32,0.18)",
          }}
        >
          {/* Decorative circles */}

          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.06)",
              right: "-40px",
              top: "-50px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.05)",
              right: "150px",
              bottom: "-50px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: "15px",
                opacity: 0.9,
                marginBottom: "8px",
              }}
            >
              🇮🇳 SMART AGRICULTURE PLATFORM
            </div>

            <h1
              style={{
                fontSize: "42px",
                margin: "0 0 12px",
              }}
            >
              Welcome,{" "}
              {farmer?.name || "Farmer"}! 👋
            </h1>

            <p
              style={{
                fontSize: "18px",
                margin: 0,
                opacity: 0.92,
                maxWidth: "650px",
                lineHeight: "1.6",
              }}
            >
              Your digital farming companion for
              better decisions, healthier crops and
              smarter farming.
            </p>
          </div>
        </section>

        {/* =================================================
            FARMER QUICK INFO
        ================================================= */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "38px",
          }}
        >
          {/* LOCATION */}

          <div
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "18px",

              borderLeft:
                "5px solid #ff9800",

              boxShadow:
                "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "25px" }}>
              📍
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#777",
                marginTop: "7px",
              }}
            >
              FARM LOCATION
            </div>

            <strong
              style={{
                display: "block",
                color: "#333",
                marginTop: "4px",
                fontSize: "17px",
              }}
            >
              {farmer?.location || "Not available"}
            </strong>
          </div>

          {/* SOIL */}

          <div
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "18px",

              borderLeft:
                "5px solid #795548",

              boxShadow:
                "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "25px" }}>
              🌱
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#777",
                marginTop: "7px",
              }}
            >
              SOIL TYPE
            </div>

            <strong
              style={{
                display: "block",
                color: "#333",
                marginTop: "4px",
                fontSize: "17px",
              }}
            >
              {farmer?.soilType || "Not available"}
            </strong>
          </div>

          {/* CROP */}

          <div
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "18px",

              borderLeft:
                "5px solid #2e7d32",

              boxShadow:
                "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "25px" }}>
              🌾
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#777",
                marginTop: "7px",
              }}
            >
              MAIN CROP
            </div>

            <strong
              style={{
                display: "block",
                color: "#333",
                marginTop: "4px",
                fontSize: "17px",
              }}
            >
              {farmer?.crops || "Not available"}
            </strong>
          </div>

          {/* FARMER ID */}

          <div
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "18px",

              borderLeft:
                "5px solid #1565c0",

              boxShadow:
                "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "25px" }}>
              🆔
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#777",
                marginTop: "7px",
              }}
            >
              FARMER ID
            </div>

            <strong
              style={{
                display: "block",
                color: "#333",
                marginTop: "4px",
                fontSize: "17px",
              }}
            >
              {farmer?.farmerId || "Not available"}
            </strong>
          </div>
        </section>

        {/* =================================================
            SERVICES TITLE
        ================================================= */}

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#1b5e20",
              margin: 0,
              fontSize: "28px",
            }}
          >
            🚜 Farmer Services
          </h2>

          <p
            style={{
              color: "#718071",
              marginTop: "7px",
            }}
          >
            Everything you need for smarter farming.
          </p>
        </div>

        {/* =================================================
            SERVICES
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <FeatureCard
            icon="🌦️"
            title="Weather"
            description={
              <>
                Check weather conditions
                <br />
                and rainfall information.
              </>
            }
            path="/weather"
            badge="LIVE"
          />

          <FeatureCard
            icon="🌱"
            title="Soil Information"
            description={
              <>
                Understand your soil
                <br />
                and its characteristics.
              </>
            }
            path="/soil"
          />

          <FeatureCard
            icon="🌾"
            title="Crop Suggestions"
            description={
              <>
                Discover suitable crops
                <br />
                for your soil.
              </>
            }
            path="/crops"
            badge="SMART"
          />

          <FeatureCard
            icon="🤖"
            title="AI Farmer Assistant"
            description={
              <>
                Ask farming questions
                <br />
                in English or Telugu.
              </>
            }
            path="/chatbot"
            badge="AI"
          />

          <FeatureCard
            icon="🔬"
            title="Crop Disease Detection"
            description={
              <>
                Upload a crop image
                <br />
                and check for diseases.
              </>
            }
            path="/crop-disease"
            badge="AI"
          />
        </div>

        {/* =================================================
            FARMER MESSAGE
        ================================================= */}

        <section
          style={{
            marginTop: "40px",

            background: "white",

            borderRadius: "18px",

            padding: "25px",

            textAlign: "center",

            border:
              "1px solid #e1e8dc",

            boxShadow:
              "0 5px 15px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "35px",
            }}
          >
            🇮🇳 🌾
          </div>

          <h3
            style={{
              color: "#1b5e20",
              marginBottom: "8px",
            }}
          >
            Smart Farming for India
          </h3>

          <p
            style={{
              color: "#718071",
              margin: 0,
            }}
          >
            Technology • Agriculture • Better Decisions
          </p>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          style={{
            textAlign: "center",
            marginTop: "30px",
            padding: "15px",
            color: "#7b857b",
            fontSize: "13px",
          }}
        >
          🇮🇳 AI Farmer Assistant
          <br />
          Built to support Indian farmers with
          technology and AI.
        </footer>
      </main>

      {/* =================================================
          APP INFO MODAL
      ================================================= */}

      {showAppInfo && (
        <div
          onClick={() => setShowAppInfo(false)}
          style={{
            position: "fixed",
            inset: 0,

            background:
              "rgba(0,0,0,0.6)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            zIndex: 9999,

            padding: "20px",
          }}
        >
          {/* MODAL */}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "440px",

              background: "white",

              borderRadius: "25px",

              padding: "35px",

              textAlign: "center",

              boxShadow:
                "0 20px 50px rgba(0,0,0,0.3)",

              position: "relative",

              animation:
                "fadeIn 0.2s ease",
            }}
          >
            {/* CLOSE BUTTON */}

            <button
              onClick={() => setShowAppInfo(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",

                width: "35px",
                height: "35px",

                borderRadius: "50%",

                border: "none",

                background: "#f1f1f1",

                fontSize: "17px",

                cursor: "pointer",

                color: "#555",
              }}
            >
              ✕
            </button>

            {/* LOGO */}

            <div
              style={{
                width: "85px",
                height: "85px",

                margin: "0 auto 15px",

                borderRadius: "50%",

                background:
                  "linear-gradient(135deg, #e8f5e9, #c8e6c9)",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                fontSize: "48px",

                boxShadow:
                  "0 5px 15px rgba(46,125,50,0.15)",
              }}
            >
              🌾
            </div>

            {/* APP NAME */}

            <h2
              style={{
                color: "#1b5e20",
                margin:
                  "5px 0 8px",
                fontSize: "26px",
              }}
            >
              AI Farmer Assistant
            </h2>

            <p
              style={{
                color: "#6b756b",
                lineHeight: "1.6",
                fontSize: "15px",
                margin:
                  "0 auto",
              }}
            >
              A smart agriculture platform
              designed to help farmers make
              better farming decisions using
              technology and AI.
            </p>

            {/* DIVIDER */}

            <div
              style={{
                height: "1px",
                background: "#e5e5e5",
                margin:
                  "25px 0",
              }}
            />

            {/* CREATOR */}

            <div
              style={{
                background: "#f1f8e9",
                borderRadius: "17px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#777",
                  letterSpacing:
                    "1.5px",
                  marginBottom: "7px",
                  fontWeight: "bold",
                }}
              >
                CREATED BY
              </div>

              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  color: "#2e7d32",
                }}
              >
                ManishRebel
              </div>
            </div>

            {/* TAGLINE */}

            <div
              style={{
                marginTop: "22px",
                color: "#777",
                fontSize: "14px",
              }}
            >
              🇮🇳 Smart Farming
              {" • "}
              🤖 Artificial Intelligence
              {" • "}
              🌱 Agriculture
            </div>

            {/* VERSION */}

            <div
              style={{
                marginTop: "15px",
                color: "#aaa",
                fontSize: "12px",
              }}
            >
              AI Farmer Assistant • v1.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;