import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Weather from "./pages/Weather";
import Soil from "./pages/Soil";
import CropSuggestions from "./pages/CropSuggestions";
import Chatbot from "./pages/Chatbot";
import CropDisease from "./pages/CropDisease";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= REGISTER ================= */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ================= WEATHER ================= */}
        <Route
          path="/weather"
          element={<Weather />}
        />

        {/* ================= SOIL ================= */}
        <Route
          path="/soil"
          element={<Soil />}
        />

        {/* ================= CROP SUGGESTIONS ================= */}
        <Route
          path="/crops"
          element={<CropSuggestions />}
        />

        {/* ================= AI CHATBOT ================= */}
        <Route
          path="/chatbot"
          element={<Chatbot />}
        />

        {/* ================= CROP DISEASE DETECTION ================= */}
        <Route
          path="/crop-disease"
          element={<CropDisease />}
        />

        {/* ================= UNKNOWN PAGE ================= */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;