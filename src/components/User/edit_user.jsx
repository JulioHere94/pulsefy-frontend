import React, { useState } from "react";
import "../../blocks/user.css";

const EditUser = () => {
  const [userName, setUserName] = useState("Usuário");
  const [userPhoto, setUserPhoto] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMJfmT5MclUjitj8NyMA0tRWoxClHDs0-zsQ&s"
  );

  const handleSave = () => {
    alert("Alterações salvas com sucesso!");
    // Aqui você pode implementar a lógica para salvar as alterações
  };

  return (
    <div className="edit-user-container">
      <h2>Editar Usuário</h2>
      <form className="edit-user-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="user-name">Nome:</label>
        <input
          type="text"
          id="user-name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="edit-input"
        />
        <label htmlFor="user-photo">Foto (URL):</label>
        <input
          type="text"
          id="user-photo"
          value={userPhoto}
          onChange={(e) => setUserPhoto(e.target.value)}
          className="edit-input"
        />
        <button type="button" className="save-button" onClick={handleSave}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditUser;
