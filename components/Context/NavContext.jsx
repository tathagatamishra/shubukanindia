// Currently not in use
// Was used in layout.js

"use client";
import { createContext, useContext, useState } from "react";
import Navbar from "../Navbar/Navbar";

const NavContext = createContext();

export const useNav = () => useContext(NavContext);

export const NavProvider = () => {
  const [showNav, setShowNav] = useState(false); // or true if default is shown

  return (
    <NavContext.Provider value={{ showNav, setShowNav }}>
      <Navbar />
    </NavContext.Provider>
  );
};
