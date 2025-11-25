import { ChatIA } from "./ChatIA";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
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
            apiEndpoint="/api/chat"
            title=""
            description=""
            finishMarker="<<FIN_DE_LA_HISTORIA>>"
            placeholder="Escribe tu frase aquí..."
            theme="dark"
            maxMessagesHeight="400px"
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
        <Button variant="ghost" size="md" className="footer-button">Instrucciones</Button>
        <Button variant="ghost" size="md" className="footer-button">Políticas</Button>
        <Button variant="ghost" size="md" className="footer-button">Conócenos</Button>
      </footer>
    </div>
  );
}