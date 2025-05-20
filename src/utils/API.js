const BASE_URL = "https://api.spotify.com/v1";

// Função para obter o token de acesso (você pode adaptar para seu fluxo de autenticação)
function getAccessToken() {
  // Exemplo: buscar do localStorage
  return localStorage.getItem("spotify_access_token");
}

export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar dados da API");
  return await res.json();
}

export async function apiPost(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Erro ao enviar dados para a API");
  return await res.json();
}
