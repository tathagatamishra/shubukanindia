import axios from "axios";

// Which backend to talk to. Set NEXT_PUBLIC_API_URL in .env.local for local
// development (e.g. http://localhost:8080); production falls back to the
// deployed backend.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://shubukanindiabackend.vercel.app";

// axios config
export const shubukan_api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
