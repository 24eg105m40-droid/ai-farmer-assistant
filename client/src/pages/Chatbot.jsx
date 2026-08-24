import { useEffect, useState, useRef } from "react";
import api from "../api";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState(null);

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

  const startVoiceInput = (language) => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (listening || loading) {
      return;
    }

    const recognition = new SpeechRecognition();

    // Set selected voice language
    recognition.lang =
      language === "te" ? "te-IN" : "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    setVoiceLanguage(language);

    recognition.onstart = () => {
      console.log(
        language === "te"
          ? "🎤 Listening for Telugu..."
          : "🎤 Listening for English..."
      );

      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      console.log(
        "🎤 Speech detected:",
        transcript
      );

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "🎤 Voice recognition error:",
        event.error
      );

      setListening(false);
      setVoiceLanguage(null);
    };

    recognition.onend = () => {
      console.log(
        "🎤 Voice recognition ended"
      );

      setListening(false);
      setVoiceLanguage(null);
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
      setVoiceLanguage(null);
    }
  };

  // ==========================================
  // STOP VOICE
  // ==========================================

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
    setVoiceLanguage(null);
  };

  // ==========================================
  // SPEAK BOT RESPONSE
  // ==========================================

  const speakResponse = (reply) => {
    if (!reply || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(reply);

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
          farmer: farmer,

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

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: botReply,
        },
      ]);

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
            <span style={{ margin: "0 10px" }}>
              📍 {farmer.location}
            </span>

            <span style={{ margin: "0 10px" }}>
              🌱 {farmer.soilType}
            </span>

            <span style={{ margin: "0 10px" }}>
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
            padding: "20px",
            borderTop: "1px solid #ddd",
          }}
        >

          {/* VOICE BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
            }}
          >

            {/* ENGLISH */}

            <button
              onClick={() =>
                listening
                  ? stopVoiceInput()
                  : startVoiceInput("en")
              }
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                background:
                  listening &&
                  voiceLanguage === "en"
                    ? "#c62828"
                    : "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {listening &&
              voiceLanguage === "en"
                ? "🔴 Listening..."
                : "🎤 English"}
            </button>

            {/* TELUGU */}

            <button
              onClick={() =>
                listening
                  ? stopVoiceInput()
                  : startVoiceInput("te")
              }
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                background:
                  listening &&
                  voiceLanguage === "te"
                    ? "#c62828"
                    : "#388e3c",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {listening &&
              voiceLanguage === "te"
                ? "🔴 వింటున్నాను..."
                : "🎤 తెలుగు"}
            </button>

          </div>

          {/* TEXT INPUT */}

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >

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

            <button
              onClick={sendMessage}
              disabled={
                loading ||
                !message.trim()
              }
              style={{
                padding: "14px 22px",
                background:
                  loading ||
                  !message.trim()
                    ? "#9e9e9e"
                    : "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor:
                  loading ||
                  !message.trim()
                    ? "not-allowed"
                    : "pointer",
                fontSize: "16px",
              }}
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

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
            {voiceLanguage === "te"
              ? "🎤 తెలుగు లో మాట్లాడండి..."
              : "🎤 Speak in English..."}
          </div>
        )}

      </div>
    </div>
  );
}

export default Chatbot;