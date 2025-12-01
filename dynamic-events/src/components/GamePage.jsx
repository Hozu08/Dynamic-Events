import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { MinigameTest } from "./MinigameTest";
import { MazeGame } from "./MazeGame";
import { CoconutBowling } from "./CoconutBowling";
import { PoolGame } from "./PoolGame";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
import { Modal } from "./base/Modal";
import { ScrollToTop } from "./base/ScrollToTop";
import { Footer } from "./base/Footer";
import "../styles/variables.css";
import "../styles/ChristmasLanding.css";
import "../styles/GamePage.css";
import "../styles/base/utilities.css";

/**
 * GamePage - Página completa para el minijuego
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Callback para volver a la landing
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 * @param {Function} props.onNavigateToCreateHistory - Callback para navegar a crear historia
 * @param {Function} props.onNavigateToMinijuegos - Callback para navegar a la sección de minijuegos
 * @param {Function} props.onNavigateToAboutUs - Callback para navegar a AboutUs
 * @param {Function} props.onNavigateToAddInfo - Callback para navegar a AddInfo
 */
export function GamePage({ onBack, onNavigateToChat, onNavigateToCreateHistory, onNavigateToMinijuegos, onNavigateToAboutUs, onNavigateToAddInfo }) {
  const { currentTheme } = useTheme();
  const isHalloween = currentTheme === 'halloween';
  const isVacation = currentTheme === 'vacation';
  
  // Obtener el juego seleccionado desde localStorage (leer una vez al montar)
  const [selectedGame] = useState(() => {
    const game = localStorage.getItem('selectedGame');
    // Limpiar después de leer para que no persista
    if (game) {
      localStorage.removeItem('selectedGame');
    }
    return game;
  });
  
  // Estadísticas según el tema y juego
  const getStorageKey = () => {
    if (isHalloween) return 'mazeGame';
    if (isVacation) {
      if (selectedGame === 'pool') return 'poolGame';
      return 'coconutBowlingGame';
    }
    return 'christmasGame';
  };
  
  const storageKey = getStorageKey();
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem(`${storageKey}HighScore`)) || 0
  );
  const [gamesPlayed, setGamesPlayed] = useState(
    parseInt(localStorage.getItem(`${storageKey}Played`)) || 0
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
    localStorage.setItem(`${storageKey}Played`, newGamesPlayed);

    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem(`${storageKey}HighScore`, stats.score);
    }
  };

  // Manejar cambios de score
  const handleScoreChange = (score) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`${storageKey}HighScore`, score);
    }
  };

  return (
    <div className={`landing landing--${currentTheme}`}>
      {/* HEADER */}
      <Header
        logo="Dynamic Events"
        className={`landing-header landing-header--${currentTheme}`}
        sticky
        variant="light"
        onLogoClick={onBack}
        showThemeSelector={true}
      >
        <a href="#minijuegos" className="nav-link nav-link--active" onClick={(e) => { 
          e.preventDefault(); 
          if (onNavigateToMinijuegos) {
            onNavigateToMinijuegos();
          }
        }}>
          Minijuegos
        </a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
          Crear historia IA
        </a>
      </Header>

      {/* HERO */}
      <section className={`hero hero--index-${currentTheme} hero--red-page game-page-hero`}>
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              {isHalloween 
                ? 'Laberinto Encantado' 
                : isVacation 
                ? (selectedGame === 'pool' ? 'Billar' : 'Coconut Bowling')
                : 'Atrapa los Regalos Navideños'}
            </h1>
            <p className="hero-synopsis">
              {isHalloween 
                ? 'Navega por un laberinto oscuro con tu linterna. Recolecta todos los dulces mientras evitas a los monstruos. ¡Cuidado! Tu batería se agota con el tiempo.'
                : isVacation
                ? (selectedGame === 'pool' 
                  ? 'Golpea la bola blanca para meter todas las bolas numeradas en las troneras. Usa la física del billar para conseguir el mejor puntaje. ¡Cada bola vale puntos!'
                  : 'Lanza cocos para derribar piñas y botellas. Ajusta el ángulo y la fuerza para conseguir el mejor puntaje. ¡Cada nivel tiene formaciones más desafiantes!')
                : '¡Ayuda a Santa a atrapar todos los regalos que caen del cielo! Mueve el trineo con el mouse y no dejes que ningún regalo toque el suelo.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* ÁREA DEL JUEGO */}
      <section className="landing-section landing-section--padding">
        <div className="game-page__content-wrapper">
          {/* INSTRUCCIONES - Desktop izquierda, Mobile antes */}
          <div className="game-page__info-section game-page__instructions">
            <h3 className="game-page__info-title">📖 Cómo Jugar</h3>
            <ul className="game-page__info-list">
              {isHalloween ? (
                <>
                  <li>Usa <strong>WASD</strong> o las <strong>flechas</strong> para moverte</li>
                  <li>Recolecta todos los <strong>dulces</strong> 🍬 para ganar puntos</li>
                  <li>Evita a los <strong>monstruos</strong> o perderás una vida ❤️</li>
                  <li>Tu <strong>linterna</strong> tiene batería limitada 🔋</li>
                  <li>La batería se agota con el tiempo - ¡recógela antes!</li>
                  <li>Recoger dulces recarga un poco la batería</li>
                  <li>El juego termina si se agota la batería o pierdes todas las vidas</li>
                  <li>¡Intenta superar tu récord personal!</li>
                </>
              ) : isVacation ? (
                selectedGame === 'pool' ? (
                  <>
                    <li><strong>Haz clic</strong> y arrastra desde la bola blanca para apuntar</li>
                    <li><strong>Suelta</strong> para golpear la bola con la fuerza indicada</li>
                    <li>La <strong>longitud de la flecha</strong> indica la fuerza del tiro</li>
                    <li>Mete las <strong>bolas numeradas</strong> 🎱 en las troneras para ganar puntos</li>
                    <li>En modo <strong>Bola 8</strong>: Mete todas tus bolas (rayadas o lisas) y luego la 8</li>
                    <li>En modo <strong>Bola 9</strong>: Mete la bola 9 para ganar</li>
                    <li>Si metes la <strong>bola blanca</strong>, pierdes el turno</li>
                    <li>Las bolas rebotan entre sí y en los bordes de la mesa</li>
                    <li>¡Intenta conseguir el mejor puntaje!</li>
                  </>
                ) : (
                  <>
                    <li><strong>Arrastra</strong> el mouse o usa las <strong>flechas</strong> para ajustar ángulo y fuerza</li>
                    <li>Presiona <strong>Espacio</strong> o <strong>suelta</strong> el mouse para lanzar el coco</li>
                    <li>Derriba todas las <strong>piñas</strong> 🍍 y <strong>botellas</strong> 🍾 para avanzar</li>
                    <li>Cada objetivo tiene <strong>puntos</strong> diferentes (piñas: 10, botellas: 15)</li>
                    <li>Tienes <strong>3 cocos</strong> por ronda 🥥</li>
                    <li>Cada nivel tiene <strong>formaciones</strong> más desafiantes</li>
                    <li>El juego termina si no derribas todos los objetivos</li>
                    <li>¡Intenta superar tu récord personal!</li>
                  </>
                )
              ) : (
                <>
                  <li>Mueve el trineo con el <strong>mouse</strong> de izquierda a derecha</li>
                  <li>Atrapa los <strong>regalos</strong> que caen para ganar puntos</li>
                  <li>Si un regalo toca el suelo, pierdes una <strong>vida</strong> ❤️</li>
                  <li>Cada 10 regalos atrapados, el <strong>nivel</strong> sube y los regalos caen más rápido</li>
                  <li>El juego termina cuando te quedas sin vidas</li>
                  <li>¡Intenta superar tu récord personal!</li>
                </>
              )}
            </ul>
          </div>

          {/* JUEGO CENTRAL */}
          <div className="game-page__game-section">
        <div className="game-page__game-wrapper">
              <div className="game-page__game-wrapper-inner">
                <div className="game-page__title-wrapper">
                  <button 
                    className="game-page__pause-button"
                    onClick={(e) => {
                      e.preventDefault();
                      // Disparar evento ESC para pausar el juego (igual que presionar ESC)
                      const escapeEvent = new KeyboardEvent('keydown', {
                        key: 'Escape',
                        code: 'Escape',
                        keyCode: 27,
                        which: 27,
                        bubbles: true,
                        cancelable: true
                      });
                      document.dispatchEvent(escapeEvent);
                    }}
                    aria-label="Pausar juego"
                  >
                    ⏸
                  </button>
                  <h2 className="game-page__game-title">
                    {isHalloween 
                      ? 'Laberinto Encantado' 
                      : isVacation 
                      ? (selectedGame === 'pool' ? 'Billar' : 'Coconut Bowling')
                      : 'Trineo veloz'}
                  </h2>
                </div>
                {isHalloween ? (
                  <MazeGame 
                    title=""
                    description=""
                    onGameOver={handleGameOver}
                    onScoreChange={handleScoreChange}
                    theme="halloween"
                  />
                ) : isVacation ? (
                  selectedGame === 'pool' ? (
                    <PoolGame 
                      title=""
                      description=""
                      onGameOver={handleGameOver}
                      onScoreChange={handleScoreChange}
                      theme="vacation"
                    />
                  ) : (
                    <CoconutBowling 
                      title=""
                      description=""
                      onGameOver={handleGameOver}
                      onScoreChange={handleScoreChange}
                      theme="vacation"
                    />
                  )
                ) : (
                  <MinigameTest 
                    onGameOver={handleGameOver}
                    onScoreChange={handleScoreChange}
                  />
                )}
              </div>
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
        </div>

          {/* MECÁNICAS/POWER-UPS - Desktop derecha, Mobile después */}
          <div className="game-page__info-section game-page__powerups">
            <h3 className="game-page__info-title">
              {isHalloween ? '⚡ Mecánicas' : isVacation ? '⚡ Mecánicas' : '⚡ Power-Ups'}
            </h3>
            <ul className="game-page__info-list">
              {isHalloween ? (
                <>
                  <li className="game-page__powerup-item">
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">🔦 Linterna:</strong>
                      <span className="game-page__powerup-desc">Ilumina el área alrededor de ti. La batería se agota con el tiempo.</span>
                    </div>
                  </li>
                  <li className="game-page__powerup-item">
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">🍬 Dulces:</strong>
                      <span className="game-page__powerup-desc">Recolecta todos los dulces para ganar. Cada uno vale 10 puntos y recarga 5% de batería.</span>
                    </div>
                  </li>
                  <li className="game-page__powerup-item">
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">👹 Monstruos:</strong>
                      <span className="game-page__powerup-desc">Evítalos o perderás una vida. Se mueven aleatoriamente por el laberinto.</span>
                    </div>
                  </li>
                  <li className="game-page__powerup-item">
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">🏆 Victoria:</strong>
                      <span className="game-page__powerup-desc">Recolecta todos los dulces antes de que se agote la batería para ganar un bonus de 100 puntos.</span>
                    </div>
                  </li>
                </>
              ) : isVacation ? (
                selectedGame === 'pool' ? (
                  <>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">🎱 Modos de Juego:</strong>
                        <span className="game-page__powerup-desc"><strong>Bola 8:</strong> Mete todas tus bolas (rayadas 1-7 o lisas 9-15) y luego la 8. <strong>Bola 9:</strong> Mete la bola 9 para ganar.</span>
                      </div>
                    </li>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">🎯 Bolas Rayadas y Lisas:</strong>
                        <span className="game-page__powerup-desc">Bolas 1-7 son rayadas, 9-15 son lisas. La primera bola que metas determina tu tipo en modo Bola 8.</span>
                      </div>
                    </li>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">⚡ Física Realista:</strong>
                        <span className="game-page__powerup-desc">Las bolas rebotan entre sí y en los bordes. Usa los rebotes estratégicamente para meter múltiples bolas.</span>
                      </div>
                    </li>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">👥 Multijugador:</strong>
                        <span className="game-page__powerup-desc">Juega con hasta 2 jugadores. Cada uno tiene su turno. Mete una bola válida para continuar tu turno.</span>
                      </div>
                    </li>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">🏆 Puntuación:</strong>
                        <span className="game-page__powerup-desc">Cada bola vale su número × 10 puntos. La bola 8 vale 80 puntos. Gana el jugador que complete su objetivo primero.</span>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">🥥 Cocos:</strong>
                        <span className="game-page__powerup-desc">Tienes 3 cocos por ronda. Úsalos estratégicamente para derribar todos los objetivos.</span>
                      </div>
                    </li>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">📐 Ángulo y Fuerza:</strong>
                        <span className="game-page__powerup-desc">Ajusta el ángulo con flechas izquierda/derecha y la fuerza con arriba/abajo. O arrastra el mouse para apuntar.</span>
                      </div>
                    </li>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">🎯 Objetivos:</strong>
                        <span className="game-page__powerup-desc">Las piñas valen 10 puntos y las botellas 15 puntos. Derriba todos para avanzar de nivel.</span>
                      </div>
                    </li>
                    <li className="game-page__powerup-item">
                      <div className="game-page__powerup-content">
                        <strong className="game-page__powerup-name">🏆 Niveles:</strong>
                        <span className="game-page__powerup-desc">Cada nivel tiene formaciones más desafiantes. Completa un nivel para ganar un bonus de 50 puntos × nivel.</span>
                      </div>
                    </li>
                  </>
                )
              ) : (
                <>
                  <li className="game-page__powerup-item">
                    <img src="/images/powerup-speed.png" alt="Velocidad" className="game-page__powerup-icon" />
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">Velocidad:</strong>
                      <span className="game-page__powerup-desc">Duplica tu velocidad por 8 segundos</span>
                    </div>
                  </li>
                  <li className="game-page__powerup-item">
                    <img src="/images/powerup-heart.png" alt="Vida Extra" className="game-page__powerup-icon" />
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">Vida Extra:</strong>
                      <span className="game-page__powerup-desc">Gana una vida adicional instantáneamente</span>
                    </div>
                  </li>
                  <li className="game-page__powerup-item">
                    <img src="/images/powerup-star.png" alt="Escudo" className="game-page__powerup-icon" />
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">Escudo:</strong>
                      <span className="game-page__powerup-desc">Protección contra perder vidas por 10 segundos</span>
                    </div>
                  </li>
                  <li className="game-page__powerup-item">
                    <img src="/images/powerup-clock.png" alt="Cámara Lenta" className="game-page__powerup-icon" />
                    <div className="game-page__powerup-content">
                      <strong className="game-page__powerup-name">Cámara Lenta:</strong>
                      <span className="game-page__powerup-desc">Ralentiza todo el juego por 7 segundos</span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer
        onBack={onBack}
        onNavigateToChat={onNavigateToChat}
        onNavigateToCreateHistory={onNavigateToCreateHistory}
        onNavigateToAddInfo={onNavigateToAddInfo}
        onNavigateToAboutUs={onNavigateToAboutUs}
      />

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