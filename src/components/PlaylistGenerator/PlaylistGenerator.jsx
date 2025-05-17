import React, { useState } from "react";
import { lastFmService } from "../../services/lastFmService";
import { favoritesService } from "../../services/favoritesService";
import { spotifyService } from "../../services/spotifyService";
import { useSpotify } from "../../context/SpotifyContext";
import "../../blocks/playlist-generator.css";

const PlaylistGenerator = ({ closeModal }) => {
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const { spotifyToken } = useSpotify();

  const moods = [
    { value: "happy", label: "Feliz" },
    { value: "sad", label: "Triste" },
    { value: "energetic", label: "Energético" },
    { value: "relaxed", label: "Relaxado" },
    { value: "romantic", label: "Romântico" },
  ];

  const handleGeneratePlaylist = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get favorite artists
      const favorites = await favoritesService.getFavoriteArtists();
      const favoriteArtists = favorites?.artists || [];

      // Generate playlist using Last.fm API
      const tracks = await lastFmService.getRecommendedTracks(
        mood,
        favoriteArtists
      );
      setPlaylist(tracks);

      // Set default playlist name
      const moodLabel = moods.find((m) => m.value === mood)?.label || mood;
      setPlaylistName(
        `Playlist ${moodLabel} - ${new Date().toLocaleDateString()}`
      );
    } catch (error) {
      console.error("Error generating playlist:", error);
      setError("Erro ao gerar playlist. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToSpotify = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Get current user
      const user = await spotifyService.getCurrentUser(spotifyToken);

      // Create playlist
      const newPlaylist = await spotifyService.createPlaylist(
        spotifyToken,
        user.id,
        playlistName,
        `Playlist gerada automaticamente baseada no humor: ${mood}`
      );

      // Search for tracks on Spotify and get their URIs
      const trackUris = [];
      for (const track of playlist) {
        const uri = await spotifyService.searchTrack(
          spotifyToken,
          track.name,
          track.artist
        );
        if (uri) {
          trackUris.push(uri);
        }
      }

      // Add tracks to playlist
      if (trackUris.length > 0) {
        await spotifyService.addTracksToPlaylist(
          spotifyToken,
          newPlaylist.id,
          trackUris
        );
        alert("Playlist salva com sucesso no Spotify!");
        closeModal();
      } else {
        setError("Não foi possível encontrar as músicas no Spotify.");
      }
    } catch (error) {
      console.error("Error saving playlist to Spotify:", error);
      setError("Erro ao salvar playlist no Spotify. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="playlist-generator-modal">
      <div className="playlist-generator-content">
        <button className="playlist-generator-close" onClick={closeModal}>
          ×
        </button>
        <h2>Gerar Playlist</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="playlist-generator-form">
          <div className="form-group">
            <label htmlFor="mood">Como você está se sentindo?</label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="playlist-generator-select"
              disabled={isGenerating || isSaving}
            >
              <option value="">Selecione seu humor</option>
              {moods.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGeneratePlaylist}
            className="playlist-generator-button"
            disabled={!mood || isGenerating || isSaving}
          >
            {isGenerating ? (
              <div className="button-preloader"></div>
            ) : (
              "Gerar Playlist"
            )}
          </button>
        </div>

        {playlist.length > 0 && (
          <div className="playlist-results">
            <div className="playlist-header">
              <h3>Sua Playlist</h3>
              <div className="playlist-save-form">
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Nome da playlist"
                  className="playlist-name-input"
                  disabled={isSaving}
                />
                <button
                  onClick={handleSaveToSpotify}
                  className="playlist-save-button"
                  disabled={!playlistName || isSaving}
                >
                  {isSaving ? (
                    <div className="button-preloader"></div>
                  ) : (
                    "Salvar no Spotify"
                  )}
                </button>
              </div>
            </div>
            <div className="playlist-tracks">
              {playlist.map((track, index) => (
                <div key={index} className="track-card">
                  <img
                    src={track.image || "default-track-image.png"}
                    alt={track.name}
                    className="track-image"
                  />
                  <div className="track-info">
                    <h4>{track.name}</h4>
                    <p>{track.artist}</p>
                    <a
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="track-link"
                    >
                      Ouvir no Last.fm
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistGenerator;
