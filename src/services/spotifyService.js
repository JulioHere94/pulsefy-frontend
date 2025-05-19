import axios from "axios";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

const spotifyService = {
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

      const promises = chunks.map((chunk) =>
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

  // Get user's playlists
  getUserPlaylists: async (accessToken) => {
    try {

      let allPlaylists = [];
      let nextUrl = `${SPOTIFY_API_BASE_URL}/me/playlists?limit=50`;

      while (nextUrl) {
        const response = await axios.get(nextUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });


        if (response.data.items) {
          allPlaylists = [...allPlaylists, ...response.data.items];
        }
        nextUrl = response.data.next;
      }

      // Sort playlists by creation date (newest first)
      const sortedPlaylists = allPlaylists.sort((a, b) => {
        const dateA = new Date(a.created_at || a.added_at);
        const dateB = new Date(b.created_at || b.added_at);
        return dateB - dateA;
      });

      return sortedPlaylists;
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Dados do erro:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
      });
      throw error;
    }
  },

  // Get playlist tracks
  getPlaylistTracks: async (accessToken, playlistId) => {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 100,
          },
        }
      );
      return response.data.items.map((item) => item.track);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      throw error;
    }
  },
};

export default spotifyService;
