import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/game.css";

/**
 * CanvasGame - Componente reutilizable de juego en canvas
 */
export function CanvasGame({
  width = 600,
  height = 700,
  title = "Minijuego",
  description = "¡Juega y diviértete!",
  gameConfig = {
    initialLives: 5,
    itemSpeed: 1,
    snowflakeCount: 20,
    itemsToSpawn: 2,
  },
  assets = {
    player: "/images/sled.png",
    items: ["gift1.png", "gift2.png", "gift3.png"],
    particle: "snowflake.png",
    powerups: {
      speed: "powerup-speed.png",      // Rayo o cohete
      life: "powerup-heart.png",        // Corazón
      shield: "powerup-star.png",       // Estrella
      slowmo: "powerup-clock.png",      // Reloj
    },
    sounds: {
      catch: "/sounds/catch.ogg",
      hit: "/sounds/hit.ogg",
      music: "/sounds/music.wav",
      gameOver: "/sounds/gameover.wav",
      powerup: "/sounds/powerup.ogg",   // Sonido para power-ups
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
  const [activePowerups, setActivePowerups] = useState([]);

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

    // Precargar imágenes de power-ups
    const powerupImages = {
      speed: new Image(),
      life: new Image(),
      shield: new Image(),
      slowmo: new Image(),
    };
    powerupImages.speed.src = `/images/${assets.powerups.speed}`;
    powerupImages.life.src = `/images/${assets.powerups.life}`;
    powerupImages.shield.src = `/images/${assets.powerups.shield}`;
    powerupImages.slowmo.src = `/images/${assets.powerups.slowmo}`;

    return {
      player: playerImg,
      items: itemImages,
      particle: particleImg,
      powerups: powerupImages,
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
    setActivePowerups([]);

    // Estado de power-ups activos
    const powerupState = {
      speedBoost: { active: false, endTime: 0 },
      shield: { active: false, endTime: 0 },
      slowmo: { active: false, endTime: 0 },
    };

    // Jugador con propiedades de suavizado y velocidad limitada
    const player = {
      x: width / 2 - 60,
      y: height - 70,
      width: 120,
      height: 60,
      sprite: preloadedAssets.player,
      targetX: width / 2 - 60,
      maxSpeed: 38,
      baseMaxSpeed: 38, // Velocidad base para restaurar
    };

    // Sonidos
    const sounds = {
      catch: new Audio(assets.sounds.catch),
      hit: new Audio(assets.sounds.hit),
      music: new Audio(assets.sounds.music),
      gameOver: new Audio(assets.sounds.gameOver),
      powerup: assets.sounds.powerup ? new Audio(assets.sounds.powerup) : new Audio(assets.sounds.catch),
    };

    sounds.music.loop = true;
    sounds.music.volume = 0.5;
    sounds.music.play().catch(() => {});

    // Items, power-ups y partículas
    const items = [];
    const powerups = [];
    const particles = [];

    // Tipos de power-ups
    const POWERUP_TYPES = {
      SPEED: {
        type: 'speed',
        duration: 8000, // 8 segundos
        image: preloadedAssets.powerups.speed,
        effect: () => {
          player.maxSpeed = player.baseMaxSpeed * 2;
          powerupState.speedBoost.active = true;
          powerupState.speedBoost.endTime = Date.now() + 8000;
          updateActivePowerups();
        },
        icon: '⚡',
        name: 'Velocidad x2'
      },
      LIFE: {
        type: 'life',
        duration: 0, // Instantáneo
        image: preloadedAssets.powerups.life,
        effect: () => {
          livesRef.current++;
          setCurrentLives(livesRef.current);
        },
        icon: '❤️',
        name: 'Vida Extra'
      },
      SHIELD: {
        type: 'shield',
        duration: 10000, // 10 segundos
        image: preloadedAssets.powerups.shield,
        effect: () => {
          powerupState.shield.active = true;
          powerupState.shield.endTime = Date.now() + 10000;
          updateActivePowerups();
        },
        icon: '⭐',
        name: 'Escudo'
      },
      SLOWMO: {
        type: 'slowmo',
        duration: 7000, // 7 segundos
        image: preloadedAssets.powerups.slowmo,
        effect: () => {
          powerupState.slowmo.active = true;
          powerupState.slowmo.endTime = Date.now() + 7000;
          updateActivePowerups();
        },
        icon: '⏰',
        name: 'Cámara Lenta'
      }
    };

    // Actualizar lista de power-ups activos
    function updateActivePowerups() {
      const active = [];
      const now = Date.now();
      
      if (powerupState.speedBoost.active && powerupState.speedBoost.endTime > now) {
        active.push({
          name: POWERUP_TYPES.SPEED.name,
          icon: POWERUP_TYPES.SPEED.icon,
          remaining: Math.ceil((powerupState.speedBoost.endTime - now) / 1000)
        });
      }
      
      if (powerupState.shield.active && powerupState.shield.endTime > now) {
        active.push({
          name: POWERUP_TYPES.SHIELD.name,
          icon: POWERUP_TYPES.SHIELD.icon,
          remaining: Math.ceil((powerupState.shield.endTime - now) / 1000)
        });
      }
      
      if (powerupState.slowmo.active && powerupState.slowmo.endTime > now) {
        active.push({
          name: POWERUP_TYPES.SLOWMO.name,
          icon: POWERUP_TYPES.SLOWMO.icon,
          remaining: Math.ceil((powerupState.slowmo.endTime - now) / 1000)
        });
      }
      
      setActivePowerups(active);
    }

    // Función para crear item con dificultad progresiva
    function createItem() {
      const baseSpeed = gameConfig.itemSpeed + (levelRef.current * 0.3);
      const randomVariation = Math.random() * (1 + levelRef.current * 0.4);
      
      return {
        x: Math.random() * (width - 40),
        y: -40,
        speed: baseSpeed + randomVariation,
        size: 40,
        img: preloadedAssets.items[
          Math.floor(Math.random() * preloadedAssets.items.length)
        ],
      };
    }

    // Función para crear power-up
    function createPowerup() {
      const types = Object.values(POWERUP_TYPES);
      const selectedType = types[Math.floor(Math.random() * types.length)];
      
      return {
        x: Math.random() * (width - 50),
        y: -50,
        speed: 2 + Math.random() * 2,
        size: 50,
        type: selectedType.type,
        img: selectedType.image,
        data: selectedType,
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
    const initialItems = Math.min(gameConfig.itemsToSpawn + Math.floor(levelRef.current / 2), 6);
    for (let i = 0; i < initialItems; i++) {
      items.push(createItem());
    }

    // Movimiento del mouse - GLOBAL con suavizado
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      player.targetX = Math.max(
        0,
        Math.min(mouseX - player.width / 2, width - player.width)
      );
    };

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

    // Verificar y actualizar power-ups
    function checkPowerupExpiration() {
      const now = Date.now();
      
      // Speed boost
      if (powerupState.speedBoost.active && now >= powerupState.speedBoost.endTime) {
        powerupState.speedBoost.active = false;
        player.maxSpeed = player.baseMaxSpeed;
      }
      
      // Shield
      if (powerupState.shield.active && now >= powerupState.shield.endTime) {
        powerupState.shield.active = false;
      }
      
      // Slowmo
      if (powerupState.slowmo.active && now >= powerupState.slowmo.endTime) {
        powerupState.slowmo.active = false;
      }
      
      updateActivePowerups();
    }

    // Spawn de power-ups aleatorios
    let lastPowerupSpawn = Date.now();
    function trySpawnPowerup() {
      const now = Date.now();
      const spawnInterval = 15000 - (levelRef.current * 500); // Más frecuente por nivel
      const minInterval = 8000; // Mínimo 8 segundos
      
      if (now - lastPowerupSpawn > Math.max(spawnInterval, minInterval)) {
        if (Math.random() < 0.6 && powerups.length < 2) { // 60% probabilidad
          powerups.push(createPowerup());
          lastPowerupSpawn = now;
        }
      }
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

      // Verificar expiración de power-ups
      checkPowerupExpiration();
      
      // Intentar spawn de power-up
      trySpawnPowerup();

      // Partículas
      particles.forEach((p) => {
        ctx.drawImage(preloadedAssets.particle, p.x, p.y, p.size, p.size);
        p.y += p.speed;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      // Actualizar posición del jugador con suavizado
      const diff = player.targetX - player.x;
      const distance = Math.abs(diff);
      const direction = Math.sign(diff);
      const actualSpeed = Math.min(distance, player.maxSpeed);
      player.x += actualSpeed * direction * 0.25;

      // Efecto visual de escudo
      if (powerupState.shield.active) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 215, 0, 0.8)";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "gold";
        ctx.beginPath();
        ctx.arc(
          player.x + player.width / 2,
          player.y + player.height / 2,
          Math.max(player.width, player.height) / 2 + 10,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }

      // Jugador
      ctx.drawImage(
        player.sprite,
        player.x,
        player.y,
        player.width,
        player.height
      );

      // Calcular multiplicador de velocidad por slowmo
      const speedMultiplier = powerupState.slowmo.active ? 0.5 : 1;

      // Power-ups
      powerups.forEach((powerup, i) => {
        // Dibujar con efecto de brillo
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = "yellow";
        ctx.drawImage(powerup.img, powerup.x, powerup.y, powerup.size, powerup.size);
        ctx.restore();
        
        powerup.y += powerup.speed * speedMultiplier;

        // Colisión con jugador
        if (
          powerup.y + powerup.size > player.y &&
          powerup.x < player.x + player.width &&
          powerup.x + powerup.size > player.x
        ) {
          sounds.powerup.currentTime = 0;
          sounds.powerup.play();
          
          // Aplicar efecto del power-up
          powerup.data.effect();
          
          powerups.splice(i, 1);
        }

        // Power-up perdido
        if (powerup.y > height) {
          powerups.splice(i, 1);
        }
      });

      // Items
      items.forEach((item, i) => {
        ctx.drawImage(item.img, item.x, item.y, item.size, item.size);
        item.y += item.speed * speedMultiplier;

        // Colisión con jugador
        if (
          item.y + item.size > player.y &&
          item.x < player.x + player.width &&
          item.x + item.size > player.x
        ) {
          sounds.catch.currentTime = 0;
          sounds.catch.play();
          
          scoreRef.current++;
          setCurrentScore(scoreRef.current);
          onScoreChange(scoreRef.current);

          if (scoreRef.current % 10 === 0) {
            levelRef.current++;
            setCurrentLevel(levelRef.current);
            
            const maxItems = Math.min(
              gameConfig.itemsToSpawn + Math.floor(levelRef.current / 2), 
              8
            );
            if (items.length < maxItems) {
              items.push(createItem());
            }
          }

          items[i] = createItem();
        }

        // Item perdido
        if (item.y > height) {
          // Si tiene escudo, no pierde vida
          if (!powerupState.shield.active) {
            sounds.hit.currentTime = 0;
            sounds.hit.play();
            livesRef.current--;
            setCurrentLives(livesRef.current);
          }
          
          items[i] = createItem();
        }
      });

      // UI en el canvas
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`🎁 Puntaje: ${scoreRef.current}`, 15, 30);
      ctx.fillText(`❤️ Vidas: ${livesRef.current}`, 15, 60);
      ctx.fillText(`🔥 Nivel: ${levelRef.current}`, 15, 90);

      // Mostrar power-ups activos en el lateral derecho
      const now = Date.now();
      let powerupY = 30;
      const powerupSize = 50;
      const powerupSpacing = 70;
      
      if (powerupState.speedBoost.active && powerupState.speedBoost.endTime > now) {
        const remaining = Math.ceil((powerupState.speedBoost.endTime - now) / 1000);
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "yellow";
        ctx.drawImage(
          preloadedAssets.powerups.speed,
          width - powerupSize - 15,
          powerupY,
          powerupSize,
          powerupSize
        );
        ctx.restore();
        
        // Temporizador
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
        ctx.fillText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
        
        powerupY += powerupSpacing;
      }
      
      if (powerupState.shield.active && powerupState.shield.endTime > now) {
        const remaining = Math.ceil((powerupState.shield.endTime - now) / 1000);
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "gold";
        ctx.drawImage(
          preloadedAssets.powerups.shield,
          width - powerupSize - 15,
          powerupY,
          powerupSize,
          powerupSize
        );
        ctx.restore();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
        ctx.fillText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
        
        powerupY += powerupSpacing;
      }
      
      if (powerupState.slowmo.active && powerupState.slowmo.endTime > now) {
        const remaining = Math.ceil((powerupState.slowmo.endTime - now) / 1000);
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "cyan";
        ctx.drawImage(
          preloadedAssets.powerups.slowmo,
          width - powerupSize - 15,
          powerupY,
          powerupSize,
          powerupSize
        );
        ctx.restore();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
        ctx.fillText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
        
        powerupY += powerupSpacing;
      }

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
  }, [gameState, gameKey]);

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
      {title && <h1 className="game-title">{title}</h1>}
      {description && <p className="game-description">{description}</p>}

      {/* Stats en vivo */}
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



      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`game-canvas game-canvas--${theme}`}
      />

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