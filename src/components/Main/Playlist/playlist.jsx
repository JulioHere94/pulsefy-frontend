import React, { useState } from "react";
import "../../../blocks/playlist.css";
import CoverEdit from "./Cover_edit/cover_edit";
import Play from "../../../images/botao-play.png"

const Playlist = ({ closeModal }) => {
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      name: "Playlist Feliz",
      date: "12/05/2025",
      genre: "Pop",
      mood: "Feliz",
      cover:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzpwoKaeKfCwBaM-HuokUU-j2ph0s0oUABlQ&s",
    },
    {
      id: 2,
      name: "Playlist Relaxada",
      date: "10/05/2025",
      genre: "Jazz",
      mood: "Relaxado",
      cover:
        "https://akamai.sscdn.co/letras/360x360/albuns/a/2/7/a/201381628624477.jpg",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [isCoverEditOpen, setIsCoverEditOpen] = useState(false);
  const [currentCover, setCurrentCover] = useState("");
  const [currentCoverId, setCurrentCoverId] = useState(null);

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const saveEdit = (id) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === id ? { ...playlist, name: editedName } : playlist
      )
    );
    setEditingId(null);
    setEditedName("");
  };

  const openCoverEdit = (id, cover) => {
    setCurrentCoverId(id);
    setCurrentCover(cover);
    setIsCoverEditOpen(true);
  };

  const saveCoverEdit = (newCover) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === currentCoverId
          ? { ...playlist, cover: newCover }
          : playlist
      )
    );
    setIsCoverEditOpen(false);
  };

  const playPlaylist = (id) => {
    alert(`Tocando a playlist com ID: ${id}`);
    // Aqui você pode implementar a lógica para tocar a playlist
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2>Playlists Geradas</h2>
        <ul className="playlist-list">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="playlist-item">
              <img
                src={playlist.cover}
                alt={`Capa da ${playlist.name}`}
                className="playlist-cover"
              />
              <div className="playlist-info">
                {editingId === playlist.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <h3>{playlist.name}</h3>
                )}
                <p>Data: {playlist.date}</p>
                <p>Gênero: {playlist.genre}</p>
                <p>Humor: {playlist.mood}</p>
              </div>
              {editingId === playlist.id ? (
                <button
                  className="save-button"
                  onClick={() => saveEdit(playlist.id)}
                >
                  Salvar
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={() => startEditing(playlist.id, playlist.name)}
                >
                  Editar Nome
                </button>
              )}
              <button
                className="edit-button"
                onClick={() => openCoverEdit(playlist.id, playlist.cover)}
              >
                Editar Capa
              </button>
              <button
                className="play-button"
                onClick={() => playPlaylist(playlist.id)}>
                <img src={Play} alt="Play" className="play-icon" />
              </button>
            </li>
          ))}
        </ul>
        {isCoverEditOpen && (
          <CoverEdit
            currentCover={currentCover}
            onSave={saveCoverEdit}
            onClose={() => setIsCoverEditOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Playlist;
