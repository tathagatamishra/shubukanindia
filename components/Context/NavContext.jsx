// Currently not in use
// Was used in layout.js

"use client";
import { createContext, useContext, useState } from "react";

const NavContext = createContext();

export const useNav = () => useContext(NavContext);

export const NavProvider = ({ children }) => {
  const [showNav, setShowNav] = useState(false); // or true if default is shown

  return (
    <NavContext.Provider value={{ showNav, setShowNav }}>
      {children}
    </NavContext.Provider>
  );
};
