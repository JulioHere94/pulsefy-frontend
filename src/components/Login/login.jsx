import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../blocks/login.css";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../images/Logo_pulsefy.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) {
      setError("Preencha e-mail e senha!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login({ email, senha: pass });
      navigate("/");
    } catch (error) {
      setError(error.msg || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <img src={Logo} alt="Logo" className="login-logo" />
          <h2 className="login-title">Bem-vindo ao Pulsefy</h2>
          <p className="login-text">Faça login para acessar o sistema</p>
          {error && <p className="error-message">{error}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="E-mail"
              disabled={loading}
            />
            <input
              id="pass"
              type="password"
              value={pass}
              autoComplete="current-password"
              onChange={(e) => setPass(e.target.value)}
              className="login-input"
              placeholder="Senha"
              disabled={loading}
            />
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="signup-link">
            Não tem cadastro? <a href="/signup">Se inscreva aqui</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
