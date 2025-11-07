import { useState } from "react";

export function ChatIA() {
    const userName = "Luis"
    const [input, setInput] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: `${userName} dice: ${input}` }),
        });
        const data = await res.json();
        setReply(data.reply);
        setLoading(false);
    };

    return (
        <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "3rem" }}>
            <h1>💬 Chat con OpenAI</h1>
            <div>
                <input
                    type="text"
                    placeholder="Escribe algo..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ padding: "0.5rem", width: "60%" }}
                />
                <button onClick={handleSend} disabled={loading} style={{ marginLeft: "1rem" }}>
                    {loading ? "Enviando..." : "Enviar"}
                </button>
                <p style={{ marginTop: "1rem" }}>{reply}</p>
            </div>
        </div>
    )

}

