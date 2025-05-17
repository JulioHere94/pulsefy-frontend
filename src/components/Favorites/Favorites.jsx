import React, { useState, useEffect } from "react";
import { spotifyService } from "../../services/spotifyService";
import { favoritesService } from "../../services/favoritesService";
import "../../blocks/favorites.css";

const Favorites = ({ accessToken, onSaveFavorites, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) {
      loadInitialData();
    }
  }, [accessToken]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all([loadTopArtists(), loadFavoriteArtists()]);
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError("Erro ao carregar dados iniciais");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopArtists = async () => {
    try {
      const artists = await spotifyService.getTopArtists(accessToken);
      setTopArtists(artists);
    } catch (error) {
      console.error("Error loading top artists:", error);
      throw error;
    }
  };

  const loadFavoriteArtists = async () => {
    try {
      const favorites = await favoritesService.getFavoriteArtists();
      if (favorites && favorites.artists) {
        setSelectedArtists(favorites.artists);
      }
    } catch (error) {
      console.error("Error loading favorite artists:", error);
      throw error;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      const results = await spotifyService.searchArtists(
        accessToken,
        searchQuery
      );
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching artists:", error);
      setError("Erro ao buscar artistas");
    } finally {
      setIsSearching(false);
    }
  };

  const handleArtistSelect = (e) => {
    const artistId = e.target.value;
    if (!artistId) return;

    const artist = searchResults.find((a) => a.id === artistId);
    if (!artist) return;

    if (selectedArtists.find((a) => a.id === artist.id)) {
      setSelectedArtists(selectedArtists.filter((a) => a.id !== artist.id));
    } else if (selectedArtists.length < 5) {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  const removeArtist = (artistId) => {
    setSelectedArtists(selectedArtists.filter((a) => a.id !== artistId));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      console.log("Salvando artistas:", selectedArtists);

      await favoritesService.saveFavoriteArtists(selectedArtists);
      onSaveFavorites(selectedArtists);

      console.log("Artistas salvos com sucesso!");
      if (typeof closeModal === "function") {
        closeModal();
      }
    } catch (error) {
      console.error("Erro ao salvar artistas:", error);
      setError("Erro ao salvar artistas favoritos. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = (e) => {
    if (
      e.target.className === "favorites-modal" &&
      typeof closeModal === "function"
    ) {
      closeModal();
    }
  };

  return (
    <div className="favorites-modal" onClick={handleCloseModal}>
      <div
        className="favorites-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="favorites-close" onClick={closeModal}>
          ×
        </button>
        <h2>Selecione Seus Artistas Favoritos</h2>
        <p>Selecionados: {selectedArtists.length}/5</p>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="preloader-container">
            <div className="preloader"></div>
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artistas..."
                className="favorites-input"
                disabled={isSearching}
              />
              <button
                type="submit"
                className="favorites-save"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="button-preloader"></div>
                ) : (
                  "Buscar"
                )}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="artist-select-container">
                <select
                  onChange={handleArtistSelect}
                  className="artist-select"
                  value=""
                  disabled={isSaving}
                >
                  <option value="">Selecione um artista</option>
                  {searchResults.map((artist) => (
                    <option
                      key={artist.id}
                      value={artist.id}
                      disabled={selectedArtists.find((a) => a.id === artist.id)}
                    >
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedArtists.length > 0 && (
              <div className="selected-artists">
                <h3>Artistas Selecionados</h3>
                <div className="selected-artists-grid">
                  {selectedArtists.map((artist) => (
                    <div key={artist.id} className="selected-artist-card">
                      <img
                        src={
                          artist.images && artist.images.length > 0
                            ? artist.images[0].url
                            : "default-artist-image.png"
                        }
                        alt={artist.name}
                        className="selected-artist-image"
                      />
                      <div className="selected-artist-info">
                        <h4>{artist.name}</h4>
                        <button
                          onClick={() => removeArtist(artist.id)}
                          className="remove-artist-button"
                          disabled={isSaving}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              className="favorites-save"
              disabled={selectedArtists.length === 0 || isSaving}
            >
              {isSaving ? (
                <div className="button-preloader"></div>
              ) : (
                "Salvar Favoritos"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
