const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://tripplanner-backend-2xgg.onrender.com"; // metti il dominio reale del backend

export default API_BASE_URL;
