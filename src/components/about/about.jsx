import React from "react";
import "../../blocks/about.css";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import LogoPulsefy from "../../images/Logo_pulsefy.png";
import LogoTripleten from "../../images/logo_tripleten.svg"; // ajuste o nome se necessário

const About = () => (
  <>
    <Header />
    <main className="about-container">
      <h1 className="about-title">Sobre o Pulsefy</h1>
      <div className="about-logos">
        <img src={LogoPulsefy} alt="Logo Pulsefy" className="about-logo" />
        <img src={LogoTripleten} alt="Logo TripleTen" className="about-logo" />
      </div>
      <section className="about-content">
        <p>
          O <strong>Pulsefy</strong> é um projeto de conclusão do bootcamp da{" "}
          <strong>TripleTen</strong>. Ele foi desenvolvido para demonstrar
          habilidades em React, autenticação, rotas protegidas e design moderno
          inspirado no Spotify.
        </p>
        <p>
          Com o Pulsefy, você pode gerar playlists personalizadas de acordo com
          seu humor e preferências musicais, editar seu perfil e gerenciar suas
          playlists de forma simples e intuitiva.
        </p>
        <p>
          Projeto desenvolvido por <strong>Julio Cesar Heredia</strong> como
          parte do desafio final do bootcamp.
        </p>
      </section>
    </main>
    <Footer />
  </>
);

export default About;
