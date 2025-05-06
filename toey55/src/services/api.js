import axios from "axios";

// pick VITE_API_URL in dev, VITE_PUBLIC_API_URL in prod
const isDev = import.meta.env.DEV;

const baseURL = isDev
  ? import.meta.env.VITE_API_URL   
  : import.meta.env.VITE_PUBLIC_API_URL; 



const api = axios.create({
  baseURL,
  withCredentials: true, // critical for sending cookies!
});

export default api;
