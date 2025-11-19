import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/game.css";

/**
 * CanvasGame - Componente reutilizable de juego en canvas
 */
export function CanvasGame({
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
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLives, setCurrentLives] = useState(gameConfig.initialLives);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  // Referencias para evitar re-renders
  const scoreRef = useRef(0);
  const livesRef = useRef(gameConfig.initialLives);
  const levelRef = useRef(1);

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
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let running = true;
    let animationFrameId;

    // Inicializar referencias
    scoreRef.current = 0;
    livesRef.current = gameConfig.initialLives;
    levelRef.current = 1;

    // Actualizar estados React
    setCurrentScore(0);
    setCurrentLives(gameConfig.initialLives);
    setCurrentLevel(1);

    // Jugador
    const player = {
      x: width / 2 - 60,
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
        speed: gameConfig.itemSpeed + Math.random() * (1 + levelRef.current * 0.5),
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

    // Movimiento del mouse - GLOBAL
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      // Permite controlar incluso si el mouse está fuera del canvas
      player.x = Math.max(
        0,
        Math.min(x - player.width / 2, width - player.width)
      );
    };

    // Evento global en document
    document.addEventListener("mousemove", handleMouseMove);

    // Fin del juego
    function endGame() {
      running = false;
      sounds.music.pause();
      sounds.gameOver.currentTime = 0;
      sounds.gameOver.play();
      setFinalScore(scoreRef.current);
      setGameState("gameover");
      onGameOver({ 
        score: scoreRef.current, 
        level: levelRef.current, 
        lives: 0 
      });
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
          
          // Incrementar score usando ref
          scoreRef.current++;
          
          // Actualizar estado React (no causa re-render del useEffect)
          setCurrentScore(scoreRef.current);
          onScoreChange(scoreRef.current);

          // Subir nivel cada 10 puntos
          if (scoreRef.current % 10 === 0) {
            levelRef.current++;
            setCurrentLevel(levelRef.current);
          }

          items[i] = createItem();
        }

        // Item perdido
        if (item.y > height) {
          sounds.hit.currentTime = 0;
          sounds.hit.play();
          
          livesRef.current--;
          setCurrentLives(livesRef.current);
          
          items[i] = createItem();
        }
      });

      // UI en el canvas
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`🎁 Puntaje: ${scoreRef.current}`, 15, 30);
      ctx.fillText(`❤️ Vidas: ${livesRef.current}`, 15, 60);
      ctx.fillText(`🔥 Nivel: ${levelRef.current}`, 15, 90);

      if (livesRef.current <= 0) {
        endGame();
        return;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // Limpieza
    return () => {
      running = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      sounds.music.pause();
    };
  }, [gameState, gameKey]); // Solo estas dependencias

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

      {/* Stats en vivo (fuera del canvas) */}
      {gameState === "playing" && (
        <div className="game-live-stats">
          <div className="game-live-stat">
            <span className="game-live-stat__label">Puntaje</span>
            <span className="game-live-stat__value">{currentScore}</span>
          </div>
          <div className="game-live-stat">
            <span className="game-live-stat__label">Vidas</span>
            <span className="game-live-stat__value">{currentLives}</span>
          </div>
          <div className="game-live-stat">
            <span className="game-live-stat__label">Nivel</span>
            <span className="game-live-stat__value">{currentLevel}</span>
          </div>
        </div>
      )}

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
              ¡Juego terminado! Tu puntaje final: <strong>{finalScore}</strong>
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

// Componente específico del minijuego navideño
export function MinigameTest({ onGameOver, onScoreChange }) {
  return (
    <CanvasGame
      title=""
      description=""
      theme="christmas"
      onGameOver={onGameOver}
      onScoreChange={onScoreChange}
    />
  );
}