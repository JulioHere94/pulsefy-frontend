import React, { useState } from "react";
import "../../../../blocks/cover_edit.css";

const CoverEdit = ({ currentCover, onSave, onClose }) => {
  const [newCover, setNewCover] = useState(currentCover);

  const handleSave = () => {
    onSave(newCover);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Editar Capa</h2>
        <form className="cover-edit-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="cover-link">Link da nova capa:</label>
          <input
            type="text"
            id="cover-link"
            value={newCover}
            onChange={(e) => setNewCover(e.target.value)}
            className="cover-input"
          />
          <div className="form-buttons">
            <button type="button" className="save-button" onClick={handleSave}>
              Salvar
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoverEdit;
