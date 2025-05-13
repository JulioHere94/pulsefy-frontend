import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../blocks/header.css";
import "../../blocks/edit_user.css";
import Logo from "../../images/Logo_pulsefy.png";

const Header = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  const handleLogout = () => {
    logout();
    alert("Você foi desconectado!");
    navigate("/login");
  };

  const handleEditUser = () => {
    navigate("/editar-usuario"); // Redireciona para a página de edição do usuário
  };

  return (
    <header>
      <div className="header-container">
        <img src={Logo} alt="Logo" className="logo" />
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre</Link>
            </li>
            <li>
              <Link to="/contato">Contato</Link>
            </li>
          </ul>
        </nav>
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
