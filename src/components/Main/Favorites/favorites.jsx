import React, { useState, useRef } from "react";
import { useModalClose } from "../../../utils/usemodalClose";
import "../../../blocks/favorites.css";

const Favorites = ({ closeModal, onSave }) => {
  const [artists, setArtists] = useState(["", "", "", "", ""]);
  const modalRef = useRef(null);

  useModalClose(modalRef, closeModal);

  const handleChange = (index, value) => {
    const updated = [...artists];
    updated[index] = value;
    setArtists(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = artists.filter((a) => a.trim() !== "");
    onSave(filtered);
    closeModal();
  };

  return (
    <div className="favorites-modal" ref={modalRef}>
      <div className="favorites-modal-content">
        <button className="favorites-close" onClick={closeModal}>
          ×
        </button>
        <h2>Seus Artistas/Bandas Favoritos</h2>
        <form onSubmit={handleSubmit}>
          {[0, 1, 2, 3, 4].map((i) => (
            <input
              key={i}
              type="text"
              placeholder={`Artista/Banda ${i + 1}`}
              value={artists[i]}
              maxLength={40}
              onChange={(e) => handleChange(i, e.target.value)}
              className="favorites-input"
            />
          ))}
          <button type="submit" className="favorites-save">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Favorites;
