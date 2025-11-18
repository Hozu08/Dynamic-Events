import { useState } from "react";
import "../styles/ChristmasLanding.css";

/**
 * ChristmasLanding - Landing page con navegación a Chat y Juego
 * 
 * @param {Object} props
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 * @param {Function} props.onNavigateToGame - Callback para navegar al juego
 */
export function ChristmasLanding({ onNavigateToChat, onNavigateToGame }) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Temas disponibles para las historias
  const themes = [
    {
      id: 1,
      title: "Un regalo especial",
      icon: "🎁",
      color: "green",
      description: "Un elfo que perdió un regalo importante",
      image: "/images/theme-gift.png" // Opcional
    },
    {
      id: 2,
      title: "El árbol mágico",
      icon: "🎄",
      color: "brown",
      description: "Una estrella mágica que guía a los duendes",
      image: "/images/theme-tree.png" // Opcional
    },
    {
      id: 3,
      title: "Leyenda de nieve",
      icon: "⛄",
      color: "red",
      description: "Un pueblo sin nieve en víspera de Navidad",
      image: "/images/theme-snowman.png" // Opcional
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

  // Navegar al juego
  const goToGame = () => {
    if (onNavigateToGame) {
      onNavigateToGame();
    }
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
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`theme-card theme-card--${theme.color}`}
                onClick={() => goToChat(theme)}
                style={{
                  transform: `translateX(-${carouselIndex * 110}%)`,
                  transition: "transform 0.5s ease"
                }}
              >
                {/* Imagen del tema si existe */}
                {theme.image ? (
                  <img 
                    src={theme.image} 
                    alt={theme.title}
                    className="theme-card__image"
                    onError={(e) => {
                      // Fallback al emoji si la imagen falla
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                
                {/* Emoji como fallback */}
                <div 
                  className="theme-card__icon"
                  style={{ display: theme.image ? 'none' : 'block' }}
                >
                  {theme.icon}
                </div>
                
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
            
            {/* Imagen de Santa */}
            <div className="santa-card__image-wrapper">
              <img 
                src="/images/santa.png" 
                alt="Santa Claus"
                onError={(e) => {
                  // Fallback al emoji si la imagen no existe
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="santa-card__image">🎅</div>';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN MINIJUEGOS */}
      <section className="minigames-section">
        <div className="minigames-grid">
          {/* Minijuego 1 */}
          <div className="minigame-card minigame-card--green">
            <div className="minigame-card__preview">
              <img 
                src="/images/game-preview-1.png" 
                alt="Minijuego 1"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span style="font-size: 4rem;">🎮</span>';
                }}
              />
            </div>
            <h3 className="minigame-card__title">minijuego</h3>
          </div>

          {/* Minijuego 2 - Atrapa regalos (principal) */}
          <div
            className="minigame-card minigame-card--brown"
            onClick={goToGame}
          >
            <div className="minigame-card__preview">
              <img 
                src="/images/game-preview-2.png" 
                alt="Atrapa los regalos"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div style="font-size: 3rem;">🎁❄️🎄</div>';
                }}
              />
            </div>
            <h3 className="minigame-card__title">minijuego</h3>
          </div>

          {/* Minijuego 3 */}
          <div className="minigame-card minigame-card--red">
            <div className="minigame-card__preview">
              <img 
                src="/images/game-preview-3.png" 
                alt="Minijuego 3"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span style="font-size: 4rem;">🎮</span>';
                }}
              />
            </div>
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
    </div>
  );
}