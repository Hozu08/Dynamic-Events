import { useEffect, useRef, useState } from "react";

export function MinigameTest() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle"); 
  // 'idle' = esperando inicio, 'playing' = jugando, 'gameover' = perdido
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let running = true;

    // --- Configuración del juego ---
    let score = 0;
    let lives = 5;
    let level = 1;

    const player = {
      x: 180,
      y: 330,
      width: 60,
      height: 60,
      sprite: new Image(),
    };
    player.sprite.src = "/images/sled.png";

    // Regalos
    const giftImages = ["gift1.png", "gift2.png", "gift3.png"].map((g) => {
      const img = new Image();
      img.src = "/images/" + g;
      return img;
    });

    // Nieve
    const snowImg = new Image();
    snowImg.src = "/images/snowflake.png";

    // Sonidos
    const catchSound = new Audio("/sounds/catch.ogg");
    const hitSound = new Audio("/sounds/hit.ogg");
    const music = new Audio("/sounds/music.wav");
    const gameOverSound = new Audio("/sounds/gameover.wav");

    music.loop = true;
    music.volume = 0.5;
    music.play().catch(() => {});


    // --- Objetos dinámicos ---
    const gifts = [];
    const snowflakes = [];

    function createGift() {
      return {
        x: Math.random() * 360,
        y: -40,
        speed: 1 + Math.random() * (1 + level),
        size: 40,
        img: giftImages[Math.floor(Math.random() * giftImages.length)],
      };
    }

    // Nieve
    for (let i = 0; i < 40; i++) {
      snowflakes.push({
        x: Math.random() * 400,
        y: Math.random() * 400,
        speed: 0.5 + Math.random() * 1.5,
        size: 20 + Math.random() * 20,
      });
    }

    // Regalos iniciales
    for (let i = 0; i < 3; i++) gifts.push(createGift());

    // Movimiento del mouse
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      player.x = x - player.width / 2;
    };
    window.addEventListener("mousemove", handleMouseMove);


    function endGame() {
      running = false;
      music.pause();
      gameOverSound.currentTime = 0;
      gameOverSound.play();
      setGameState("gameover");
    }

    // Bucle del juego
    function gameLoop() {
      if (!running) return;

      ctx.clearRect(0, 0, 400, 400);

      // Fondo gradiente
      const bg = ctx.createLinearGradient(0, 0, 0, 400);
      bg.addColorStop(0, "#002");
      bg.addColorStop(1, "#034");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 400, 400);

      // ❄ Nieve
      snowflakes.forEach((s) => {
        ctx.drawImage(snowImg, s.x, s.y, s.size, s.size);
        s.y += s.speed;
        if (s.y > 400) {
          s.y = -20;
          s.x = Math.random() * 400;
        }
      });

      // 🎅 Santa
      ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);

      // 🎁 Regalos
      gifts.forEach((gift, i) => {
        ctx.drawImage(gift.img, gift.x, gift.y, gift.size, gift.size);
        gift.y += gift.speed;

        // Colisión
        if (
          gift.y + gift.size > player.y &&
          gift.x < player.x + player.width &&
          gift.x + gift.size > player.x
        ) {
          catchSound.currentTime = 0;
          catchSound.play();
          score++;

          // Subir nivel cada 10 puntos
          if (score % 10 === 0) level++;

          gifts[i] = createGift();
        }

        // Pierde vida
        if (gift.y > 400) {
          hitSound.currentTime = 0;
          hitSound.play();
          lives--;

          gifts[i] = createGift();
        }
      });

      // UI
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`🎁 Puntaje: ${score}`, 10, 25);
      ctx.fillText(`❤️ Vidas: ${lives}`, 10, 50);
      ctx.fillText(`🔥 Nivel: ${level}`, 10, 75);

      if (lives <= 0) {
        endGame();
        return;
      }

      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // Limpieza
    return () => {
      running = false;
      window.removeEventListener("mousemove", handleMouseMove);
      music.pause();
    };
  }, [gameState, gameKey]);

  // --- UI ---

  return (
    <div className="flex flex-col items-center mt-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{
          background: "#012",
          border: "3px solid #fff",
          borderRadius: "10px",
        }}
      />

      {/* BOTÓN INICIO */}
      {gameState === "idle" && (
        <button
          onClick={() => setGameState("playing")}
          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg"
        >
          🎄 Iniciar Juego
        </button>
      )}

      {/* BOTÓN REINICIAR */}
      {gameState === "gameover" && (
        <button
          onClick={() => {
            setGameKey((k) => k + 1);
            setGameState("playing");
          }}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg"
        >
          🔁 Reiniciar Juego
        </button>
      )}
    </div>
  );
}
