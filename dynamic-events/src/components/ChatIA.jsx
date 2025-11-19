import { useState, useEffect, useRef } from "react";
import "../styles/chat.css";

/**
 * ChatIA - Componente reutilizable de chat con IA
 * 
 * @param {Object} props
 * @param {string} props.userName - Nombre del usuario
 * @param {string} props.assistantName - Nombre del asistente/bot
 * @param {string} props.apiEndpoint - URL del endpoint de la API
 * @param {string} props.title - Título del chat
 * @param {string} props.description - Descripción o bienvenida
 * @param {string} props.finishMarker - Marcador que indica el fin de la conversación
 * @param {string} props.placeholder - Placeholder del input
 * @param {string} props.theme - Tema visual (dark, light, christmas)
 * @param {Function} props.onReset - Callback al reiniciar
 * @param {Function} props.onSend - Callback al enviar mensaje
 * @param {Function} props.onFinish - Callback al finalizar conversación
 */
export function ChatIA({
  userName = "Usuario",
  assistantName = "Asistente",
  apiEndpoint = "/api/chat",
  title = "Chat con IA",
  description = "Bienvenido al chat",
  finishMarker = "<<FIN_DE_LA_HISTORIA>>",
  placeholder = "Escribe tu mensaje...",
  theme = "dark",
  onReset = () => {},
  onSend = () => {},
  onFinish = () => {},
  initialMessages = [],
  maxMessagesHeight = "300px",
  enableKeyboardShortcuts = true,
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Detecta si la conversación ha finalizado
  const isFinished = messages.some((msg) =>
    msg.content.includes(finishMarker)
  );

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Función para enviar mensajes
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newUserMessage = {
      role: "user",
      content: `${userName} dice: ${input}`,
    };
    const newMessages = [...messages, newUserMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

    // Callback onSend
    onSend(input);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const aiMessage = { role: "assistant", content: data.reply };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);

      // Detectar si es el mensaje final
      if (aiMessage.content.includes(finishMarker)) {
        onFinish(updatedMessages);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        `⚠️ Ocurrió un error: ${err.message}. Por favor, intenta de nuevo.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para reiniciar
  const handleReset = () => {
    setMessages(initialMessages);
    setInput("");
    setError(null);
    onReset();
  };

  // Manejo de tecla Enter
  const handleKeyDown = (e) => {
    if (
      enableKeyboardShortcuts &&
      e.key === "Enter" &&
      !e.shiftKey &&
      !isFinished &&
      !loading
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container chat-container--centered">
      {/* Título */}
      {title && <h1>{title}</h1>}

      {/* Descripción */}
      {description && <p>{description}</p>}

      {/* Área de mensajes con scroll automático */}
      <div
        className={`chat-messages chat-messages--${theme}`}
        style={{ 
          height: maxMessagesHeight,
          overflowY: "auto" // Asegura que siempre tenga scroll si es necesario
        }}
      >
        {messages.map((msg, i) => ( 
          <div
            key={i}
            className={`chat-message ${
              msg.role === "user"
                ? "chat-message--user"
                : "chat-message--assistant"
            }`}
          >
            <span className="text-bold">
              {msg.role === "user" ? userName : assistantName}:
            </span>{" "}
            {msg.content}
          </div>
        ))}

        {/* Indicador de carga */}
        {loading && (
          <div className="chat-loading">🎅 {assistantName} está pensando...</div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="chat-message chat-message--assistant">{error}</div>
        )}

        {/* Referencia para auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de input */}
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder={
            isFinished ? "Conversación finalizada" : placeholder
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || isFinished}
        />
        <button
          className={`chat-button ${
            isFinished ? "chat-button--secondary" : "chat-button--primary"
          }`}
          onClick={isFinished ? handleReset : handleSend}
          disabled={loading}
        >
          {isFinished
            ? "🔄 Reiniciar"
            : loading
            ? "⏳ Enviando..."
            : "✉️ Enviar"}
        </button>
      </div>
    </div>
  );
}