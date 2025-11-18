import { useState } from "react";
import "../styles/ChristmasLanding.css";
import { MinigameTest } from "./MinigameTest";

/**
 * ChristmasLanding - Landing page con navegación a Chat
 * 
 * @param {Object} props
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 */
export function ChristmasLanding({ onNavigateToChat }) {
  const [activeModal, setActiveModal] = useState(null); // null | 'game'
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

  // Navegar al chat con o sin tema
  const goToChat = (theme = null) => {
    if (onNavigateToChat) {
      onNavigateToChat(theme);
    }
  };

  // Abrir minijuego
  const openGame = () => {
    setActiveModal("game");
  };

  // Cerrar modal
  const closeModal = () => {
    setActiveModal(null);
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
          <button className="hero-button" onClick={() => goToChat()}>
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
                onClick={() => goToChat(theme)}
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
              <button className="santa-card__button" onClick={() => goToChat()}>
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

      {/* MODAL MINIJUEGO (solo para el juego) */}
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