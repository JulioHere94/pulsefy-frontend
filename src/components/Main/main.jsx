import React, { useState } from "react";
import "../../blocks/main.css";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import Playlist from "./Playlist/playlist";
import Favorites from "../Favorites/Favorites";
import PlaylistGenerator from "../PlaylistGenerator/PlaylistGenerator";
import { useSpotify } from "../../context/SpotifyContext";

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const { spotifyToken, isLoading } = useSpotify();

  const openModal = () => {
    if (!spotifyToken) {
      alert("Por favor, conecte sua conta do Spotify primeiro!");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openPlaylistModal = () => {
    if (!spotifyToken) {
      alert("Por favor, conecte sua conta do Spotify primeiro!");
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  const closePlaylistModal = () => setIsPlaylistModalOpen(false);

  const openFavorites = () => {
    if (!spotifyToken) {
      alert("Por favor, conecte sua conta do Spotify primeiro!");
      return;
    }
    setIsFavoritesOpen(true);
  };

  const closeFavorites = () => setIsFavoritesOpen(false);

  const handleSaveFavorites = (artists) => {
    setFavoriteArtists(artists);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-container">
        <div className="main-buttons-container">
          <button className="main-button button-0" onClick={openFavorites}>
            Artistas/Bandas
            <p className="main-button-text">
              Conheça os artistas/bandas, trazemos informações tais como:
              albuns, biografias e muito mais.
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
        </div>
      </main>
      {isFavoritesOpen && (
        <Favorites
          accessToken={spotifyToken}
          onSaveFavorites={handleSaveFavorites}
          closeModal={closeFavorites}
        />
      )}
      {isModalOpen && <PlaylistGenerator closeModal={closeModal} />}
      {isPlaylistModalOpen && <Playlist closeModal={closePlaylistModal} />}
      <Footer />
    </>
  );
};

export default Main;
