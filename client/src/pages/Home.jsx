import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1B5E20, #43A047, #A5D6A7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "white",
          padding: "45px 35px",
          borderRadius: "25px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "70px" }}>🌾</div>

        <h1
          style={{
            color: "#2E7D32",
            marginBottom: "10px",
          }}
        >
          AI Farmer Assistant
        </h1>

        <p
          style={{
            color: "#555",
            fontSize: "18px",
            lineHeight: "1.6",
          }}
        >
          Smart farming assistance for every farmer 👨‍🌾
        </p>

        <p
          style={{
            color: "#777",
            marginBottom: "35px",
          }}
        >
          Get weather updates, soil information, crop suggestions,
          disease detection and AI farming assistance.
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "15px",
            background: "#2E7D32",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "17px",
            fontWeight: "bold",
          }}
        >
          🔐 Farmer Login
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: "15px",
            background: "#1565C0",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "17px",
            fontWeight: "bold",
          }}
        >
          📝 New Farmer? Register
        </button>

        <p
          style={{
            marginTop: "30px",
            color: "#888",
            fontSize: "14px",
          }}
        >
          🌱 Grow smarter. Farm better. 🌱
        </p>
      </div>
    </div>
  );
}

export default Home;