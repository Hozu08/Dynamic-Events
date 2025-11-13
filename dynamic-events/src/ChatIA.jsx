import { useState } from "react";

export function ChatIA() {
  const userName = "Usuario X";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); //Historial de conversación.
  const [loading, setLoading] = useState(false);

  //Detecta si la historia finalizo
  const finishHistory = messages.some(
    msg => msg.content.includes("<<FIN_DE_LA_HISTORIA>>")
  );

  //Función para enviar mensajes al backend.
  const handleSend = async () => {
    if (!input.trim()) return; //Valida si lo que ingreso el usuario esta vacio luego de eliminar los espacios en blanco al final y al inicio con trim().

    const newUserMessage = { role: "user", content: `${userName} dice: ${input}` };
    const newMessages = [...messages, newUserMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      //Envía con el método POST el historial de mensajes que ha ingresado el usuario.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      //Espera la respuesta de 'server.js' de forma asíncrona para ser agregada al historial de mensajes.
      const data = await res.json();
      const aiMessage = { role: "assistant", content: data.reply }; //Se estructura la respuesta dada desde 'server.js'.

      setMessages([...newMessages, aiMessage]); //Se agrega la respuesta al historial de mensajes.
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //Función para reiniciar el contenido del historial de conversación.
  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "3rem" }}>
      <h1>🎅 ¡Bienvenido a la historia navideña!</h1>
      <p>
        ¡Ho, ho, ho! 🎄✨
        ¡Bienvenido, pequeño soñador y gran creador!
        Aquí tú y yo escribiremos juntos una historia mágica de Navidad.
        Escribe tu primera frase para comenzar la aventura.
      </p>

      {/*Se renderiza el historial de mensajes*/}
      <div
        style={{
          background: "#4e4e4eff",
          borderRadius: "12px",
          padding: "1rem",
          width: "60%",
          margin: "1rem auto",
          textAlign: "left",
          height: "300px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <p
            key={i}
            style={{
              background: msg.role === "user" ? "#1a546eff" : "#141414ff",
              padding: "0.5rem",
              borderRadius: "8px",
              margin: "0.5rem 0",
            }}
          >
            <strong>{msg.role === "user" ? userName : "Santa Claus"}:</strong>{" "}
            {msg.content}
          </p>
        ))}
        {loading && <p>🎅 Santa está pensando...</p>}
      </div>

      <div>
        <input
          type="text"
          placeholder= {finishHistory ? "Historia finalizada!" : "Continua la historia..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "0.5rem", width: "60%" }}
          onKeyDown={(e) => e.key === "Enter" && !finishHistory && handleSend()}
          disabled={loading || finishHistory} //Input deshabilitado al finalizar la historia.
        />
        <button
          onClick={finishHistory ? handleReset : handleSend}
          disabled={loading}
          style={{ marginLeft: "1rem" }}
        >
          {finishHistory ? "Reiniciar historia" : loading ? "Pensando..." : "Enviar"} 
        </button>
      </div>
    </div>
  );
}
