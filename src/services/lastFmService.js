import axios from "axios";

const LASTFM_API_KEY = "9692958c9dde56c682a0d78d3bcb8d3a";
const LASTFM_API_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

// Mood to genre mapping
const moodToGenre = {
  happy: ["pop", "dance", "disco", "funk"],
  sad: ["blues", "soul", "indie", "folk"],
  energetic: ["rock", "metal", "electronic", "dance"],
  relaxed: ["jazz", "ambient", "classical", "lounge"],
  romantic: ["r&b", "soul", "pop", "ballad"],
};

export const lastFmService = {
  // Get similar artists based on a seed artist
  getSimilarArtists: async (artistName) => {
    try {
      const response = await axios.get(LASTFM_API_BASE_URL, {
        params: {
          method: "artist.getSimilar",
          artist: artistName,
          api_key: LASTFM_API_KEY,
          format: "json",
          limit: 10,
        },
      });
      return response.data.similarartists.artist;
    } catch (error) {
      console.error("Error fetching similar artists:", error);
      throw error;
    }
  },

  // Get top tracks by genre
  getTopTracksByGenre: async (genre) => {
    try {
      const response = await axios.get(LASTFM_API_BASE_URL, {
        params: {
          method: "tag.getTopTracks",
          tag: genre,
          api_key: LASTFM_API_KEY,
          format: "json",
          limit: 20,
        },
      });
      return response.data.tracks.track;
    } catch (error) {
      console.error("Error fetching top tracks by genre:", error);
      throw error;
    }
  },

  // Get recommended tracks based on mood and favorite artists
  getRecommendedTracks: async (mood, favoriteArtists = []) => {
    try {
      const genres = moodToGenre[mood] || ["pop"];
      let recommendedTracks = [];

      // If we have favorite artists, get similar artists first
      if (favoriteArtists.length > 0) {
        const similarArtistsPromises = favoriteArtists.map((artist) =>
          lastFmService.getSimilarArtists(artist.name)
        );
        const similarArtistsResults = await Promise.all(similarArtistsPromises);
        const similarArtists = similarArtistsResults.flat();

        // Get tracks from similar artists
        for (const artist of similarArtists) {
          const response = await axios.get(LASTFM_API_BASE_URL, {
            params: {
              method: "artist.getTopTracks",
              artist: artist.name,
              api_key: LASTFM_API_KEY,
              format: "json",
              limit: 5,
            },
          });
          recommendedTracks = [
            ...recommendedTracks,
            ...response.data.toptracks.track,
          ];
        }
      }

      // If we don't have enough tracks, get more from the mood's genres
      if (recommendedTracks.length < 20) {
        const genrePromises = genres.map((genre) =>
          lastFmService.getTopTracksByGenre(genre)
        );
        const genreResults = await Promise.all(genrePromises);
        const genreTracks = genreResults.flat();
        recommendedTracks = [...recommendedTracks, ...genreTracks];
      }

      // Shuffle and limit to 20 tracks
      return recommendedTracks
        .sort(() => Math.random() - 0.5)
        .slice(0, 20)
        .map((track) => ({
          name: track.name,
          artist: track.artist.name || track.artist,
          image: track.image?.[2]?.["#text"] || "",
          url: track.url,
        }));
    } catch (error) {
      console.error("Error getting recommended tracks:", error);
      throw error;
    }
  },
};
