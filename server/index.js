require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./db");
const Farmer = require("./models/Farmer");

const app = express();

// Middleware
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("AI Farmer Assistant Backend is Running 🚜");
});


// ===============================
// SEND OTP
// ===============================

app.post("/api/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number is required"
      });
    }

    // Temporary OTP for development
    const otp = "123456";

    console.log(`OTP for ${mobile}: ${otp}`);

    res.json({
      message: "OTP sent successfully",
      otp: otp
    });

  } catch (error) {
    console.error("OTP Error:", error);

    res.status(500).json({
      message: "Unable to send OTP"
    });
  }
});


// ===============================
// VERIFY OTP
// ===============================

app.post("/api/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        message: "Mobile number and OTP are required"
      });
    }

    if (otp === "123456") {
      return res.json({
        message: "OTP verified successfully",
        verified: true
      });
    }

    res.status(400).json({
      message: "Invalid OTP",
      verified: false
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);

    res.status(500).json({
      message: "OTP verification failed"
    });
  }
});


// ===============================
// REGISTER FARMER
// ===============================

app.post("/api/register-farmer", async (req, res) => {
  try {

    const {
      name,
      mobile,
      location,
      soilType,
      crops
    } = req.body;


    // Check required fields

    if (
      !name ||
      !mobile ||
      !location ||
      !soilType ||
      !crops
    ) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }


    // Check if farmer already exists

    const existingFarmer = await Farmer.findOne({
      mobile: mobile
    });

    if (existingFarmer) {
      return res.status(400).json({
        message: "Farmer with this mobile number already exists"
      });
    }


    // Generate unique Farmer ID

    const farmerId =
      "FAR" + Date.now().toString().slice(-8);


    // Create farmer

    const farmer = new Farmer({
      farmerId: farmerId,
      name: name,
      mobile: mobile,
      location: location,
      soilType: soilType,
      crops: crops
    });


    // Save to MongoDB

    await farmer.save();


    console.log("✅ Farmer registered:", farmerId);


    res.status(201).json({
      message: "Farmer registered successfully",
      farmerId: farmerId
    });


  } catch (error) {

    console.error("Registration Error:", error);

    res.status(500).json({
      message: "Registration failed"
    });

  }
});


// ===============================
// GET FARMER BY MOBILE
// ===============================

app.get("/api/farmer/:mobile", async (req, res) => {

  try {

    const { mobile } = req.params;


    const farmer = await Farmer.findOne({
      mobile: mobile
    });


    if (!farmer) {

      return res.status(404).json({
        message: "Farmer not found"
      });

    }


    res.json(farmer);


  } catch (error) {

    console.error("Get Farmer Error:", error);

    res.status(500).json({
      message: "Unable to get farmer details"
    });

  }

});

// Weather API
app.get("/api/weather/:city", async (req, res) => {
  try {
    const { city } = req.params;

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        message: "OpenWeather API key is missing on server"
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(
      "Weather API Error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      message: "Unable to get weather"
    });
  }
});
// ================= CHATBOT =================

app.post("/api/chat", async (req, res) => {
  try {
    const { message, farmer } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Please enter a farming question."
      });
    }

    const question = message.toLowerCase();
    const isTelugu =
  /[\u0C00-\u0C7F]/.test(message);
  console.log("Telugu question:", isTelugu);

    // Farmer information
    const farmerName = farmer?.name || "Farmer";
    const farmerLocation = farmer?.location || "your area";
    const farmerSoil = farmer?.soilType || "your soil";
    const farmerCrop = farmer?.crops || "your crop";

    console.log("👨‍🌾 Farmer:", farmerName);
    console.log("📍 Location:", farmerLocation);
    console.log("🌱 Soil:", farmerSoil);
    console.log("🌾 Crop:", farmerCrop);
    console.log("💬 Question:", message);

    let reply =
      `Namaste ${farmerName}! 👨‍🌾🌾 Please ask me about crops, soil, weather, irrigation, or farming problems.`;

    /// ================= COTTON =================

if (
  question.includes("cotton") ||
  question.includes("పత్తి")
) {
  if (
    question.includes("yellow") ||
    question.includes("yellowing") ||
    question.includes("పసుపు")
  ) {
    reply =
      `🌱 ${farmerName}, మీ పత్తి ఆకులు పసుపు రంగులోకి మారడానికి పోషకాల లోపం, అధిక నీరు లేదా వేర్ల సమస్యలు కారణం కావచ్చు. మీ ${farmerSoil} నేలలో తేమను పరిశీలించండి మరియు ఆకులు, వేర్లను జాగ్రత్తగా పరిశీలించండి.`;
  }

  else if (
    question.includes("pest") ||
    question.includes("insect") ||
    question.includes("పురుగు")
  ) {
    reply =
      `🐛 ${farmerName}, మీ పత్తి మొక్కలను జాగ్రత్తగా పరిశీలించండి. ఆకులపై రంధ్రాలు, పురుగులు లేదా నష్టం ఉందో చూడండి. పురుగును గుర్తించకుండా మందులు వాడకండి.`;
  }

  else {
    reply =
      `🌱 ${farmerName}, మీ నమోదు చేసిన నేల ${farmerSoil}. మీ ప్రధాన పంట ${farmerCrop}. పత్తి పంటకు నేల తేమను సరిగ్గా నిర్వహించడం, పురుగులను గమనించడం మరియు సరైన పోషకాలను అందించడం ముఖ్యం.`;
  }
}


// ================= PADDY =================

else if (
  question.includes("paddy") ||
  question.includes("rice") ||
  question.includes("వరి")
) {

  if (isTelugu) {
    reply =
      `🌾 ${farmerName} గారు, ${farmerLocation} ప్రాంతంలో వరి సాగు చేస్తున్నప్పుడు తగినంత నీటి స్థాయిని నిర్వహించండి. కలుపు మొక్కలు, పురుగులు మరియు పంట ఆరోగ్యాన్ని క్రమం తప్పకుండా పరిశీలించండి. మీ నమోదు చేసిన నేల ${farmerSoil}.`;
  } else {
    reply =
      `🌾 ${farmerName}, for paddy cultivation in ${farmerLocation}, maintain suitable water levels and regularly monitor weeds, pests, and crop health. Your registered soil is ${farmerSoil}.`;
  }

}


// ================= SOIL =================

else if (
  question.includes("soil") ||
  question.includes("మట్టి")
) {

  if (isTelugu) {
    reply =
      `🌱 ${farmerName} గారు, మీ నమోదు చేసిన నేల రకం ${farmerSoil}. నేల ఆరోగ్యం తేమ, నీటి పారుదల, సేంద్రీయ పదార్థం మరియు పోషకాల స్థాయిపై ఆధారపడి ఉంటుంది. ఎరువులు ఎక్కువగా వేయడానికి ముందు నేల పరీక్ష చేయించడం మంచిది.`;
  } else {
    reply =
      `🌱 ${farmerName}, your registered soil type is ${farmerSoil}. Soil health depends on moisture, drainage, organic matter, and nutrient levels. Soil testing is recommended before making major fertilizer decisions.`;
  }

}


// ================= WEATHER =================

else if (
  question.includes("weather") ||
  question.includes("rain") ||
  question.includes("rainfall") ||
  question.includes("వర్షం")
) {

  if (isTelugu) {
    reply =
      `🌦️ ${farmerName} గారు, మీ వ్యవసాయ ప్రాంతం ${farmerLocation}. నీటిపారుదల లేదా పొలంలో పనులను ప్లాన్ చేసే ముందు డాష్‌బోర్డ్‌లోని Weather విభాగంలో ప్రస్తుత వాతావరణం మరియు వర్షపాతం సమాచారాన్ని పరిశీలించండి.`;
  } else {
    reply =
      `🌦️ ${farmerName}, your registered farming location is ${farmerLocation}. Please check the Weather section of your dashboard for current weather and rainfall information before planning irrigation or field activities.`;
  }

}


// ================= FERTILIZER =================

else if (
  question.includes("fertilizer") ||
  question.includes("fertiliser") ||
  question.includes("ఎరువు")
) {

  if (isTelugu) {
    reply =
      `🌿 ${farmerName} గారు, ఎరువుల అవసరం మీ ${farmerCrop} పంట మరియు ${farmerSoil} నేలపై ఆధారపడి ఉంటుంది. పోషకాల అవసరాన్ని తెలుసుకోవడానికి నేల పరీక్ష చేయించడం ఉత్తమం. అవసరానికి మించి ఎరువులు ఉపయోగించకండి.`;
  } else {
    reply =
      `🌿 ${farmerName}, fertilizer requirements depend on your ${farmerCrop} crop and ${farmerSoil} soil. A soil test is the best way to determine nutrient requirements. Avoid excessive fertilizer application.`;
  }

}


// ================= WATER / IRRIGATION =================

else if (
  question.includes("water") ||
  question.includes("irrigation") ||
  question.includes("నీరు")
) {

  if (isTelugu) {
    reply =
      `💧 ${farmerName} గారు, నీటిపారుదల మీ పంట దశ, నేలలో తేమ, వర్షపాతం మరియు వాతావరణ పరిస్థితులపై ఆధారపడి ఉండాలి. మీరు ${farmerCrop} పంటను సాగు చేస్తున్నారు కాబట్టి, అధిక నీరు మరియు ఎక్కువ కాలం నీటి కొరత రెండింటినీ నివారించండి.`;
  } else {
    reply =
      `💧 ${farmerName}, irrigation should depend on your crop stage, soil moisture, rainfall, and weather conditions. Since you are farming ${farmerCrop}, avoid both excessive watering and prolonged water stress.`;
  }

}


// ================= GREETING =================

else if (
  question.includes("hello") ||
  question.includes("hi") ||
  question.includes("namaste") ||
  question.includes("నమస్కారం") ||
  question.includes("హలో")
) {

  if (isTelugu) {
    reply =
      `🙏 నమస్కారం ${farmerName} గారు! 👨‍🌾🌾 మీ ${farmerCrop} పంటకు సంబంధించి నేను మీకు ఎలా సహాయం చేయగలను?`;
  } else {
    reply =
      `Namaste ${farmerName}! 👨‍🌾🌾 How can I help you with your ${farmerCrop} crop today?`;
  }

}


// ================= DEFAULT =================

else {

  if (isTelugu) {
    reply =
      `👨‍🌾 ${farmerName} గారు, మీరు ${farmerLocation} ప్రాంతంలో ${farmerCrop} పంటను ${farmerSoil} నేలలో సాగు చేస్తున్నారు. మీ పంట, నేల, ఎరువులు, నీటిపారుదల, పురుగులు లేదా వాతావరణం గురించి ప్రశ్న అడగండి.`;
  } else {
    reply =
      `👨‍🌾 ${farmerName}, I know that you are farming ${farmerCrop} in ${farmerLocation} with ${farmerSoil}. Please ask me about your crop, soil, fertilizer, irrigation, pests, or weather.`;
  }

}

res.json({
  reply: reply
});

  } catch (error) {

    console.error("Chatbot error:", error);

    res.status(500).json({
      reply: "Sorry, I could not process your question."
    });
  }
});
// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3000;


const startServer = async () => {

  try {

    // Connect MongoDB first

    await connectDB();


    // Start Express server

    app.listen(PORT, () => {

      console.log(
        `Server running on http://localhost:${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "❌ Failed to start server:",
      error
    );

  }

};


startServer();
