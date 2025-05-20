import React, { createContext, useContext, useState, useEffect } from "react";
import {
  checkTokenValidity,
  refreshAccessToken,
} from "../utils/spotify.config";

const SpotifyContext = createContext();

export const useSpotify = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }) => {
  const [spotifyToken, setSpotifyToken] = useState(() => {
    const token = sessionStorage.getItem("spotify_token");
    return token || null;
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    const token = sessionStorage.getItem("spotify_refresh_token");
    return token || null;
  });
  const [tokenExpiry, setTokenExpiry] = useState(() => {
    const expiry = sessionStorage.getItem("spotify_token_expiry");
    return expiry || null;
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para salvar os tokens na sessão
  const saveTokens = (accessToken, refreshToken, expiresIn) => {
    const expiryTime = new Date().getTime() + expiresIn * 1000;

    sessionStorage.setItem("spotify_token", accessToken);
    sessionStorage.setItem("spotify_refresh_token", refreshToken);
    sessionStorage.setItem("spotify_token_expiry", expiryTime.toString());
    setSpotifyToken(accessToken);
    setRefreshToken(refreshToken);
    setTokenExpiry(expiryTime);
  };

  // Função para limpar os tokens
  const clearTokens = () => {
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

      // Se o token estiver próximo de expirar (menos de 5 minutos)
      if (now >= expiryTime - 300000) {
        try {
          const data = await refreshAccessToken(refreshToken);
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
          const isValid = await checkTokenValidity(spotifyToken);

          if (!isValid) {
            clearTokens();
          } else {
            const response = await fetch("https://api.spotify.com/v1/me", {
              headers: {
                Authorization: `Bearer ${spotifyToken}`,
              },
            });
            if (response.ok) {
              const userData = await response.json();
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
    clearTokens();
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
