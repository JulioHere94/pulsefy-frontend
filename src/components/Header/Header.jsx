import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../blocks/header.css";
import "../../blocks/edit_user.css";
import Logo from "../../images/Logo_pulsefy.png";
import Navigation from "../Navigation/navigation";

const Header = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleUserModal = () => setIsUserModalOpen(!isUserModalOpen);
  const handleLogout = () => {
    logout();
    alert("Você foi desconectado!");
    navigate("/login");
  };
  const handleEditUser = () => navigate("/editar-usuario");

  // Fecha menu mobile ao navegar
  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <header>
      <div className="header-container">
        <img src={Logo} alt="Logo" className="logo" />
        <button
          className="hamburger"
          aria-label="Abrir menu"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <Navigation
          isMobileMenuOpen={isMobileMenuOpen}
          handleNavClick={handleNavClick}
        />
        <div className="user-box" onClick={toggleUserModal}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMJfmT5MclUjitj8NyMA0tRWoxClHDs0-zsQ&s"
            alt="User Icon"
            className="user-icon"
          />
          <span>Olá, Usuário!</span>
        </div>
      </div>
      {isUserModalOpen && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <button className="close-button" onClick={toggleUserModal}>
              &times;
            </button>
            <button className="user-modal-button" onClick={handleEditUser}>
              Alterar Usuário
            </button>
            <button className="user-modal-button logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
