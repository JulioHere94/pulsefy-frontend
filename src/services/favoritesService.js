const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export const favoritesService = {
  // Salvar artistas favoritos
  saveFavoriteArtists: async (artists) => {
    try {
      // Salvar no localStorage por enquanto
      localStorage.setItem("favoriteArtists", JSON.stringify(artists));
      return { success: true, artists };
    } catch (error) {
      console.error("Error saving favorite artists:", error);
      throw error;
    }
  },

  // Buscar artistas favoritos
  getFavoriteArtists: async () => {
    try {
      // Buscar do localStorage por enquanto
      const favorites = localStorage.getItem("favoriteArtists");
      return favorites ? { artists: JSON.parse(favorites) } : { artists: [] };
    } catch (error) {
      console.error("Error fetching favorite artists:", error);
      throw error;
    }
  },
};
