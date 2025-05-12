import React, { useState } from "react";
import "../../blocks/main.css";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import NewPlaylist from "./New_playlist/new_playlist";
import Playlist from "./Playlist/playlist";

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openPlaylistModal = () => setIsPlaylistModalOpen(true);
  const closePlaylistModal = () => setIsPlaylistModalOpen(false);

  return (
    <>
      <Header />
      <main className="main-container">
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
      {isModalOpen && <NewPlaylist closeModal={closeModal} />}
      {isPlaylistModalOpen && <Playlist closeModal={closePlaylistModal} />}
      <Footer />
    </>
  );
};

export default Main;
