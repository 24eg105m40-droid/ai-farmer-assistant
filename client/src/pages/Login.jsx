import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===============================
  // SEND OTP
  // ===============================

  const sendOTP = async () => {
    if (!mobile || mobile.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/api/send-otp", {
        mobile,
      });

      // Development OTP
      setGeneratedOtp(response.data.otp);

      setOtpSent(true);

      setMessage(
        "OTP sent successfully. Check your server terminal."
      );
    } catch (error) {
      console.error("OTP error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // VERIFY OTP
  // ===============================

  const verifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/api/verify-otp",
        {
          mobile,
          otp,
        }
      );

      if (response.data.verified) {
        // Save mobile number
        localStorage.setItem(
          "farmerMobile",
          mobile
        );

        // Save JWT token
        localStorage.setItem(
          "token",
          response.data.token
        );

        console.log("✅ JWT token saved");

        setMessage(
          "Login successful! Redirecting..."
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI
  // ===============================

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        background:
          "linear-gradient(135deg, #e8f5e9, #f1f8e9)",

        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",

          background: "white",

          borderRadius: "20px",

          padding: "35px",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              fontSize: "55px",
            }}
          >
            🌾
          </div>

          <h1
            style={{
              color: "#1b5e20",
              marginBottom: "8px",
            }}
          >
            Farmer Login
          </h1>

          <p
            style={{
              color: "#777",
            }}
          >
            Login securely using your mobile number
          </p>
        </div>

        {/* MOBILE */}

        <label
          style={{
            display: "block",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#333",
          }}
        >
          Mobile Number
        </label>

        <input
          type="tel"
          value={mobile}
          onChange={(e) =>
            setMobile(
              e.target.value.replace(/\D/g, "")
            )
          }
          maxLength={10}
          placeholder="Enter 10-digit mobile number"
          disabled={otpSent}
          style={{
            width: "100%",
            boxSizing: "border-box",

            padding: "13px",

            border:
              "1px solid #cfd8cc",

            borderRadius: "9px",

            fontSize: "16px",

            marginBottom: "15px",
          }}
        />

        {/* SEND OTP */}

        {!otpSent && (
          <button
            onClick={sendOTP}
            disabled={loading}
            style={{
              width: "100%",

              padding: "13px",

              background: "#2e7d32",

              color: "white",

              border: "none",

              borderRadius: "9px",

              fontSize: "16px",

              fontWeight: "bold",

              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Sending..."
              : "📱 Send OTP"}
          </button>
        )}

        {/* OTP */}

        {otpSent && (
          <>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#333",
              }}
            >
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              style={{
                width: "100%",
                boxSizing: "border-box",

                padding: "13px",

                border:
                  "1px solid #cfd8cc",

                borderRadius: "9px",

                fontSize: "18px",

                letterSpacing: "4px",

                textAlign: "center",

                marginBottom: "15px",
              }}
            />

            <button
              onClick={verifyOTP}
              disabled={loading}
              style={{
                width: "100%",

                padding: "13px",

                background: "#1565c0",

                color: "white",

                border: "none",

                borderRadius: "9px",

                fontSize: "16px",

                fontWeight: "bold",

                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Verifying..."
                : "🔐 Verify & Login"}
            </button>
          </>
        )}

        {/* MESSAGE */}

        {message && (
          <p
            style={{
              marginTop: "18px",

              textAlign: "center",

              color: "#555",

              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}

        {/* DEVELOPMENT OTP */}

        {generatedOtp && (
          <p
            style={{
              marginTop: "12px",

              textAlign: "center",

              color: "#888",

              fontSize: "12px",
            }}
          >
            Development OTP:
            <strong> {generatedOtp}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;