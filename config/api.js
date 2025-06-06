const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://tuo-backend.vercel.app"; // metti il dominio reale del backend

export default API_BASE_URL;
