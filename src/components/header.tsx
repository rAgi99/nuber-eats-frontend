import React from "react";
import nuberLogo from "../images/logo.svg";

export const Header = () => (
  <header className="py-4">
    <div className="w-full max-w-screen-xl mx-auto">
      <img src={nuberLogo} alt="Nuber Eats" className="w-40 mb-5" />
      Im the header
    </div>
  </header>
);
