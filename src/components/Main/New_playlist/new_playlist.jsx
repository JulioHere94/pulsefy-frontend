import React, { useRef, useState } from "react";
import { useModalClose } from "../../../utils/usemodalClose";
import { apiPost } from "../../../utils/API"; // ajuste o caminho conforme sua estrutura
import Preloader from "../../Preloader/preloader";
import "../../../blocks/new_playlist.css";

const NewPlaylist = ({ closeModal }) => {
  const modalRef = useRef(null);
  useModalClose(modalRef, closeModal);

  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("feliz");
  const [genre, setGenre] = useState("pop");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui você pode adaptar o endpoint e body conforme sua lógica
      const response = await apiPost("/me/playlists", {
        name: `Playlist ${mood} - ${genre}`,
        description: `Criada com humor ${mood} e gênero ${genre}`,
        public: false,
      });

      console.log("Playlist criada com sucesso:", response);
      alert("Playlist criada com sucesso!");
      closeModal();
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
      alert("Erro ao criar playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" ref={modalRef}>
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2 className="title">Bora, de playlist nova! </h2>

        {loading ? (
          <Preloader />
        ) : (
          <form className="new-playlist-form" onSubmit={handleSubmit}>
            <label htmlFor="mood">Como está seu humor hoje?</label>
            <select
              id="mood"
              name="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="feliz">😀 Feliz</option>
              <option value="triste">😢 Triste</option>
              <option value="animado">😄 Animado</option>
              <option value="relaxado">😌 Relaxado</option>
            </select>

            <label htmlFor="genre">Escolha o gênero musical:</label>
            <select
              id="genre"
              name="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
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
        )}
      </div>
    </div>
  );
};

export default NewPlaylist;
