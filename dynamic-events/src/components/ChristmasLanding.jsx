import { useState } from "react";
import "../styles/ChristmasLanding.css";
import { ChatIA } from "./ChatIA";
import { MinigameTest } from "./MinigameTest";

/**
 * ChristmasLanding - Landing page completa de la aventura navideña
 */
export function ChristmasLanding() {
  const [activeModal, setActiveModal] = useState(null); // null | 'chat' | 'game'
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Temas disponibles para las historias
  const themes = [
    {
      id: 1,
      title: "Un regalo especial",
      icon: "🎁",
      color: "green",
      description: "Un elfo que perdió un regalo importante"
    },
    {
      id: 2,
      title: "El árbol mágico",
      icon: "🎄",
      color: "brown",
      description: "Una estrella mágica que guía a los duendes"
    },
    {
      id: 3,
      title: "Leyenda de nieve",
      icon: "⛄",
      color: "red",
      description: "Un pueblo sin nieve en víspera de Navidad"
    }
  ];

  // Navegación del carrusel
  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % themes.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + themes.length) % themes.length);
  };

  // Abrir chat con tema seleccionado
  const openChat = (theme = null) => {
    setSelectedTheme(theme);
    setActiveModal("chat");
  };

  // Abrir minijuego
  const openGame = () => {
    setActiveModal("game");
  };

  // Cerrar modal
  const closeModal = () => {
    setActiveModal(null);
    setSelectedTheme(null);
  };

  return (
    <div className="christmas-landing">
      {/* HEADER */}
      <header className="christmas-header">
        <div className="christmas-logo">Dynamic Events</div>
        <nav className="christmas-nav">
          <button className="nav-pill nav-pill--active">Temporadas</button>
          <button className="nav-pill">Historias IA</button>
          <button className="nav-pill">Minijuegos</button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="christmas-hero">
        <div className="hero-illustration"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Entra a la Aventura de la
            <br />
            Navidad
          </h1>
          <button className="hero-button" onClick={() => openChat()}>
            Crea tu historia
          </button>
        </div>
      </section>

      {/* CAROUSEL DE TEMAS */}
      <section className="carousel-section">
        <div className="carousel-container">
          <button className="carousel-arrow" onClick={prevSlide}>
            ‹
          </button>

          <div className="carousel-track">
            {themes.map((theme, index) => (
              <div
                key={theme.id}
                className={`theme-card theme-card--${theme.color}`}
                onClick={() => openChat(theme)}
                style={{
                  transform: `translateX(-${carouselIndex * 110}%)`,
                  transition: "transform 0.5s ease"
                }}
              >
                <div className="theme-card__icon">{theme.icon}</div>
                <h3 className="theme-card__title">{theme.title}</h3>
              </div>
            ))}
          </div>

          <button className="carousel-arrow" onClick={nextSlide}>
            ›
          </button>
        </div>
      </section>

      {/* SECCIÓN SANTA CLAUS */}
      <section className="santa-section">
        <div className="santa-card">
          <div className="santa-card__inner">
            <div className="santa-card__text">
              <div className="santa-card__message">
                Ho, ho, ho... ¡Hola aventurero!
                <br />
                He preparado algo muy especial para ti.
                <br />
                Si presionas el botón, podrás crear tu propia historia navideña conmigo.
                <br />
                ¡Estoy listo para vivir esta aventura contigo!
              </div>
              <button className="santa-card__button" onClick={() => openChat()}>
                Click aquí
              </button>
            </div>
            <div className="santa-card__image">🎅</div>
          </div>
        </div>
      </section>

      {/* SECCIÓN MINIJUEGOS */}
      <section className="minigames-section">
        <div className="minigames-grid">
          <div className="minigame-card minigame-card--green">
            <div className="minigame-card__preview">🎮</div>
            <h3 className="minigame-card__title">minijuego</h3>
          </div>

          <div
            className="minigame-card minigame-card--brown"
            onClick={openGame}
          >
            <div className="minigame-card__preview">
              🎁❄️🎄
            </div>
            <h3 className="minigame-card__title">minijuego</h3>
          </div>

          <div className="minigame-card minigame-card--red">
            <div className="minigame-card__preview">🎮</div>
            <h3 className="minigame-card__title">minijuego</h3>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="christmas-footer">
        <button className="footer-button">Instrucciones</button>
        <button className="footer-button">Políticas</button>
        <button className="footer-button">Conócenos</button>
      </footer>

      {/* MODAL CHAT */}
      {activeModal === "chat" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <ChatIA
              userName="Aventurero"
              assistantName="Santa Claus"
              apiEndpoint="/api/chat"
              title={
                selectedTheme
                  ? `🎄 ${selectedTheme.title}`
                  : "🎅 Crea tu Historia Navideña"
              }
              description={
                selectedTheme
                  ? selectedTheme.description
                  : "¡Ho, ho, ho! 🎄✨ Escribe tu primera frase para comenzar la aventura."
              }
              finishMarker="<<FIN_DE_LA_HISTORIA>>"
              placeholder="Continúa la historia..."
              theme="dark"
              maxMessagesHeight="500px"
              onFinish={(messages) => {
                console.log("Historia completa:", messages);
                // Aquí podrías guardar la historia o mostrar un resumen
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL MINIJUEGO */}
      {activeModal === "game" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <MinigameTest />
          </div>
        </div>
      )}
    </div>
  );
}