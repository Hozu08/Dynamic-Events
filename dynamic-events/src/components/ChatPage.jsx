import { useState, useEffect } from "react";
import { ChatIA } from "./ChatIA";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
import { Modal } from "./base/Modal";
import { ScrollToTop } from "./base/ScrollToTop";
import { Dropdown } from "./base/Dropdown";
import { getChatApiEndpoint } from "../utils/apiConfig";
import { logApiConfig } from "../utils/debugApi";
import "../styles/ChristmasLanding.css";
import "../styles/ChatPage.css";
import "../styles/base/utilities.css";

/**
 * ChatPage - Página completa para el chat con Santa
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Callback para volver a la landing
 * @param {Function} props.onNavigateToGame - Callback para navegar al juego
 * @param {Object} props.selectedTheme - Tema seleccionado (opcional)
 */
export function ChatPage({ onBack, onNavigateToGame, selectedTheme = null }) {
  const [showFooterModal, setShowFooterModal] = useState(null);

  // Log de configuración de API (desarrollo y producción)
  useEffect(() => {
    logApiConfig();
    const endpoint = getChatApiEndpoint();
    console.log('📍 Endpoint de chat configurado:', endpoint);
    
    // Verificar que la URL tenga protocolo
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      console.warn('⚠️ VITE_API_URL no tiene protocolo. El sistema agregará https:// automáticamente.');
      console.warn('   Para evitar esto, configura VITE_API_URL con https:// en Vercel');
    }
  }, []);

  const openFooterModal = (modalType) => {
    setShowFooterModal(modalType);
  };

  const closeFooterModal = () => {
    setShowFooterModal(null);
  };

  // Manejar errores de la API
  const handleApiError = (errorType) => {
    if (errorType === "rate_limit_exceeded") {
      alert("⚠️ El modelo AI ha llegado al límite de solicitudes. Por favor, intenta más tarde.");
    } else if (errorType === "api_error") {
      alert("⚠️ No hay conexión con la API. Por favor, verifica tu conexión e intenta de nuevo.");
    } else if (errorType === "network_error") {
      alert("⚠️ No se pudo conectar con el servidor. Verifica:\n\n1. Que el backend esté funcionando en Render\n2. Que la variable VITE_API_URL esté configurada correctamente en Vercel\n3. Que CORS esté configurado en el backend para aceptar tu dominio de Vercel");
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
        <Dropdown
          label="Temporadas"
          variant="pill"
          size="md"
          position="bottom-left"
          items={[
            {
              label: "Halloween",
              icon: "🎃",
              onClick: () => {
                // TODO: Implementar navegación a Halloween
                console.log("Navegar a Halloween");
              },
            },
            {
              label: "Navidad",
              icon: "🎄",
              onClick: () => {
                onBack();
              },
            },
            {
              label: "Vacaciones",
              icon: "🏖️",
              onClick: () => {
                // TODO: Implementar navegación a Vacaciones
                console.log("Navegar a Vacaciones");
              },
            },
          ]}
        />
        <Button variant="pill" size="md" className="nav-pill--active">Historias IA</Button>
        <Button variant="pill" size="md" onClick={onNavigateToGame}>Minijuegos</Button>
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
        </div>
      </section>

      {/* ÁREA DE CHAT */}
      <section className="landing-section landing-section--padding">
        <div className="chat-page__chat-wrapper">
          {selectedTheme && selectedTheme.title && selectedTheme.icon && (
            <div style={{ padding: "1rem 2rem 0" }}>
              <span className="chat-page__theme-badge">
                <span style={{ fontSize: "1.5rem" }}>{selectedTheme.icon}</span>
                {selectedTheme.title}
              </span>
            </div>
          )}
          
          <ChatIA
            userName="Aventurero"
            assistantName="Santa Claus"
            apiEndpoint={getChatApiEndpoint()}
            title=""
            description=""
            finishMarker="<<FIN_DE_LA_HISTORIA>>"
            placeholder="Escribe tu frase aquí..."
            theme="dark"
            maxMessagesHeight="400px"
            autoStartWithTheme={selectedTheme}
            onError={handleApiError}
            welcomeContent={
              <div className="santa-card">
                <div className="santa-card__inner santa-card__inner--chat">
                  <div className="santa-card__text">
                    <h1 className="santa-card__title santa-card__title--chat">
                      {selectedTheme && selectedTheme.title
                        ? `🎄 ${selectedTheme.title}`
                        : "Bienvenido a la historia navideña"}
                    </h1>
                    <div className="santa-card__message santa-card__message--chat">
                      {selectedTheme && selectedTheme.title
                        ? `¡Ho, ho, ho! ¡Bienvenido pequeño soñador y gran creador! 
                           Vamos a escribir juntos una historia sobre: ${selectedTheme.title}. 
                           Escribe tu primera frase para comenzar la aventura.`
                        : "¡Ho, ho, ho! ¡Bienvenido pequeño soñador y gran creador! Aquí tú y yo escribiremos juntos una historia mágica de Navidad. Escribe tu primera frase para comenzar la aventura."}
                    </div>
                  </div>
                  
                  {/* Imagen de Santa */}
                  <div className="santa-card__image-wrapper santa-card__image-wrapper--chat">
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
            }
            onFinish={(messages) => {
              console.log("Historia completa:", messages);
            }}
            onReset={() => {
              console.log("Chat reiniciado");
            }}
          />
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