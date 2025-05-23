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
  const { logout, user, updateUser } = useAuth();
  const {
    spotifyToken,
    user: spotifyUser,
    logout: spotifyLogout,
  } = useSpotify();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    type: "",
    message: "",
  });
  const [editForm, setEditForm] = useState({
    nome: user?.nome || "",
    imagem: user?.imagem || "",
  });

  useEffect(() => {
    const handleMessage = (event) => {
      // console.log("Mensagem recebida do popup:", event.data);

      if (event.data.type === "SPOTIFY_AUTH_SUCCESS") {
        if (authPopup) {
          authPopup.close();
          setAuthPopup(null);
        }
      } else if (event.data.type === "SPOTIFY_AUTH_ERROR" && event.data.error) {
        // Só mostra erro se realmente não autenticou
        if (!spotifyToken) {
          console.error("Erro na autenticação Spotify:", event.data.error);
          alert("Erro ao conectar com o Spotify. Por favor, tente novamente.");
        }
        if (authPopup) {
          authPopup.close();
          setAuthPopup(null);
        }
      }
      // Ignore outras mensagens
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [authPopup, spotifyToken]);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editForm);
      setFeedbackModal({
        isOpen: true,
        type: "success",
        message: "Perfil atualizado com sucesso!",
      });
      setIsUserModalOpen(false);
    } catch (error) {
      setFeedbackModal({
        isOpen: true,
        type: "error",
        message:
          error.response?.data?.msg ||
          "Erro ao atualizar perfil. Tente novamente.",
      });
    }
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ ...feedbackModal, isOpen: false });
  };

  return (
    <header>
      <div className="container">
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
                {spotifyUser
                  ? `Conectado como ${spotifyUser.display_name}`
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
                src={user?.imagem || "https://via.placeholder.com/40"}
                alt="User Icon"
                className="user-icon"
              />
              <span>Olá, {user?.nome || "Usuário"}!</span>
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
              <button
                className="user-modal-button logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
