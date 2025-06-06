const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "tripplanner-backend-production.up.railway.app"; // metti il dominio reale del backend

export default API_BASE_URL;
