import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = async () => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const response = await api.post(
        "/api/send-otp",
        {
          mobile: mobile,
        }
      );

      console.log(response.data);

      setGeneratedOtp(response.data.otp);
      setOtpSent(true);

      alert("OTP generated! Check the backend terminal.");
    } catch (error) {
      console.error(error);
      alert("Unable to send OTP");
    }
  };

  const verifyOTP = () => {
    if (otp === generatedOtp.toString()) {
      // Save farmer mobile number
      localStorage.setItem("farmerMobile", mobile);

      console.log("Farmer mobile saved:", mobile);

      alert("OTP verified successfully! 🎉");

      // Go to Dashboard
      navigate("/");
    } else {
      alert("Incorrect OTP ❌");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #2E7D32, #81C784)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2E7D32",
          }}
        >
          🌾 AI Farmer Assistant
        </h2>

        <p style={{ textAlign: "center" }}>
          Farmer Login
        </p>

        <input
          type="tel"
          placeholder="Enter 10-digit mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          maxLength="10"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        {!otpSent && (
          <button
            onClick={sendOTP}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              background: "#2E7D32",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Send OTP
          </button>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={verifyOTP}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                background: "#1565C0",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
