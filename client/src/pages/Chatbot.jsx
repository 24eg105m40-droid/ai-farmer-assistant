import { useEffect, useState, useRef } from "react";
import api from "../api";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! 👨‍🌾🌾 I am your Farmer Assistant. Ask me about your crops, soil, weather, irrigation, or farming problems.",
    },
  ]);

  // ==========================================
  // GET FARMER INFORMATION
  // ==========================================

  useEffect(() => {
    const mobile = localStorage.getItem("farmerMobile");

    if (!mobile) {
      console.log("Farmer mobile not found");
      return;
    }

    api
      .get(`/api/farmer/${mobile}`)
      .then((response) => {
        setFarmer(response.data);

        console.log("👨‍🌾 Farmer information:", response.data);
      })
      .catch((error) => {
        console.error(
          "Unable to get farmer information:",
          error
        );
      });
  }, []);

  // ==========================================
  // DETECT TELUGU
  // ==========================================

  const isTeluguText = (text) => {
    return /[\u0C00-\u0C7F]/.test(text);
  };

  // ==========================================
  // VOICE INPUT
  // ==========================================

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (listening) {
      return;
    }

    const recognition = new SpeechRecognition();

    // Telugu speech recognition
    recognition.lang = "te-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("🎤 Listening for Telugu...");
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      console.log("🎤 Speech detected:", transcript);

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "🎤 Voice recognition error:",
        event.error
      );

      setListening(false);
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended");
      setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start voice recognition:",
        error
      );

      setListening(false);
    }
  };

  // ==========================================
  // SPEAK BOT RESPONSE
  // ==========================================

  const speakResponse = (reply) => {
    if (!reply || !window.speechSynthesis) {
      return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(reply);

    // Automatically detect response language
    const responseIsTelugu =
      isTeluguText(reply);

    if (responseIsTelugu) {
      speech.lang = "te-IN";

      console.log(
        "🔊 Speaking response in Telugu"
      );
    } else {
      speech.lang = "en-IN";

      console.log(
        "🔊 Speaking response in English"
      );
    }

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    // Detect question language
    const questionIsTelugu =
      isTeluguText(userMessage);

    console.log(
      "💬 User question:",
      userMessage
    );

    console.log(
      "🌐 Question language:",
      questionIsTelugu
        ? "Telugu"
        : "English"
    );

    // Display user message
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/chat",
        {
          message: userMessage,

          // Farmer information
          farmer: farmer,

          // Send detected language to backend
          language: questionIsTelugu
            ? "te"
            : "en",
        }
      );

      const botReply = response.data.reply;

      console.log(
        "🤖 Bot response:",
        botReply
      );

      // Display bot response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: botReply,
        },
      ]);

      // Speak response in correct language
      speakResponse(botReply);
    } catch (error) {
      console.error(
        "❌ Chatbot error:",
        error
      );

      const errorMessage =
        "Sorry, I couldn't connect to the farming assistant. Please try again.";

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: errorMessage,
        },
      ]);

      speakResponse(errorMessage);
    }

    setLoading(false);
  };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f8ee",
        fontFamily: "Arial, sans-serif",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          margin: "0 auto",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background:
              "linear-gradient(to right, #2e7d32, #66bb6a)",
            color: "white",
            padding: "22px",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>
            🤖 AI Farmer Chatbot
          </h1>

          {farmer ? (
            <p style={{ marginBottom: 0 }}>
              Welcome {farmer.name} 👨‍🌾
            </p>
          ) : (
            <p style={{ marginBottom: 0 }}>
              Your farming assistant 🌾
            </p>
          )}
        </div>

        {/* FARMER INFORMATION */}

        {farmer && (
          <div
            style={{
              background: "#f1f8e9",
              padding: "15px",
              textAlign: "center",
              borderBottom:
                "1px solid #ddd",
            }}
          >
            <span
              style={{ margin: "0 10px" }}
            >
              📍 {farmer.location}
            </span>

            <span
              style={{ margin: "0 10px" }}
            >
              🌱 {farmer.soilType}
            </span>

            <span
              style={{ margin: "0 10px" }}
            >
              🌾 {farmer.crops}
            </span>
          </div>
        )}

        {/* MESSAGES */}

        <div
          style={{
            height: "450px",
            overflowY: "auto",
            padding: "25px",
            background: "#fafafa",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "13px 17px",
                  borderRadius: "15px",
                  background:
                    msg.sender === "user"
                      ? "#2e7d32"
                      : "#e8f5e9",
                  color:
                    msg.sender === "user"
                      ? "white"
                      : "#333",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                color: "#666",
                padding: "10px",
              }}
            >
              🤖 Thinking...
            </div>
          )}
        </div>

        {/* INPUT */}

        <div
          style={{
            display: "flex",
            padding: "20px",
            borderTop:
              "1px solid #ddd",
            gap: "10px",
          }}
        >
          {/* VOICE BUTTON */}

          <button
            onClick={startVoiceInput}
            disabled={listening || loading}
            style={{
              padding: "14px 18px",
              background: listening
                ? "#c62828"
                : "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor:
                listening || loading
                  ? "not-allowed"
                  : "pointer",
              fontSize: "20px",
              minWidth: "58px",
            }}
            title={
              listening
                ? "Listening..."
                : "Speak in Telugu"
            }
          >
            {listening ? "🔴" : "🎤"}
          </button>

          {/* TEXT INPUT */}

          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask your farming question..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
            }}
          />

          {/* SEND BUTTON */}

          <button
            onClick={sendMessage}
            disabled={
              loading || !message.trim()
            }
            style={{
              padding: "14px 22px",
              background:
                loading || !message.trim()
                  ? "#9e9e9e"
                  : "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor:
                loading || !message.trim()
                  ? "not-allowed"
                  : "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* VOICE STATUS */}

        {listening && (
          <div
            style={{
              textAlign: "center",
              paddingBottom: "15px",
              color: "#c62828",
              fontWeight: "bold",
            }}
          >
            🎤 Listening... Speak in Telugu
          </div>
        )}
      </div>
    </div>
  );
}
export default Chatbot;
