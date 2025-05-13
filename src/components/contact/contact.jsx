import React, { useState } from "react";
import "../../blocks/contact.css";
import Header from "../Header/header";
import Footer from "../Footer/footer";

const Contact = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode integrar com um backend ou serviço de e-mail
    setEnviado(true);
    setNome("");
    setEmail("");
    setMensagem("");
  };

  return (
    <>
      <Header />
      <main className="contact-container">
        <h1 className="contact-title">Contato</h1>
        <p className="contact-text">
          Tem alguma dúvida, sugestão ou feedback? Preencha o formulário abaixo
          e entrarei em contato!
        </p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="contact-input"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            className="contact-input"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="contact-textarea"
            placeholder="Sua mensagem"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            required
            rows={5}
          />
          <button type="submit" className="contact-button">
            Enviar
          </button>
        </form>
        {enviado && (
          <p className="contact-success">
            Mensagem enviada com sucesso! Obrigado pelo contato.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Contact;
