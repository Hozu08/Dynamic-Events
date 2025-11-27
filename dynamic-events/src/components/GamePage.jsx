import { useState } from "react";
import { MinigameTest } from "./MinigameTest";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
import { Modal } from "./base/Modal";
import { ScrollToTop } from "./base/ScrollToTop";
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
  const [showFooterModal, setShowFooterModal] = useState(null);

  const openFooterModal = (modalType) => {
    setShowFooterModal(modalType);
  };

  const closeFooterModal = () => {
    setShowFooterModal(null);
  };

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
        <Button 
          variant="ghost" 
          size="md" 
          className="footer-button"
          onClick={() => openFooterModal('instructions')}
        >
          Instrucciones
        </Button>
        <Button 
          variant="ghost" 
          size="md" 
          className="footer-button"
          onClick={() => openFooterModal('policies')}
        >
          Políticas
        </Button>
        <Button 
          variant="ghost" 
          size="md" 
          className="footer-button"
          onClick={() => openFooterModal('about')}
        >
          Conócenos
        </Button>
      </footer>

      {/* MODALES DEL FOOTER */}
      <Modal
        isOpen={showFooterModal === 'instructions'}
        onClose={closeFooterModal}
        size="md"
        className="modal--white"
      >
        <div className="footer-modal">
          <div className="footer-modal__header u-text-center">
            <h2 className="footer-modal__title u-text-primary">📖 Instrucciones</h2>
          </div>
          <div className="footer-modal__content u-text-dark">
            <h3>¿Cómo usar Dynamic Events?</h3>
            <p>
              <strong>1. Historias con IA:</strong> Navega a la sección "Historias IA" y crea tu propia historia navideña 
              interactuando con Santa Claus. Puedes elegir un tema predefinido o crear uno completamente original.
            </p>
            <p>
              <strong>2. Minijuegos:</strong> Accede a la sección "Minijuegos" para disfrutar de juegos temáticos navideños. 
              ¡Intenta superar tu récord personal!
            </p>
            <p>
              <strong>3. Navegación:</strong> Usa los botones del header para moverte entre las diferentes secciones. 
              El logo "Dynamic Events" siempre te llevará de vuelta a la página principal.
            </p>
            <p>
              <strong>4. Temas:</strong> Explora los diferentes temas de historias disponibles en el carrusel de la página principal.
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showFooterModal === 'policies'}
        onClose={closeFooterModal}
        size="md"
        className="modal--white"
      >
        <div className="footer-modal">
          <div className="footer-modal__header u-text-center">
            <h2 className="footer-modal__title u-text-primary">📋 Políticas</h2>
          </div>
          <div className="footer-modal__content u-text-dark">
            <h3>Política de Privacidad</h3>
            <p>
              Dynamic Events respeta tu privacidad. Los datos de las historias y puntuaciones de juegos se almacenan 
              localmente en tu navegador y no se comparten con terceros.
            </p>
            <h3>Términos de Uso</h3>
            <p>
              Al usar Dynamic Events, aceptas utilizar la plataforma de manera responsable. El contenido generado por IA 
              es para entretenimiento y uso personal.
            </p>
            <h3>Uso de IA</h3>
            <p>
              Las historias son generadas mediante inteligencia artificial. Dynamic Events no se hace responsable del 
              contenido generado, aunque se esfuerza por mantener un ambiente familiar y seguro.
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showFooterModal === 'about'}
        onClose={closeFooterModal}
        size="md"
        className="modal--white"
      >
        <div className="footer-modal">
          <div className="footer-modal__header u-text-center">
            <h2 className="footer-modal__title u-text-primary">🎄 Conócenos</h2>
          </div>
          <div className="footer-modal__content u-text-dark">
            <h3>Acerca de Dynamic Events</h3>
            <p>
              Dynamic Events es una plataforma interactiva que evoluciona con las épocas del año, ofreciendo experiencias 
              únicas y personalizadas. Nuestro objetivo es crear un entorno adaptable, interactivo y entretenido.
            </p>
            <h3>Nuestra Misión</h3>
            <p>
              Ofrecer historias personalizadas guiadas por IA y minijuegos temáticos que se adaptan a cada temporada del año, 
              creando momentos mágicos e inolvidables para nuestros usuarios.
            </p>
            <h3>Características</h3>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
              <li>Historias interactivas con inteligencia artificial</li>
              <li>Minijuegos temáticos y entretenidos</li>
              <li>Diseño adaptable según la época del año</li>
              <li>Experiencia completamente personalizada</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* SCROLL TO TOP */}
      <ScrollToTop variant="primary" position="bottom-right" />
    </div>
  );
}