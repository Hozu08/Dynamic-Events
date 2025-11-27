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
 * @param {Function} props.onError - Callback cuando ocurre un error específico (rate_limit_exceeded, api_error)
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
  onError = () => {},
  initialMessages = [],
  maxMessagesHeight = "300px",
  enableKeyboardShortcuts = true,
  welcomeContent = null,
  autoStartWithTheme = null, // Tema para iniciar automáticamente
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const hasAutoStartedRef = useRef(false);

  // Detecta si la conversación ha finalizado
  const isFinished = messages.some((msg) =>
    msg.content.includes(finishMarker)
  );

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Iniciar automáticamente con el tema seleccionado
  useEffect(() => {
    // Solo iniciar si hay un tema válido con título
    const hasValidTheme = autoStartWithTheme && 
                          autoStartWithTheme.title && 
                          typeof autoStartWithTheme.title === 'string' &&
                          autoStartWithTheme.title.trim() !== '';
    
    if (hasValidTheme && !hasAutoStartedRef.current && messages.length === 0 && !loading) {
      hasAutoStartedRef.current = true;
      
      // Crear mensaje inicial basado en el tema
      const themeDescription = autoStartWithTheme.description || '';
      const initialMessage = `Quiero crear una historia sobre: ${autoStartWithTheme.title}.${themeDescription ? ' ' + themeDescription : ''}`;
      
      const newUserMessage = {
        role: "user",
        content: `${userName} dice: ${initialMessage}`,
      };
      const newMessages = [newUserMessage];
      
      setMessages(newMessages);
      setLoading(true);
      setError(null);
      
      // Callback onSend
      onSend(initialMessage);
      
      // Enviar mensaje automáticamente
      fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const error = new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
            error.status = res.status;
            error.errorCode = errorData.error;
            throw error;
          }
          return res.json();
        })
        .then((data) => {
          const aiMessage = { role: "assistant", content: data.reply };
          const updatedMessages = [...newMessages, aiMessage];
          setMessages(updatedMessages);
          
          if (aiMessage.content.includes(finishMarker)) {
            onFinish(updatedMessages);
          }
        })
        .catch((err) => {
          console.error("Error en auto-start fetch:", err);
          console.error("API Endpoint usado:", apiEndpoint);
          
          // Detectar errores de red (Failed to fetch, CORS, etc.)
          const isNetworkError = 
            err.message === "Failed to fetch" ||
            err.message.includes("NetworkError") ||
            err.message.includes("Network request failed") ||
            err.name === "TypeError" ||
            !err.status; // Si no hay status, probablemente es un error de red
          
          if (isNetworkError) {
            const errorMessage = "No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.";
            setError(errorMessage);
            onError("network_error");
            console.error("Error de red detectado. Verifica:", {
              endpoint: apiEndpoint,
              message: err.message,
              name: err.name
            });
          } else if (err.status === 429 || err.errorCode === "rate_limit_exceeded") {
            setError("rate_limit_exceeded");
            onError("rate_limit_exceeded");
          } else if (err.status === 500 || err.errorCode === "api_error") {
            setError("api_error");
            onError("api_error");
          } else {
            setError(
              `⚠️ Ocurrió un error: ${err.message || "Error desconocido"}. Por favor, intenta de nuevo.`
            );
          }
          hasAutoStartedRef.current = false; // Permitir reintentar en caso de error
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [autoStartWithTheme, messages.length, loading, userName, apiEndpoint, finishMarker, onFinish, onSend]);

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
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
        error.status = res.status;
        error.errorCode = errorData.error;
        throw error;
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
      console.error("Error en fetch:", err);
      console.error("API Endpoint usado:", apiEndpoint);
      
      // Detectar errores de red (Failed to fetch, CORS, etc.)
      const isNetworkError = 
        err.message === "Failed to fetch" ||
        err.message.includes("NetworkError") ||
        err.message.includes("Network request failed") ||
        err.name === "TypeError" ||
        !err.status; // Si no hay status, probablemente es un error de red
      
      if (isNetworkError) {
        const errorMessage = "No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.";
        setError(errorMessage);
        onError("network_error");
        console.error("Error de red detectado. Verifica:", {
          endpoint: apiEndpoint,
          message: err.message,
          name: err.name
        });
      } else if (err.status === 429 || err.errorCode === "rate_limit_exceeded") {
        setError("rate_limit_exceeded");
        onError("rate_limit_exceeded");
      } else if (err.status === 500 || err.errorCode === "api_error") {
        setError("api_error");
        onError("api_error");
      } else {
        setError(
          `⚠️ Ocurrió un error: ${err.message || "Error desconocido"}. Por favor, intenta de nuevo.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para reiniciar
  const handleReset = () => {
    setMessages(initialMessages);
    setInput("");
    setError(null);
    hasAutoStartedRef.current = false; // Resetear para permitir auto-start de nuevo
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
        {/* Contenido de bienvenida personalizado */}
        {welcomeContent && (
          <div className="chat-welcome-content">
            {welcomeContent}
          </div>
        )}

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