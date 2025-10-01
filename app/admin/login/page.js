// app/admin/login/page.js
"use client";
import { useState } from "react";
import { shubukan_api } from "@/config";

export default function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await shubukan_api.post("/admin/login", { id, password });
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin";
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-[20px] bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-xl p-6 w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <input
          className="w-full mb-3 border p-2 rounded"
          placeholder="Admin ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="w-full mb-3 border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
