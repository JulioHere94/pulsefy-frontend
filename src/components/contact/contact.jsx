import React, { useState } from "react";
import "../../blocks/contact.css";
import Header from "../Header/header";
import Footer from "../Footer/footer";

const Contact = () => {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = () => {
    // Formsubmit will handle the submission
    setEnviado(true);
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
        <form
          className="contact-form"
          action="https://formsubmit.co/julioh.vivancos@gmail.com"
          method="POST"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="_next" value={window.location.href} />
          <input
            type="text"
            name="name"
            className="contact-input"
            placeholder="Seu nome"
            required
          />
          <input
            type="email"
            name="email"
            className="contact-input"
            placeholder="Seu e-mail"
            required
          />
          <textarea
            name="message"
            className="contact-textarea"
            placeholder="Sua mensagem"
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
