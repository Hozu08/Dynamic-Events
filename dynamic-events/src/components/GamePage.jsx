import { useState } from "react";
import { MinigameTest } from "./MinigameTest";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
import "../styles/ChristmasLanding.css";
import "../styles/GamePage.css";
import "../styles/base/utilities.css";

/**
 * GamePage - Página completa para el minijuego
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Callback para volver a la landing
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 */
export function GamePage({ onBack, onNavigateToChat }) {
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('christmasGameHighScore')) || 0
  );
  const [gamesPlayed, setGamesPlayed] = useState(
    parseInt(localStorage.getItem('christmasGamesPlayed')) || 0
  );

  // Manejar game over y actualizar estadísticas
  const handleGameOver = (stats) => {
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem('christmasGamesPlayed', newGamesPlayed);

    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem('christmasGameHighScore', stats.score);
    }
  };

  // Manejar cambios de score
  const handleScoreChange = (score) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="christmas-landing">
      {/* HEADER */}
      <Header
        logo="Dynamic Events"
        className="christmas-header"
        sticky
        variant="light"
        onLogoClick={onBack}
      >
        <Button variant="pill" size="md" onClick={onBack}>Temporadas</Button>
        <Button variant="pill" size="md" onClick={onNavigateToChat}>Historias IA</Button>
        <Button variant="pill" size="md" className="nav-pill--active">Minijuegos</Button>
      </Header>

      {/* HERO */}
      <section className="christmas-hero hero hero--gradient-sky">
        <div className="hero-illustration" style={{ backgroundImage: "url('/images/hero-background.png')" }}></div>
        <div className="hero__content">
          <h1 className="hero__title hero__title--light">
            🎄 Atrapa los Regalos Navideños 🎁
          </h1>
          <p className="hero__subtitle hero__subtitle--light" style={{ fontSize: "1.3rem", maxWidth: "800px", margin: "0 auto" }}>
            ¡Ayuda a Santa a atrapar todos los regalos que caen del cielo! 
            Mueve el trineo con el mouse y no dejes que ningún regalo toque el suelo.
          </p>
        </div>
      </section>

      {/* ÁREA DEL JUEGO */}
      <section className="landing-section landing-section--padding">
        <div className="game-page__game-wrapper">
          <MinigameTest 
            onGameOver={handleGameOver}
            onScoreChange={handleScoreChange}
          />
        </div>

        {/* ESTADÍSTICAS */}
        <div className="game-page__stats">
          <div className="game-stat">
            <div className="game-stat__label">Récord</div>
            <div className="game-stat__value">🏆 {highScore}</div>
          </div>
          <div className="game-stat">
            <div className="game-stat__label">Partidas</div>
            <div className="game-stat__value">🎮 {gamesPlayed}</div>
          </div>
        </div>

        {/* INSTRUCCIONES */}
        <div className="game-page__instructions">
          <h3>📖 Cómo Jugar</h3>
          <ul>
            <li>Mueve el trineo con el <strong>mouse</strong> de izquierda a derecha</li>
            <li>Atrapa los <strong>regalos</strong> que caen para ganar puntos</li>
            <li>Si un regalo toca el suelo, pierdes una <strong>vida</strong> ❤️</li>
            <li>Cada 10 regalos atrapados, el <strong>nivel</strong> sube y los regalos caen más rápido</li>
            <li>El juego termina cuando te quedas sin vidas</li>
            <li>¡Intenta superar tu récord personal!</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="christmas-footer u-flex u-flex-center u-gap-lg">
        <Button variant="ghost" size="md" className="footer-button">Instrucciones</Button>
        <Button variant="ghost" size="md" className="footer-button">Políticas</Button>
        <Button variant="ghost" size="md" className="footer-button">Conócenos</Button>
      </footer>
    </div>
  );
}