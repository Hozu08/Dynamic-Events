import { useState } from "react";
import { MinigameTest } from "./MinigameTest";
import "../styles/GamePage.css";

/**
 * GamePage - Página completa para el minijuego
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Callback para volver a la landing
 */
export function GamePage({ onBack }) {
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
    // Actualizar high score en tiempo real si es necesario
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="game-page">
      {/* HEADER */}
      <header className="game-page__header">
        <div className="game-page__logo">Dynamic Events</div>
        <button className="game-page__back-button" onClick={onBack}>
          ← Volver al inicio
        </button>
      </header>

      {/* HERO */}
      <section className="game-page__hero">
        <h1 className="game-page__hero-title">
          🎄 Atrapa los Regalos Navideños 🎁
        </h1>
        <p className="game-page__hero-description">
          ¡Ayuda a Santa a atrapar todos los regalos que caen del cielo! 
          Mueve el trineo con el mouse y no dejes que ningún regalo toque el suelo.
        </p>
      </section>

      {/* ÁREA DEL JUEGO */}
      <section className="game-page__content">
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
    </div>
  );
}