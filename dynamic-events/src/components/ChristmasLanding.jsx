import { useState } from "react";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
import { Card } from "./base/Card";
import { Modal } from "./base/Modal";
import { Hero } from "./base/Hero";
import { Carousel } from "./base/Carousel";
import "../styles/ChristmasLanding.css";
import "../styles/base/utilities.css";

/**
 * ChristmasLanding - Landing page con navegación a Chat y Juego
 * 
 * @param {Object} props
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 * @param {Function} props.onNavigateToGame - Callback para navegar al juego
 * @param {Function} props.onNavigateToLanding - Callback para navegar a la landing (para el logo)
 */
export function ChristmasLanding({ onNavigateToChat, onNavigateToGame, onNavigateToLanding }) {
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedThemeForModal, setSelectedThemeForModal] = useState(null);
  const [showFooterModal, setShowFooterModal] = useState(null); // 'instructions' | 'policies' | 'about' | null

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

  // Abrir modal del footer
  const openFooterModal = (modalType) => {
    setShowFooterModal(modalType);
  };

  // Cerrar modal del footer
  const closeFooterModal = () => {
    setShowFooterModal(null);
  };

  // Renderizar item del carrusel
  const renderThemeCard = (theme) => (
    <Card
      key={theme.id}
      variant={theme.color}
      className="theme-card"
      interactive
      onClick={() => openThemeModal(theme)}
    >
      {theme.image ? (
        <img
          src={theme.image}
          alt={theme.title}
          className="card__image theme-card__image"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'block';
            }
          }}
        />
      ) : null}
      <div
        className="card__icon theme-card__icon"
        style={{ display: theme.image ? 'none' : 'block' }}
      >
        {theme.icon}
      </div>
      <h3 className="card__title theme-card__title">{theme.title}</h3>
    </Card>
  );

  return (
    <div className="christmas-landing">
      {/* HEADER */}
      <Header
        logo="Dynamic Events"
        className="christmas-header"
        sticky
        variant="light"
        onLogoClick={onNavigateToLanding}
      >
        <Button variant="pill" size="md">Temporadas</Button>
        <Button variant="pill" size="md" onClick={() => goToChat()}>
          Historias IA
        </Button>
        <Button variant="pill" size="md" onClick={goToGame}>
          Minijuegos
        </Button>
      </Header>

      {/* HERO SECTION */}
      <section className="christmas-hero hero hero--gradient-sky">
        <div className="hero-illustration" style={{ backgroundImage: "url('/images/hero-background.png')" }}></div>
        <div className="hero__content">
          <h1 className="hero__title hero__title--light">
            Entra a la Aventura de la
            <br />
            Navidad
          </h1>
          <Button variant="outline" size="lg" className="hero-button" onClick={() => goToChat()}>
            Crea tu historia
          </Button>
        </div>
      </section>

      {/* CAROUSEL DE TEMAS */}
      <section className="landing-section landing-section--padding carousel-section">
        <div className="carousel-header u-text-center">
          <h2 className="carousel-title u-text-primary">Historias Mágicas de Navidad</h2>
          <p className="carousel-description u-text-dark">
            Descubre historias encantadoras llenas de espíritu navideño. 
            Haz clic en una para leer su cuento mágico.
          </p>
        </div>

        <div className="carousel-container">
          <Carousel
            items={themes}
            renderItem={renderThemeCard}
            showControls
          />
        </div>
      </section>

      {/* SECCIÓN SANTA CLAUS */}
      <section className="landing-section landing-section--padding santa-section">
        <div className="santa-card">
          <div className="santa-card__inner u-flex u-flex-between">
            <div className="santa-card__text">
              <div className="santa-card__message u-text-italic">
                Ho, ho, ho... ¡Hola aventurero!
                <br />
                He preparado algo muy especial para ti.
                <br />
                Si presionas el botón, podrás crear tu propia historia navideña conmigo.
                <br />
                ¡Estoy listo para vivir esta aventura contigo!
              </div>
              <Button variant="primary" size="lg" className="santa-card__button" onClick={() => goToChat()}>
                Click aquí
              </Button>
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
      <section className="landing-section landing-section--padding minigames-section">
        <div className="minigames-grid u-grid u-grid-3 u-gap-lg">
          {/* Minijuego 1 */}
          <Card variant="green" className="minigame-card" interactive>
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
          </Card>

          {/* Minijuego 2 - Atrapa regalos (principal) */}
          <Card
            variant="brown"
            className="minigame-card"
            interactive
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
          </Card>

          {/* Minijuego 3 */}
          <Card variant="red" className="minigame-card" interactive>
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
          </Card>
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

      {/* MODAL DE HISTORIA */}
      <Modal
        isOpen={showThemeModal}
        onClose={closeThemeModal}
        size="md"
        className="modal--white"
      >
        {selectedThemeForModal && (
          <div className="story-modal">
            <div className="story-modal__header u-text-center">
              <span className="story-modal__icon">{selectedThemeForModal.icon}</span>
              <h2 className="story-modal__title u-text-primary">{selectedThemeForModal.title}</h2>
            </div>
            <p className="story-modal__text u-text-dark">{selectedThemeForModal.story}</p>
            <Button
              variant="accent"
              size="lg"
              className="story-modal__button u-width-full"
              onClick={() => {
                closeThemeModal();
                goToChat(selectedThemeForModal);
              }}
            >
              Crear mi propia versión de esta historia
            </Button>
          </div>
        )}
      </Modal>

      {/* MODALES DEL FOOTER */}
      {/* Modal de Instrucciones */}
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

      {/* Modal de Políticas */}
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

      {/* Modal de Conócenos */}
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
    </div>
  );
}