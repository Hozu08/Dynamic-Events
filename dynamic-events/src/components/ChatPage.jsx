import { ChatIA } from "./ChatIA";
import "../styles/ChatPage.css";  

/**
 * ChatPage - Página completa para el chat con Santa
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Callback para volver a la landing
 * @param {Object} props.selectedTheme - Tema seleccionado (opcional)
 */
export function ChatPage({ onBack, selectedTheme = null }) {
  return (
    <div className="chat-page">
      {/* HEADER */}
      <header className="chat-page__header">
        <div className="chat-page__logo">Dynamic Events</div>
        <button className="chat-page__back-button" onClick={onBack}>
          ← Volver al inicio
        </button>
      </header>

      {/* HERO CON SANTA */}
      <section className="chat-page__hero">
        <div className="chat-page__hero-content">
          <div className="chat-page__hero-text">
            <h1 className="chat-page__hero-title">
              {selectedTheme 
                ? `🎄 ${selectedTheme.title}`
                : "Bienvenido a la historia navideña"}
            </h1>
            <p className="chat-page__hero-message">
              {selectedTheme
                ? `¡Ho, ho, ho! ¡Bienvenido pequeño soñador y gran creador! 
                   Vamos a escribir juntos una historia sobre: ${selectedTheme.title}. 
                   Escribe tu primera frase para comenzar la aventura.`
                : "¡Ho, ho, ho! ¡Bienvenido pequeño soñador y gran creador! Aquí tú y yo escribiremos juntos una historia mágica de Navidad. Escribe tu primera frase para comenzar la aventura."}
            </p>
          </div>
          
          {/* Imagen de Santa */}
          <div className="chat-page__hero-santa-wrapper">
            <img 
              src="/images/santa.png" 
              alt="Santa Claus"
              className="chat-page__hero-santa-img"
              onError={(e) => {
                e.target.style.display = 'none';
                const emojiDiv = document.createElement('div');
                emojiDiv.className = 'chat-page__hero-santa';
                emojiDiv.textContent = '🎅';
                e.target.parentElement.appendChild(emojiDiv);
              }}
            />
          </div>
        </div>
      </section>

      {/* ÁREA DE CHAT */}
      <section className="chat-page__content">
        <div className="chat-page__chat-wrapper">
          {selectedTheme && (
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
            title="" // Sin título porque ya está en el hero
            description="" // Sin descripción porque ya está en el hero
            finishMarker="<<FIN_DE_LA_HISTORIA>>"
            placeholder="Escribe tu frase aquí..."
            theme="dark"
            maxMessagesHeight="400px"
            onFinish={(messages) => {
              console.log("Historia completa:", messages);
            }}
            onReset={() => {
              console.log("Chat reiniciado");
            }}
          />
        </div>
      </section>
    </div>
  );
}