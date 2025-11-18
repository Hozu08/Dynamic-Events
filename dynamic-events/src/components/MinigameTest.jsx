import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/game.css";

/**
 * CanvasGame - Componente reutilizable de juego en canvas
 * 
 * @param {Object} props
 * @param {number} props.width - Ancho del canvas
 * @param {number} props.height - Alto del canvas
 * @param {string} props.title - Título del juego
 * @param {string} props.description - Descripción del juego
 * @param {Object} props.gameConfig - Configuración del juego
 * @param {Object} props.assets - Rutas de assets (imágenes, sonidos)
 * @param {Function} props.onGameOver - Callback cuando termina el juego
 * @param {Function} props.onScoreChange - Callback cuando cambia el score
 * @param {string} props.theme - Tema visual
 */
export function CanvasGame({
  //Medidas del canva
  width = 700,
  height = 700,
  title = "Minijuego", 
  description = "¡Juega y diviértete!",
  gameConfig = {
    initialLives: 5,
    itemSpeed: 1,
    snowflakeCount: 40,
    itemsToSpawn: 3,
  },
  assets = {
    player: "/images/sled.png",
    items: ["gift1.png", "gift2.png", "gift3.png"],
    particle: "snowflake.png",
    sounds: {
      catch: "/sounds/catch.ogg",
      hit: "/sounds/hit.ogg",
      music: "/sounds/music.wav",
      gameOver: "/sounds/gameover.wav",
    },
  },
  onGameOver = () => {},
  onScoreChange = () => {},
  theme = "dark",
}) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  // Precarga de imágenes
  const preloadedAssets = useMemo(() => {
    const playerImg = new Image();
    playerImg.src = assets.player;

    const itemImages = assets.items.map((item) => {
      const img = new Image();
      img.src = `/images/${item}`;
      return img;
    });

    const particleImg = new Image();
    particleImg.src = `/images/${assets.particle}`;

    return {
      player: playerImg,
      items: itemImages,
      particle: particleImg,
    };
  }, [assets]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let running = true;

    // Estado del juego
    let score = 0;
    let lives = gameConfig.initialLives;
    let level = 1;

    // Jugador
    const player = {
      x: width / 2 - 30,
      y: height - 70,
      width: 120,
      height: 60,
      sprite: preloadedAssets.player,
    };

    // Sonidos
    const sounds = {
      catch: new Audio(assets.sounds.catch),
      hit: new Audio(assets.sounds.hit),
      music: new Audio(assets.sounds.music),
      gameOver: new Audio(assets.sounds.gameOver),
    };

    sounds.music.loop = true;
    sounds.music.volume = 0.5;
    sounds.music.play().catch(() => {});

    // Items y partículas
    const items = [];
    const particles = [];

    // Función para crear item
    function createItem() {
      return {
        x: Math.random() * (width - 40),
        y: -40,
        speed: gameConfig.itemSpeed + Math.random() * (1 + level),
        size: 40,
        img: preloadedAssets.items[
          Math.floor(Math.random() * preloadedAssets.items.length)
        ],
      };
    }

    // Crear partículas
    for (let i = 0; i < gameConfig.snowflakeCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 1.5,
        size: 20 + Math.random() * 20,
      });
    }

    // Items iniciales
    for (let i = 0; i < gameConfig.itemsToSpawn; i++) {
      items.push(createItem());
    }

    // Movimiento del mouse
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      player.x = Math.max(
        0,
        Math.min(x - player.width / 2, width - player.width)
      );
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Fin del juego
    function endGame() {
      running = false;
      sounds.music.pause();
      sounds.gameOver.currentTime = 0;
      sounds.gameOver.play();
      setFinalScore(score);
      setGameState("gameover");
      onGameOver({ score, level, lives: 0 });
    }

    // Loop del juego
    function gameLoop() {
      if (!running) return;

      ctx.clearRect(0, 0, width, height);

      // Fondo
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#002");
      bg.addColorStop(1, "#034");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Partículas
      particles.forEach((p) => {
        ctx.drawImage(preloadedAssets.particle, p.x, p.y, p.size, p.size);
        p.y += p.speed;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      // Jugador
      ctx.drawImage(
        player.sprite,
        player.x,
        player.y,
        player.width,
        player.height
      );

      // Items
      items.forEach((item, i) => {
        ctx.drawImage(item.img, item.x, item.y, item.size, item.size);
        item.y += item.speed;

        // Colisión con jugador
        if (
          item.y + item.size > player.y &&
          item.x < player.x + player.width &&
          item.x + item.size > player.x
        ) {
          sounds.catch.currentTime = 0;
          sounds.catch.play();
          score++;
          onScoreChange(score);

          if (score % 10 === 0) level++;

          items[i] = createItem();
        }

        // Item perdido
        if (item.y > height) {
          sounds.hit.currentTime = 0;
          sounds.hit.play();
          lives--;
          items[i] = createItem();
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
      canvas.removeEventListener("mousemove", handleMouseMove);
      sounds.music.pause();
    };
  }, [
    gameState,
    gameKey,
    width,
    height,
    gameConfig,
    preloadedAssets,
    assets.sounds,
    onGameOver,
    onScoreChange,
  ]);

  // Handlers
  const handleStart = () => {
    setGameState("playing");
    setFinalScore(0);
  };

  const handleRestart = () => {
    setGameKey((k) => k + 1);
    setGameState("playing");
    setFinalScore(0);
  };

  return (
    <div className="game-container">
      {/* Título */}
      {title && <h1 className="game-title">{title}</h1>}

      {/* Descripción */}
      {description && <p className="game-description">{description}</p>}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`game-canvas game-canvas--${theme}`}
      />

      {/* Controles */}
      <div className="game-controls">
        {gameState === "idle" && (
          <button
            onClick={handleStart}
            className="game-button game-button--start game-button--animated game-button--pulse"
          >
            🎮 Iniciar Juego
          </button>
        )}

        {gameState === "gameover" && (
          <>
            <p className="game-description">
              ¡Juego terminado! Tu puntaje: <strong>{finalScore}</strong>
            </p>
            <button
              onClick={handleRestart}
              className="game-button game-button--restart game-button--animated"
            >
              🔁 Jugar de nuevo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Componente específico del minijuego navideño (mantiene compatibilidad)
export function MinigameTest() {
  return (
    <CanvasGame
      title="🎄 Atrapa los Regalos Navideños"
      description="¡Mueve el trineo con el mouse y atrapa todos los regalos que puedas!"
      theme="christmas"
      onGameOver={(stats) => console.log("Game Over:", stats)}
      onScoreChange={(score) => console.log("Score:", score)}
    />
  );
}