import React, { useState } from "react";
import "../../blocks/main.css";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import NewPlaylist from "./New_playlist/new_playlist";
import Playlist from "./Playlist/playlist";
import Favorites from "./Favorites/favorites";

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favoriteArtists, setFavoriteArtists] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openPlaylistModal = () => setIsPlaylistModalOpen(true);
  const closePlaylistModal = () => setIsPlaylistModalOpen(false);

  const openFavorites = () => setIsFavoritesOpen(true);
  const closeFavorites = () => setIsFavoritesOpen(false);

  const handleSaveFavorites = (artists) => {
    setFavoriteArtists(artists);
    // Aqui você pode salvar no localStorage ou enviar para backend se quiser
  };

  return (
    <>
      <Header />
      <main className="main-container">
        <button className="main-button button-0" onClick={openFavorites}>
          Artistas/Bandas Favoritos
          <p className="main-button-text">
            Clique para definir os artistas/bandas que você mais gosta.
          </p>
        </button>
        <button className="main-button button-1" onClick={openModal}>
          Gerar Playlist
          <p className="main-button-text">
            Clique para gerar uma playlist de acordo com seu humor e o gênero
            musical que você escolher
          </p>
        </button>
        <button className="main-button button-2" onClick={openPlaylistModal}>
          <h1 className="main-button-title">Playlists Geradas</h1>
          <p className="main-button-text">
            Visualize as suas playlists geradas
          </p>
        </button>
      </main>
      {isFavoritesOpen && (
        <Favorites closeModal={closeFavorites} onSave={handleSaveFavorites} />
      )}
      {isModalOpen && <NewPlaylist closeModal={closeModal} />}
      {isPlaylistModalOpen && <Playlist closeModal={closePlaylistModal} />}
      <Footer />
    </>
  );
};

export default Main;
