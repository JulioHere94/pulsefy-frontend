import React from "react";
import "../../../blocks/new_playlist.css";

const NewPlaylist = ({ closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2 className="title">Bora, de playlist nova! </h2>
        <form className="new-playlist-form">
          <label htmlFor="mood">Como estáseu humor hoje?</label>
          <select id="mood" name="mood">
            <option value="feliz">😀 Feliz</option>
            <option value="triste">😢 Triste</option>
            <option value="animado">😄 Animado</option>
            <option value="relaxado">😌 Relaxado</option>
          </select>

          <label htmlFor="genre">Escolha o gênero musical:</label>
          <select id="genre" name="genre">
            <option value="pop">💃 Pop</option>
            <option value="rock">🤘 Rock</option>
            <option value="jazz">🎷 Jazz</option>
            <option value="classica">🎻 Clássica</option>
          </select>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Gerar Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPlaylist;
