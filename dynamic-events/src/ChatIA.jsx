import { useState } from "react";

export function ChatIA() {
  const userName = "Luis";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); //Historial de conversación
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { role: "user", content: `${userName} dice: ${input}` };
    const newMessages = [...messages, newUserMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const aiMessage = { role: "assistant", content: data.reply };

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
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
          placeholder="Escribe aquí tu parte de la historia..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "0.5rem", width: "60%" }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading} style={{ marginLeft: "1rem" }}>
          {loading ? "Pensando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
