import axios from "axios";
const remote_api = "https://shubukanindiabackend.vercel.app"
const local_api = "http://localhost:1234"

// axios config
export const shubukan_api = axios.create({
  // baseURL: local_api,
  baseURL: remote_api,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});