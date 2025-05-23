import React, { useState, useEffect, useCallback } from "react";
import spotifyService from "../../../services/spotifyService";
import { useSpotify } from "../../../context/SpotifyContext";
import "../../../blocks/playlist.css";

const Playlist = ({ closeModal }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { spotifyToken } = useSpotify();

  const loadPlaylists = useCallback(async () => {
    try {
      console.log(
        "Iniciando carregamento de playlists com token:",
        spotifyToken?.substring(0, 10) + "..."
      );
      setIsLoading(true);
      setError(null);

      const userPlaylists = await spotifyService.getUserPlaylists(spotifyToken);
      console.log("Resposta completa das playlists:", userPlaylists);

      if (!userPlaylists || userPlaylists.length === 0) {
        setError(
          "Nenhuma playlist encontrada. Crie uma playlist no Spotify e tente novamente."
        );
      } else {
        setPlaylists(userPlaylists);
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      console.error("Resposta do erro:", error.response?.data);
      if (error.response?.status === 401) {
        setError("Sua sessão expirou. Por favor, faça login novamente.");
      } else {
        setError(`Erro ao carregar playlists: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [spotifyToken]);

  useEffect(() => {
    console.log(
      "Token no componente Playlist:",
      spotifyToken?.substring(0, 10) + "..."
    );
    if (spotifyToken) {
      loadPlaylists();
    } else {
      setError(
        "Token do Spotify não encontrado. Por favor, faça login novamente."
      );
      setIsLoading(false);
    }
  }, [spotifyToken, loadPlaylists]);

  const handlePlaylistSelect = async (playlist) => {
    try {
      console.log("Loading tracks for playlist:", playlist.name);
      setIsLoading(true);
      setError(null);
      setSelectedPlaylist(playlist);

      const playlistTracks = await spotifyService.getPlaylistTracks(
        spotifyToken,
        playlist.id
      );
      console.log("Tracks loaded:", playlistTracks.length);
      setTracks(playlistTracks);
    } catch (error) {
      console.error("Error in handlePlaylistSelect:", error);
      setError("Erro ao carregar músicas da playlist. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaylistImage = (playlist) => {
    if (playlist?.images && playlist.images.length > 0) {
      return playlist.images[0].url;
    }
    return "default-playlist.png";
  };

  const getTrackImage = (track) => {
    if (track?.album?.images && track.album.images.length > 0) {
      return track.album.images[0].url;
    }
    return "default-track.png";
  };

  return (
    <div className="playlist-modal">
      <div className="playlist-modal-content">
        <button className="playlist-close" onClick={closeModal}>
          ×
        </button>
        <div className="playlist-header">
          <h2>Suas Playlists</h2>
          <button
            className="refresh-button"
            onClick={loadPlaylists}
            disabled={isLoading}
          >
            {isLoading ? "Atualizando..." : "Atualizar Lista"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando...</p>
          </div>
        ) : (
          <div className="playlist-container">
            <div className="playlist-list">
              {playlists.length === 0 ? (
                <div className="no-playlists-message">
                  Nenhuma playlist encontrada. Crie uma playlist no Spotify e
                  tente novamente.
                </div>
              ) : (
                playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={`playlist-item ${
                      selectedPlaylist?.id === playlist.id ? "selected" : ""
                    }`}
                    onClick={() => handlePlaylistSelect(playlist)}
                  >
                    <img
                      src={getPlaylistImage(playlist)}
                      alt={playlist.name || "Playlist"}
                      className="playlist-cover"
                    />
                    <div className="playlist-info">
                      <h3>{playlist.name || "Playlist sem nome"}</h3>
                      <p>{playlist.tracks?.total || 0} músicas</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedPlaylist && (
              <div className="playlist-tracks">
                <h3>
                  Músicas em {selectedPlaylist.name || "Playlist sem nome"}
                </h3>
                <div className="tracks-list">
                  {tracks.length === 0 ? (
                    <div className="no-tracks-message">
                      Nenhuma música encontrada nesta playlist.
                    </div>
                  ) : (
                    tracks.map((track) => (
                      <div key={track.id} className="track-item">
                        <img
                          src={getTrackImage(track)}
                          alt={track.name || "Música"}
                          className="track-cover"
                        />
                        <div className="track-info">
                          <h4>{track.name || "Música sem nome"}</h4>
                          <p>
                            {track.artists
                              ?.map((artist) => artist.name)
                              .join(", ") || "Artista desconhecido"}
                          </p>
                        </div>
                        <a
                          href={track.external_urls?.spotify || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="track-link"
                        >
                          Ouvir no Spotify
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
