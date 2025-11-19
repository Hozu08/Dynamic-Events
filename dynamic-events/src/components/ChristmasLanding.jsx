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
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedThemeForModal, setSelectedThemeForModal] = useState(null);

  // Temas disponibles para las historias
  const themes = [
    {
      id: 1,
      title: "Un regalo especial",
      icon: "🎁",
      color: "green",
      description: "Un elfo que perdió un regalo importante",
      story: "En el taller del Polo Norte, el elfo Timmy había perdido el regalo más importante de la temporada: un osito de peluche mágico que podía hablar y contar historias. Este regalo estaba destinado a una niña llamada Emma, quien había pedido un amigo que nunca la dejara sola. Timmy buscó por todo el taller, entre cajas y papeles de regalo, pero no lo encontró. Con lágrimas en sus ojos, decidió pedirle ayuda a sus amigos elfos. Juntos, buscaron en cada rincón hasta que finalmente lo encontraron en el trineo de Santa, quien lo había guardado porque sabía lo especial que era. Emma recibió su regalo en Navidad y nunca estuvo sola de nuevo.",
      image: "/images/theme-gift.png"
    },
    {
      id: 2,
      title: "El árbol mágico",
      icon: "🎄",
      color: "brown",
      description: "Una estrella mágica que guía a los duendes",
      story: "En lo alto del árbol de Navidad del Polo Norte brillaba una estrella especial. Esta estrella no era como las demás; tenía el poder de guiar a los duendes cuando se perdían en la noche nevada. Una noche, tres duendes jóvenes salieron a buscar piñas para decorar, pero una tormenta de nieve los desorientó. La estrella comenzó a brillar más fuerte que nunca, creando un camino de luz dorada que los guió de regreso a casa. Desde entonces, los duendes siempre miraban la estrella antes de salir, sabiendo que ella los protegería. La estrella se convirtió en el símbolo de esperanza del Polo Norte.",
      image: "/images/theme-tree.png"
    },
    {
      id: 3,
      title: "Leyenda de nieve",
      icon: "⛄",
      color: "red",
      description: "Un pueblo sin nieve en víspera de Navidad",
      story: "El pueblo de Villa Esperanza nunca había pasado una Navidad sin nieve, pero ese año el clima había cambiado. Los niños estaban tristes porque no podrían hacer muñecos de nieve ni tener una blanca Navidad. La pequeña Luna decidió escribirle a Santa pidiéndole, no juguetes, sino nieve para su pueblo. Santa leyó la carta y se conmovió tanto que pidió ayuda a Jack Frost, el espíritu del invierno. Juntos crearon una tormenta mágica que cubrió el pueblo con la nieve más brillante que habían visto. Los niños despertaron en Navidad con un paisaje blanco y mágico, y Luna aprendió que la generosidad es el mejor regalo.",
      image: "/images/theme-snowman.png"
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

  // Abrir modal de tema
  const openThemeModal = (theme) => {
    setSelectedThemeForModal(theme);
    setShowThemeModal(true);
  };

  // Cerrar modal
  const closeThemeModal = () => {
    setShowThemeModal(false);
    setSelectedThemeForModal(null);
  };

  return (
    <div className="christmas-landing">
      {/* HEADER */}
      <header className="christmas-header">
        <div className="christmas-logo">Dynamic Events</div>
        <nav className="christmas-nav">
          <button className="nav-pill">Temporadas</button>
          <button className="nav-pill" onClick={() => goToChat()}>
            Historias IA
          </button>
          <button className="nav-pill" onClick={goToGame}>
            Minijuegos
          </button>
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
        <div className="carousel-header">
          <h2 className="carousel-title">Historias Mágicas de Navidad</h2>
          <p className="carousel-description">
            Descubre historias encantadoras llenas de espíritu navideño. 
            Haz clic en una para leer su cuento mágico.
          </p>
        </div>

        <div className="carousel-container">
          <button className="carousel-arrow carousel-arrow--simple" onClick={prevSlide}>
            ‹
          </button>

          <div className="carousel-track">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`theme-card theme-card--${theme.color}`}
                onClick={() => openThemeModal(theme)}
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

          <button className="carousel-arrow carousel-arrow--simple" onClick={nextSlide}>
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
                  e.target.style.display = 'none';
                  const emojiDiv = document.createElement('div');
                  emojiDiv.className = 'santa-card__image';
                  emojiDiv.textContent = '🎅';
                  e.target.parentElement.appendChild(emojiDiv);
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

      {/* MODAL DE HISTORIA */}
      {showThemeModal && selectedThemeForModal && (
        <div className="modal-overlay" onClick={closeThemeModal}>
          <div className="modal-content modal-content--story" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeThemeModal}>
              ×
            </button>
            <div className="story-modal">
              <div className="story-modal__header">
                <span className="story-modal__icon">{selectedThemeForModal.icon}</span>
                <h2 className="story-modal__title">{selectedThemeForModal.title}</h2>
              </div>
              <p className="story-modal__text">{selectedThemeForModal.story}</p>
              <button 
                className="story-modal__button"
                onClick={() => {
                  closeThemeModal();
                  goToChat(selectedThemeForModal);
                }}
              >
                Crear mi propia versión de esta historia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}