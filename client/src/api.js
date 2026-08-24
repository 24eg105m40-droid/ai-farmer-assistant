import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// ===============================
// ADD JWT TOKEN TO REQUESTS
// ===============================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// HANDLE UNAUTHORIZED REQUESTS
// ===============================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      console.log("🔐 Authentication expired or invalid");

      localStorage.removeItem("token");
      localStorage.removeItem("farmerMobile");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;