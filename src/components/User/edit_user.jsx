import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../blocks/edit_user.css";
import Header from "../Header/Header";
import Footer from "../Footer/footer";
import { useAuth } from "../../context/AuthContext";

const EditUser = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [userName, setUserName] = useState(currentUser?.nome || "");
  const [userPhoto, setUserPhoto] = useState(currentUser?.imagem || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.nome);
      setUserPhoto(currentUser.imagem);
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!userName.trim()) {
      setError("O nome é obrigatório");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await updateUser({
        nome: userName,
        imagem: userPhoto,
      });
      alert("Alterações salvas com sucesso!");
      navigate("/");
    } catch (error) {
      setError(error.msg || "Erro ao salvar alterações");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="edit-user-container">
        <h1 className="edit-user-title">Editar Usuário</h1>
        <img
          src={userPhoto || "https://via.placeholder.com/100"}
          alt="Foto do Usuário"
          className="edit-user-avatar"
        />
        {error && <p className="error-message">{error}</p>}
        <form className="edit-user-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="user-name">Nome:</label>
          <input
            type="text"
            id="user-name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="edit-input"
            disabled={loading}
          />
          <label htmlFor="user-photo">Foto (URL):</label>
          <input
            type="text"
            id="user-photo"
            value={userPhoto}
            onChange={(e) => setUserPhoto(e.target.value)}
            className="edit-input"
            disabled={loading}
          />
          <button
            type="button"
            className="save-button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditUser;
