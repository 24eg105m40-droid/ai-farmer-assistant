import { useState } from "react";
import api from "../api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    location: "",
    soilType: "",
    crops: ""
  });

  const [farmerId, setFarmerId] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const registerFarmer = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/register-farmer",
        formData
      );

      setFarmerId(response.data.farmerId);
      localStorage.setItem("farmerMobile", formData.mobile);

      alert("Farmer registered successfully! 🌾");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #2E7D32, #81C784)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px"
      }}
    >

      <div
        style={{
          width: "450px",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
        }}
      >

        <h2
          style={{
            textAlign: "center",
            color: "#2E7D32"
          }}
        >
          🌾 Farmer Registration
        </h2>

        <form onSubmit={registerFarmer}>

          <input
            type="text"
            name="name"
            placeholder="Farmer Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            maxLength="10"
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="location"
            placeholder="Village / Location"
            value={formData.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Soil Type</option>
            <option value="Black Soil">Black Soil</option>
            <option value="Red Soil">Red Soil</option>
            <option value="Alluvial Soil">Alluvial Soil</option>
            <option value="Loamy Soil">Loamy Soil</option>
            <option value="Sandy Soil">Sandy Soil</option>
          </select>

          <input
            type="text"
            name="crops"
            placeholder="Crops you grow"
            value={formData.crops}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              background: "#2E7D32",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Register Farmer
          </button>

        </form>

        {farmerId && (
          <div
            style={{
              marginTop: "25px",
              padding: "15px",
              background: "#E8F5E9",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >
            <h3>🎉 Registration Successful!</h3>

            <p>Your Farmer ID:</p>

            <strong
              style={{
                fontSize: "24px",
                color: "#2E7D32"
              }}
            >
              {farmerId}
            </strong>
          </div>
        )}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

export default Register;
