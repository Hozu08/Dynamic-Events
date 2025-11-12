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
            <h1>¡Bienvenido!</h1>
            <p>¡Ho, ho, ho! 🎅✨

                ¡Bienvenido, pequeño soñador y gran creador!
                Te habla Santa Claus, directo desde el Polo Norte, con la chimenea encendida, el taller a toda marcha y una taza humeante de chocolate caliente en la mano.
                Aquí, en este mágico espacio, tú y yo, junto a un poco de polvo de estrellas y mucha imaginación, daremos vida a una historia única, tejida con las chispas de la Navidad.

                Prepárate para dejar volar tu creatividad entre copos de nieve, renos risueños y luces centelleantes. Cada palabra que escribas será como un regalo bajo el árbol: especial,
                brillante y lleno de emoción.

                Así que ajusta tu gorro navideño, toma tu pluma digital y… ¡comencemos a escribir juntos una historia que hará sonar las campanas del espíritu navideño en cada rincón del mundo!

                🎄✨ ¡Ho, ho, ho! ¡La magia de la Navidad está a punto de comenzar!</p>
            <div>
                <input
                    type="text"
                    placeholder="Inicia tu historia..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ padding: "0.5rem", width: "60%" }}
                />
                <button onClick={handleSend} disabled={loading} style={{ marginLeft: "1rem" }}>
                    {loading ? "Pensando" : "Enviar"}
                </button>
                <p style={{ marginTop: "1rem" }}>{reply}</p>
            </div>
        </div>
    )

}

