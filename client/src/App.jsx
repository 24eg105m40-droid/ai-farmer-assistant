import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Weather from "./pages/Weather";
import Soil from "./pages/Soil";
import CropSuggestions from "./pages/CropSuggestions";
import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Weather */}
        <Route
          path="/weather"
          element={<Weather />}
        />

        {/* Soil */}
        <Route
          path="/soil"
          element={<Soil />}
        />
        <Route
  path="/crops"
  element={<CropSuggestions />}
/>
<Route
  path="/chatbot"
  element={<Chatbot />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;