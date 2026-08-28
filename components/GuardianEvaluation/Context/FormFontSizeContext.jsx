"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "gef_form_font_scale";
export const MIN_FONT_SIZE = 6;
export const MAX_FONT_SIZE = 22;
export const DEFAULT_FONT_SIZE = 14; // matches the form's normal base text size

const FormFontSizeContext = createContext(null);

export function FormFontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (saved >= MIN_FONT_SIZE && saved <= MAX_FONT_SIZE) setFontSize(saved);
  }, []);

  const updateFontSize = (value) => {
    setFontSize(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  };

  return (
    <FormFontSizeContext.Provider value={{ fontSize, setFontSize: updateFontSize }}>
      {children}
    </FormFontSizeContext.Provider>
  );
}

export function useFormFontSize() {
  return useContext(FormFontSizeContext);
}
