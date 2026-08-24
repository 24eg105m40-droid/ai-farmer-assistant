import { useState } from "react";
import axios from "axios";

function CropDisease() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ===============================
  // IMAGE SELECT
  // ===============================

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (!selectedImage) {
      return;
    }

    // Check image type
    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Check file size - 5MB
    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setImage(selectedImage);

    const imageUrl = URL.createObjectURL(selectedImage);
    setPreview(imageUrl);

    // Clear previous result
    setResult(null);
    setError("");
  };

  // ===============================
  // DETECT DISEASE
  // ===============================

  const handleDetectDisease = async () => {
    if (!image) {
      setError("Please select a crop image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("cropImage", image);

      console.log("🌱 Sending crop image to server...");

      const token = localStorage.getItem("token");

const response = await axios.post(
  "http://localhost:3000/api/disease-detection",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);
      console.log("🤖 AI Result:", response.data);

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(
          response.data.message ||
            "Unable to analyze the image."
        );
      }
    } catch (err) {
      console.error(
        "❌ Disease detection error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to connect to the disease detection service."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RESET
  // ===============================

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  // ===============================
  // FORMAT DISEASE NAME
  // ===============================

  const formatDiseaseName = (name) => {
    if (!name) {
      return "Unknown";
    }

    return name
      .replace(/___/g, " - ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ===============================
  // CONFIDENCE
  // ===============================

  const confidence =
    result?.confidence
      ? Number(result.confidence)
      : 0;

  const isLowConfidence = confidence < 70;

  // ===============================
  // UI
  // ===============================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "22px",
          padding: "30px",
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.15)",
        }}
      >

        {/* ===============================
            TITLE
        =============================== */}

        <h1
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "10px",
          }}
        >
          🌱 Crop Disease Detection
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          Upload a clear photo of your crop leaf
          to check for possible diseases.
        </p>

        {/* ===============================
            UPLOAD BUTTON
        =============================== */}

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <label
            style={{
              display: "inline-block",
              padding: "15px 28px",
              background: "#2e7d32",
              color: "white",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            📷 Choose Crop Image

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                display: "none",
              }}
            />
          </label>
        </div>

        {/* ===============================
            IMAGE PREVIEW
        =============================== */}

        {preview && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#333",
              }}
            >
              Selected Image
            </h3>

            <img
              src={preview}
              alt="Selected crop"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "15px",
                objectFit: "contain",
                border: "2px solid #ddd",
              }}
            />

            {image && (
              <p
                style={{
                  color: "#777",
                  marginTop: "10px",
                }}
              >
                📄 {image.name}
              </p>
            )}
          </div>
        )}

        {/* ===============================
            ERROR
        =============================== */}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#ffebee",
              border: "1px solid #ef9a9a",
              borderRadius: "10px",
              color: "#c62828",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* ===============================
            DETECT BUTTON
        =============================== */}

        {image && !result && (
          <button
            onClick={handleDetectDisease}
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              marginTop: "25px",
              padding: "16px",
              background: loading
                ? "#9e9e9e"
                : "#66bb6a",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "🤖 Analyzing Image..."
              : "🤖 Detect Crop Disease"}
          </button>
        )}

        {/* ===============================
            LOADING
        =============================== */}

        {loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#2e7d32",
            }}
          >
            <p>
              🔍 AI is analyzing your crop image...
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "#777",
              }}
            >
              Please wait.
            </p>
          </div>
        )}

        {/* ===============================
            AI RESULT
        =============================== */}

        {result && (
          <div
            style={{
              marginTop: "30px",
              padding: "25px",
              borderRadius: "18px",
              background: isLowConfidence
                ? "#fff8e1"
                : "#e8f5e9",
              border: isLowConfidence
                ? "2px solid #ffcc80"
                : "2px solid #81c784",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#2e7d32",
                marginBottom: "25px",
              }}
            >
              🤖 AI Disease Analysis
            </h2>

            {/* Prediction */}

            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#555",
                }}
              >
                🌱 Prediction
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#2e7d32",
                }}
              >
                {formatDiseaseName(
                  result.disease
                )}
              </p>
            </div>

            {/* Confidence */}

            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#555",
                }}
              >
                📊 Confidence
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: isLowConfidence
                    ? "#ef6c00"
                    : "#2e7d32",
                }}
              >
                {confidence.toFixed(2)}%
              </p>

              {/* Confidence bar */}

              <div
                style={{
                  width: "100%",
                  height: "12px",
                  background: "#ddd",
                  borderRadius: "10px",
                  marginTop: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      confidence,
                      100
                    )}%`,
                    height: "100%",
                    background:
                      isLowConfidence
                        ? "#ff9800"
                        : "#4caf50",
                    borderRadius: "10px",
                    transition:
                      "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* Low confidence warning */}

            {isLowConfidence && (
              <div
                style={{
                  background: "#fff3cd",
                  border:
                    "1px solid #ffcc80",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "15px",
                  color: "#8d6e00",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                  }}
                >
                  ⚠️ Low Confidence
                </h3>

                <p
                  style={{
                    marginBottom: 0,
                    lineHeight: "1.6",
                  }}
                >
                  The AI is not confident about
                  this prediction. Please upload a
                  clear, close-up image of the
                  affected crop leaf in good
                  lighting.
                </p>
              </div>
            )}

            {/* General advice */}

            {!isLowConfidence && (
              <div
                style={{
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "15px",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    color: "#555",
                  }}
                >
                  🌿 Important
                </h3>

                <p
                  style={{
                    lineHeight: "1.6",
                    marginBottom: 0,
                    color: "#555",
                  }}
                >
                  This AI result is an initial
                  screening and should not be
                  treated as a guaranteed diagnosis.
                  For serious crop problems, consult
                  an agricultural expert.
                </p>
              </div>
            )}

            {/* Analyze another */}

            <button
              onClick={handleReset}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "5px",
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔄 Analyze Another Image
            </button>
          </div>
        )}

        {/* ===============================
            IMAGE TIPS
        =============================== */}

        {!result && (
          <div
            style={{
              marginTop: "30px",
              padding: "18px",
              background: "#f5f5f5",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                color: "#2e7d32",
                marginTop: 0,
              }}
            >
              📸 Tips for a Better Result
            </h3>

            <ul
              style={{
                color: "#555",
                lineHeight: "1.8",
                paddingLeft: "20px",
              }}
            >
              <li>
                Use a clear photo of the leaf.
              </li>

              <li>
                Make sure the leaf is visible
                clearly.
              </li>

              <li>
                Avoid very dark or blurry images.
              </li>

              <li>
                Capture the affected area closely.
              </li>

              <li>
                Use good natural lighting.
              </li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default CropDisease;