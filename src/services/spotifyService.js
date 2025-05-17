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
};
