import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSpotify } from "../../context/SpotifyContext";
import { loginUrl } from "../../utils/spotify.config";
import "../../blocks/header.css";
import "../../blocks/edit_user.css";
import Logo from "../../images/Logo_pulsefy.png";
import Navigation from "../Navigation/navigation";

const Header = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authPopup, setAuthPopup] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { spotifyToken, user, logout: spotifyLogout } = useSpotify();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "SPOTIFY_AUTH_SUCCESS") {
        if (authPopup) {
          authPopup.close();
          setAuthPopup(null);
        }
      } else if (event.data.type === "SPOTIFY_AUTH_ERROR") {
        console.error("Erro na autenticação Spotify:", event.data.error);
        alert("Erro ao conectar com o Spotify. Por favor, tente novamente.");
        if (authPopup) {
          authPopup.close();
          setAuthPopup(null);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [authPopup]);

  const handleSpotifyConnect = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Configurações da janela popup
    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    try {
      // Abre a autenticação do Spotify em um popup
      const popup = window.open(
        loginUrl,
        "Spotify Login",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (!popup) {
        alert("Por favor, permita popups para fazer login no Spotify.");
        return;
      }

      setAuthPopup(popup);

      // Monitora o fechamento manual do popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setAuthPopup(null);
        }
      }, 500);
    } catch (error) {
      console.error("Erro ao abrir popup:", error);
      alert("Ocorreu um erro ao tentar abrir a janela de login do Spotify.");
    }
  };

  const handleSpotifyLogout = () => {
    spotifyLogout();
    window.location.reload();
  };

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
        <div className="header-actions">
          {spotifyToken ? (
            <button
              className="spotify-status-button connected"
              onClick={handleSpotifyLogout}
            >
              <img
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
                alt="Spotify"
                className="spotify-button-icon"
              />
              {user
                ? `Conectado como ${user.display_name}`
                : "Conectado ao Spotify"}
            </button>
          ) : (
            <button
              className="spotify-status-button"
              onClick={handleSpotifyConnect}
            >
              <img
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
                alt="Spotify"
                className="spotify-button-icon"
              />
              Conectar Spotify
            </button>
          )}
          <div className="user-box" onClick={toggleUserModal}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMJfmT5MclUjitj8NyMA0tRWoxClHDs0-zsQ&s"
              alt="User Icon"
              className="user-icon"
            />
            <span>Olá, Usuário!</span>
          </div>
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
