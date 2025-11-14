import { useEffect, useRef } from "react";

export function MinigameTest() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(0);
  const giftsRef = useRef([]);
  const playerRef = useRef({ x: 150, y: 350, width: 60, height: 40 });
  const gameOverRef = useRef(false);

  // Carga sonido
  const catchSound = new Audio("/sounds/catch.ogg");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const giftImg = new Image();
    giftImg.src = "/images/gift.png";

    const bgGradient = ctx.createLinearGradient(0, 0, 0, 400);
    bgGradient.addColorStop(0, "#003");
    bgGradient.addColorStop(1, "#036");

    // Crear regalos iniciales
    for (let i = 0; i < 3; i++) {
      giftsRef.current.push(createGift());
    }

    let animationId;

    function createGift() {
      return {
        x: Math.random() * 340,
        y: -40,
        speed: 1 + Math.random() * 2,
        size: 40,
      };
    }

    // Movimiento jugador
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      playerRef.current.x = x - 30;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Bucle del juego
    function gameLoop() {
      if (gameOverRef.current) return;

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 400, 400);

      // Jugador
      ctx.fillStyle = "white";
      ctx.fillRect(
        playerRef.current.x,
        playerRef.current.y,
        playerRef.current.width,
        playerRef.current.height
      );

      // Actualizar regalos
      giftsRef.current.forEach((gift, index) => {
        gift.y += gift.speed;

        // Dibujar regalo
        if (giftImg.complete) {
          ctx.drawImage(giftImg, gift.x, gift.y, gift.size, gift.size);
        } else {
          ctx.fillStyle = "red";
          ctx.fillRect(gift.x, gift.y, gift.size, gift.size);
        }

        // Colisión
        if (
          gift.y + gift.size > playerRef.current.y &&
          gift.x < playerRef.current.x + playerRef.current.width &&
          gift.x + gift.size > playerRef.current.x
        ) {
          scoreRef.current++;
          catchSound.currentTime = 0;
          catchSound.play();
          giftsRef.current[index] = createGift();
        }

        // Si un regalo cae → fin
        if (gift.y > 400) {
          gameOverRef.current = true;
        }
      });

      // Puntuación
      ctx.fillStyle = "gold";
      ctx.font = "20px Arial";
      ctx.fillText(`Puntaje: ${scoreRef.current}`, 10, 25);

      // Game over
      if (gameOverRef.current) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("🎅 GAME OVER 🎄", 70, 200);
        cancelAnimationFrame(animationId);
        return;
      }

      animationId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
      <p className="text-white mt-2 text-lg font-semibold">
        Mueve el mouse para atrapar los regalos 🎁
      </p>
    </div>
  );
}
