"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { shubukan_api } from "@/config";

const GuardianAuthContext = createContext(null);

export function GuardianAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [guardian, setGuardian] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (t) => {
    try {
      const res = await shubukan_api.get("/guardian/profile", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setGuardian(res.data);
    } catch (err) {
      localStorage.removeItem("guardian_token");
      setToken(null);
      setGuardian(null);
    }
  }, []);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("guardian_token") : null;
    if (t) {
      setToken(t);
      loadProfile(t).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadProfile]);

  const login = (t) => {
    localStorage.setItem("guardian_token", t);
    setToken(t);
    loadProfile(t);
  };

  const logout = () => {
    localStorage.removeItem("guardian_token");
    setToken(null);
    setGuardian(null);
  };

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <GuardianAuthContext.Provider value={{ token, guardian, loading, login, logout, authHeader }}>
      {children}
    </GuardianAuthContext.Provider>
  );
}

export function useGuardianAuth() {
  return useContext(GuardianAuthContext);
}
