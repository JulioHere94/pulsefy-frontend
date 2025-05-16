import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getTokenFromUrl,
  checkTokenValidity,
  getAccessToken,
  refreshAccessToken,
} from "../utils/spotify.config";

const SpotifyContext = createContext();

export const useSpotify = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }) => {
  const [spotifyToken, setSpotifyToken] = useState(() => {
    const token = sessionStorage.getItem("spotify_token");
    console.log("Token inicial carregado:", token ? "Presente" : "Ausente");
    return token || null;
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    const token = sessionStorage.getItem("spotify_refresh_token");
    console.log(
      "Refresh token inicial carregado:",
      token ? "Presente" : "Ausente"
    );
    return token || null;
  });
  const [tokenExpiry, setTokenExpiry] = useState(() => {
    const expiry = sessionStorage.getItem("spotify_token_expiry");
    console.log(
      "Expiração inicial:",
      expiry ? new Date(parseInt(expiry)).toLocaleString() : "Ausente"
    );
    return expiry || null;
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para salvar os tokens na sessão
  const saveTokens = (accessToken, refreshToken, expiresIn) => {
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    console.log("Salvando tokens na sessão:");
    console.log("- Access Token:", accessToken ? "Presente" : "Ausente");
    console.log("- Refresh Token:", refreshToken ? "Presente" : "Ausente");
    console.log("- Expira em:", new Date(expiryTime).toLocaleString());

    sessionStorage.setItem("spotify_token", accessToken);
    sessionStorage.setItem("spotify_refresh_token", refreshToken);
    sessionStorage.setItem("spotify_token_expiry", expiryTime.toString());
    setSpotifyToken(accessToken);
    setRefreshToken(refreshToken);
    setTokenExpiry(expiryTime);
  };

  // Função para limpar os tokens
  const clearTokens = () => {
    console.log("Limpando tokens da sessão");
    sessionStorage.removeItem("spotify_token");
    sessionStorage.removeItem("spotify_refresh_token");
    sessionStorage.removeItem("spotify_token_expiry");
    setSpotifyToken(null);
    setRefreshToken(null);
    setTokenExpiry(null);
    setUser(null);
  };

  // Efeito para verificar e atualizar o token quando necessário
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!spotifyToken || !refreshToken) return;

      const now = new Date().getTime();
      const expiryTime = parseInt(tokenExpiry);
      console.log("Verificando expiração do token:");
      console.log("- Agora:", new Date(now).toLocaleString());
      console.log("- Expira em:", new Date(expiryTime).toLocaleString());

      // Se o token estiver próximo de expirar (menos de 5 minutos)
      if (now >= expiryTime - 300000) {
        console.log("Token próximo de expirar, atualizando...");
        try {
          const data = await refreshAccessToken(refreshToken);
          console.log("Token atualizado com sucesso");
          saveTokens(
            data.access_token,
            data.refresh_token || refreshToken,
            data.expires_in
          );
        } catch (error) {
          console.error("Erro ao atualizar token:", error);
          clearTokens();
        }
      }
    };

    const interval = setInterval(checkAndRefreshToken, 60000); // Verifica a cada minuto
    return () => clearInterval(interval);
  }, [spotifyToken, refreshToken, tokenExpiry]);

  // Efeito para verificar o token e buscar dados do usuário
  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      try {
        if (spotifyToken) {
          console.log("Verificando validade do token...");
          const isValid = await checkTokenValidity(spotifyToken);
          console.log("Token válido:", isValid);

          if (!isValid) {
            console.log("Token inválido, limpando...");
            clearTokens();
          } else {
            console.log("Buscando dados do usuário...");
            const response = await fetch("https://api.spotify.com/v1/me", {
              headers: {
                Authorization: `Bearer ${spotifyToken}`,
              },
            });
            if (response.ok) {
              const userData = await response.json();
              console.log("Dados do usuário obtidos:", userData.display_name);
              setUser(userData);
            } else {
              throw new Error("Falha ao buscar dados do usuário");
            }
          }
        }
      } catch (error) {
        console.error("Erro na verificação do token:", error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    verifyTokenAndFetchUser();
  }, [spotifyToken]);

  // Efeito para processar mensagens do popup
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data.type === "SPOTIFY_AUTH_SUCCESS") {
        console.log("Recebendo tokens do popup");
        const { access_token, refresh_token, expires_in } = event.data;
        if (access_token && refresh_token && expires_in) {
          saveTokens(access_token, refresh_token, expires_in);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const logout = () => {
    console.log("Logout iniciado");
    clearTokens();
    console.log("Logout concluído");
  };

  const value = {
    spotifyToken,
    user,
    isLoading,
    logout,
  };

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};
