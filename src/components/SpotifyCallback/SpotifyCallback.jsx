import React, { useEffect } from "react";
import { useSpotify } from "../../context/SpotifyContext";
import { getAccessToken } from "../../utils/spotify.config";

const SpotifyCallback = () => {
  const { spotifyToken } = useSpotify();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      if (error) {
        console.error("Erro na autenticação:", error);
        if (window.opener) {
          window.opener.postMessage({ type: "SPOTIFY_AUTH_ERROR", error }, "*");
        }
        return;
      }

      if (code) {
        try {
          const data = await getAccessToken(code);
          

          // Notifica a janela principal sobre o sucesso
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "SPOTIFY_AUTH_SUCCESS",
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                expires_in: data.expires_in,
              },
              "*"
            );
          } else {
            console.error("Janela principal não encontrada");
          }

          // Aguarda um momento para garantir que a mensagem foi enviada
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Tenta fechar a janela
          if (window.close) {
            window.close();
          } else {
            // Fallback se window.close() não funcionar
            window.location.href = "about:blank";
            window.top.close();
          }
        } catch (error) {
          console.error("Erro ao obter tokens:", error);
          if (window.opener) {
            window.opener.postMessage(
              { type: "SPOTIFY_AUTH_ERROR", error: error.message },
              "*"
            );
          }
        }
      } else {
        console.error("Nenhum código de autorização recebido");
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "SPOTIFY_AUTH_ERROR",
              error: "Nenhum código de autorização recebido",
            },
            "*"
          );
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="spotify-callback-container">
      <div className="spotify-callback-content">
        <h2>Processando autenticação...</h2>
        <p>Esta janela será fechada automaticamente...</p>
        <button
          onClick={() => window.close()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1db954",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Fechar janela
        </button>
      </div>
    </div>
  );
};

export default SpotifyCallback;
