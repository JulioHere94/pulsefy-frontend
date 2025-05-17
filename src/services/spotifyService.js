import axios from "axios";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export const spotifyService = {
  // Get user's top artists
  getTopArtists: async (accessToken) => {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE_URL}/me/top/artists`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 20,
            time_range: "medium_term",
          },
        }
      );
      return response.data.items;
    } catch (error) {
      console.error("Error fetching top artists:", error);
      throw error;
    }
  },

  // Search for artists
  searchArtists: async (accessToken, query) => {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: "artist",
          limit: 10,
        },
      });
      return response.data.artists.items;
    } catch (error) {
      console.error("Error searching artists:", error);
      throw error;
    }
  },

  // Get current user's profile
  getCurrentUser: async (accessToken) => {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Create a new playlist
  createPlaylist: async (accessToken, userId, name, description) => {
    try {
      const response = await axios.post(
        `${SPOTIFY_API_BASE_URL}/users/${userId}/playlists`,
        {
          name,
          description,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  },

  // Search for a track on Spotify
  searchTrack: async (accessToken, trackName, artistName) => {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `track:${trackName} artist:${artistName}`,
          type: "track",
          limit: 1,
        },
      });
      return response.data.tracks.items[0]?.uri;
    } catch (error) {
      console.error("Error searching track:", error);
      return null;
    }
  },

  // Add tracks to a playlist
  addTracksToPlaylist: async (accessToken, playlistId, trackUris) => {
    try {
      // Spotify API has a limit of 100 tracks per request
      const chunks = [];
      for (let i = 0; i < trackUris.length; i += 100) {
        chunks.push(trackUris.slice(i, i + 100));
      }

      const promises = chunks.map(chunk =>
        axios.post(
          `${SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks`,
          {
            uris: chunk,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error("Error adding tracks to playlist:", error);
      throw error;
    }
  },
};
