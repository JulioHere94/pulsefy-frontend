import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../blocks/signup.css";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../images/Logo_pulsefy.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass || !confirmPass || !name) {
      setError("Preencha todos os campos!");
      return;
    }
    if (pass !== confirmPass) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register({ nome: name, email, senha: pass });
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      setError(error.msg || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <img src={Logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Criar Conta no Pulsefy</h2>
        <p className="login-text">Preencha os dados para se inscrever</p>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
            placeholder="Nome"
            disabled={loading}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            placeholder="E-mail"
            disabled={loading}
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="login-input"
            placeholder="Senha"
            disabled={loading}
          />
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="login-input"
            placeholder="Confirme a senha"
            disabled={loading}
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
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
