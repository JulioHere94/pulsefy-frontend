import React from "react";
import { Link } from "react-router-dom";
import "../../blocks/navigation.css";

const Navigation = ({ isMobileMenuOpen, handleNavClick }) => (
  <nav className={isMobileMenuOpen ? "nav-mobile open" : "nav-mobile"}>
    <ul className="nav-links">
      <li>
        <Link to="/" onClick={handleNavClick}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/sobre" onClick={handleNavClick}>
          Sobre
        </Link>
      </li>
      <li>
        <Link to="/contato" onClick={handleNavClick}>
          Contato
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
