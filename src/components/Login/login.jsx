import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../blocks/login.css";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../images/Logo_pulsefy.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && pass) {
      login();
      navigate("/");
    } else {
      alert("Preencha e-mail e senha!");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <img src={Logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Bem-vindo ao Pulsefy</h2>
        <p className="login-text">Faça login para acessar o sistema</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            placeholder="E-mail"
          />
          <input
            id="pass"
            type="password"
            value={pass}
            autoComplete="current-password"
            onChange={(e) => setPass(e.target.value)}
            className="login-input"
            placeholder="Senha"
          />
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
        <p className="signup-link">
          Não tem cadastro? <a href="/signup">Se inscreva aqui</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
