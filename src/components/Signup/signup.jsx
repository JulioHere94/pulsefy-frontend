import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../blocks/signup.css";
import Logo from "../../images/Logo_pulsefy.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !pass || !confirmPass || !name) {
      alert("Preencha todos os campos!");
      return;
    }
    if (pass !== confirmPass) {
      alert("As senhas não coincidem!");
      return;
    }
    // Aqui você pode adicionar a lógica de cadastro (API, etc)
    alert("Cadastro realizado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <img src={Logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Criar Conta no Pulsefy</h2>
        <p className="login-text">Preencha os dados para se inscrever</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
            placeholder="Nome"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            placeholder="E-mail"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="login-input"
            placeholder="Senha"
          />
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="login-input"
            placeholder="Confirme a senha"
          />
          <button type="submit" className="login-button">
            Criar Conta
          </button>
        </form>
        <p className="signup-link">
          Já tem conta?{" "}
          <a href="#" onClick={() => navigate("/login")}>
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
