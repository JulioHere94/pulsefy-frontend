const authEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const redirectUri = "http://127.0.0.1:3000/callback";
const clientId = "8031e210cee64361a80e762e1886b2a1";
const clientSecret = "206408a431394a52a93388d47c9a8216";

// Definindo os escopos que precisamos
const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "streaming",
  "user-read-email",
  "user-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-follow-modify",
  "user-follow-read",
  "user-library-read",
];

// Construindo a URL de autorização
export const loginUrl =
  `${authEndpoint}` +
  `?client_id=${encodeURIComponent(clientId)}` +
  `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  `&scope=${encodeURIComponent(scopes.join(" "))}` +
  `&response_type=code` +
  `&show_dialog=true`;

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

// Função para obter o token de acesso usando o código de autorização
export const getAccessToken = async (code) => {
  try {
    console.log("Iniciando troca do código por tokens...");
    console.log("Código recebido:", code);
    console.log("Redirect URI:", redirectUri);

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta do Spotify:", errorData);
      throw new Error(
        `Failed to get access token: ${
          errorData.error_description || errorData.error
        }`
      );
    }

    const data = await response.json();
    console.log("Resposta do Spotify:", {
      access_token: data.access_token ? "Presente" : "Ausente",
      refresh_token: data.refresh_token ? "Presente" : "Ausente",
      expires_in: data.expires_in,
    });
    return data;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

// Função para atualizar o token de acesso
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta do Spotify:", errorData);
      throw new Error(
        `Failed to refresh token: ${
          errorData.error_description || errorData.error
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Função para verificar se o token é válido
export const checkTokenValidity = async (token) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};
