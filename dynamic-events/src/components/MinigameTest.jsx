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
    snowflakeCount: 5,
    itemsToSpawn: 3,
  },
  assets = {
    player: "/images/sled.png",
    items: ["gift1.png", "gift2.png", "gift3.png"],
    particle: "snowflake.png",
    powerups: {
      speed: "powerup-speed.png",
      life: "powerup-heart.png",
      shield: "powerup-star.png",
      slowmo: "powerup-clock.png",
    },
    sounds: {
      catch: "/sounds/catch.ogg",
      hit: "/sounds/hit.ogg",
      music: "/sounds/music.wav",
      gameOver: "/sounds/gameover.wav",
      powerup: "/sounds/powerup.ogg",
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
  const pausedRef = useRef(false);
  const countdownRef = useRef(null);
  const showingGameOverRef = useRef(false);

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
    let lastCountdownUpdate = Date.now();

    // Inicializar referencias
    scoreRef.current = 0;
    livesRef.current = gameConfig.initialLives;
    levelRef.current = 1;
    pausedRef.current = false;
    countdownRef.current = null; // Sin cuenta regresiva al iniciar
    showingGameOverRef.current = false;

    // Actualizar estados React
    setCurrentScore(0);
    setCurrentLives(gameConfig.initialLives);
    setCurrentLevel(1);

    // Estado de power-ups activos
    const powerupState = {
      speedBoost: { active: false, endTime: 0 },
      shield: { active: false, endTime: 0 },
      slowmo: { active: false, endTime: 0 },
    };

    // Jugador
    const player = {
      x: width / 2 - 60,
      y: height - 70,
      width: 120,
      height: 60,
      sprite: preloadedAssets.player,
      targetX: width / 2 - 60,
      maxSpeed: 38,
      baseMaxSpeed: 38,
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

    // Tipos de power-ups con probabilidades
    const POWERUP_TYPES = {
      SPEED: {
        type: 'speed',
        duration: 8000,
        image: preloadedAssets.powerups.speed,
        effect: () => {
          player.maxSpeed = player.baseMaxSpeed * 2;
          powerupState.speedBoost.active = true;
          powerupState.speedBoost.endTime = Date.now() + 8000;
        },
        weight: 20,
      },
      LIFE: {
        type: 'life',
        duration: 0,
        image: preloadedAssets.powerups.life,
        effect: () => {
          livesRef.current++;
          setCurrentLives(livesRef.current);
        },
        weight: 40,
      },
      SHIELD: {
        type: 'shield',
        duration: 10000,
        image: preloadedAssets.powerups.shield,
        effect: () => {
          powerupState.shield.active = true;
          powerupState.shield.endTime = Date.now() + 10000;
        },
        weight: 15,
      },
      SLOWMO: {
        type: 'slowmo',
        duration: 7000,
        image: preloadedAssets.powerups.slowmo,
        effect: () => {
          powerupState.slowmo.active = true;
          powerupState.slowmo.endTime = Date.now() + 7000;
        },
        weight: 25,
      }
    };

    // Función para crear item con dificultad PROGRESIVA (velocidad aumenta)
    function createItem() {
      // Dificultad basada en velocidad, no en cantidad
      const levelMultiplier = 0.5; // Incremento de velocidad por nivel
      const baseSpeed = gameConfig.itemSpeed + (levelRef.current * levelMultiplier);
      const minorVariation = Math.random() * 0.2; // Variación mínima
      
      return {
        x: Math.random() * (width - 40),
        y: -40,
        speed: baseSpeed + minorVariation,
        size: 40,
        img: preloadedAssets.items[
          Math.floor(Math.random() * preloadedAssets.items.length)
        ],
      };
    }

    // Función para crear power-up con sistema de pesos
    function createPowerup() {
      const types = Object.values(POWERUP_TYPES);
      const totalWeight = types.reduce((sum, type) => sum + type.weight, 0);
      let random = Math.random() * totalWeight;
      
      let selectedType = types[0];
      for (const type of types) {
        random -= type.weight;
        if (random <= 0) {
          selectedType = type;
          break;
        }
      }
      
      return {
        x: Math.random() * (width - 50),
        y: -50,
        speed: 2 + Math.random() * 1.5,
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

    // Items iniciales (cantidad fija, no aumenta por nivel)
    const initialItems = gameConfig.itemsToSpawn;
    for (let i = 0; i < initialItems; i++) {
      items.push(createItem());
    }

    // Movimiento del mouse
    const handleMouseMove = (e) => {
      if (pausedRef.current || countdownRef.current !== null) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      player.targetX = Math.max(0, Math.min(mouseX - player.width / 2, width - player.width));
    };

    // Manejo de pausa con ESC y reinicio con R
    const handleKeyDown = (e) => {
      if (countdownRef.current !== null) return;
      
      if (e.key === "Escape" || e.key === "Esc") {
        if (!pausedRef.current) {
          pausedRef.current = true;
          sounds.music.pause();
        } else {
          countdownRef.current = 3;
          lastCountdownUpdate = Date.now();
          pausedRef.current = false;
          sounds.music.play().catch(() => {});
        }
      } else if ((e.key === "r" || e.key === "R") && pausedRef.current) {
        running = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("keydown", handleKeyDown);
        sounds.music.pause();
        
        setGameKey((k) => k + 1);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);

    // Fin del juego
    function endGame() {
      running = false;
      showingGameOverRef.current = true;
      sounds.music.pause();
      sounds.gameOver.currentTime = 0;
      sounds.gameOver.play();
      
      setTimeout(() => {
        setFinalScore(scoreRef.current);
        setGameState("gameover");
        onGameOver({ 
          score: scoreRef.current, 
          level: levelRef.current, 
          lives: 0 
        });
      }, 2000);
    }

    // Verificar y actualizar power-ups
    function checkPowerupExpiration() {
      const now = Date.now();
      
      if (powerupState.speedBoost.active && now >= powerupState.speedBoost.endTime) {
        powerupState.speedBoost.active = false;
        player.maxSpeed = player.baseMaxSpeed;
      }
      
      if (powerupState.shield.active && now >= powerupState.shield.endTime) {
        powerupState.shield.active = false;
      }
      
      if (powerupState.slowmo.active && now >= powerupState.slowmo.endTime) {
        powerupState.slowmo.active = false;
      }
    }

    // Spawn de power-ups más frecuente
    let lastPowerupSpawn = Date.now();
    function trySpawnPowerup() {
      const now = Date.now();
      const spawnInterval = 8000 - (levelRef.current * 200); // Más frecuente (antes 12000)
      const minInterval = 4000; // Mínimo 4 segundos (antes 6000)
      
      if (now - lastPowerupSpawn > Math.max(spawnInterval, minInterval)) {
        if (Math.random() < 0.8 && powerups.length < 2) { // 80% probabilidad (antes 70%)
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

      // Actualizar cuenta regresiva
      if (countdownRef.current !== null) {
        const now = Date.now();
        if (now - lastCountdownUpdate >= 1000) {
          countdownRef.current--;
          lastCountdownUpdate = now;
          
          if (countdownRef.current < 0) {
            countdownRef.current = null;
          }
        }
      }

      const isCountingDown = countdownRef.current !== null && countdownRef.current >= 0;
      const shouldFreeze = pausedRef.current || isCountingDown;

      if (shouldFreeze) {
        // Dibujar elementos estáticos
        particles.forEach((p) => {
          ctx.drawImage(preloadedAssets.particle, p.x, p.y, p.size, p.size);
        });

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
        ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);

        powerups.forEach((powerup) => {
          ctx.save();
          ctx.shadowBlur = 20;
          ctx.shadowColor = "yellow";
          ctx.drawImage(powerup.img, powerup.x, powerup.y, powerup.size, powerup.size);
          ctx.restore();
        });

        items.forEach((item) => {
          ctx.drawImage(item.img, item.x, item.y, item.size, item.size);
        });

        // UI
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.fillText(`🎁 Puntaje: ${scoreRef.current}`, 15, 30);
        ctx.fillText(`❤️ Vidas: ${livesRef.current}`, 15, 60);
        ctx.fillText(`🔥 Nivel: ${levelRef.current}`, 15, 90);

        // Cuenta regresiva
        if (isCountingDown && countdownRef.current > 0) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0, 0, width, height);
          
          ctx.fillStyle = "white";
          ctx.font = "bold 120px Arial";
          ctx.textAlign = "center";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 6;
          ctx.shadowBlur = 30;
          ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
          ctx.strokeText(countdownRef.current, width / 2, height / 2);
          ctx.fillText(countdownRef.current, width / 2, height / 2);
          ctx.textAlign = "left";
          ctx.shadowBlur = 0;
        }

        // Menú de pausa
        if (pausedRef.current && !isCountingDown) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(0, 0, width, height);
          
          ctx.fillStyle = "white";
          ctx.font = "bold 48px Arial";
          ctx.textAlign = "center";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 4;
          ctx.strokeText("PAUSA", width / 2, height / 2 - 80);
          ctx.fillText("PAUSA", width / 2, height / 2 - 80);
          
          // Botón Reanudar
          const resumeButtonY = height / 2 - 20;
          ctx.fillStyle = "rgba(0, 200, 0, 0.8)";
          ctx.fillRect(width / 2 - 120, resumeButtonY, 240, 50);
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.strokeRect(width / 2 - 120, resumeButtonY, 240, 50);
          
          ctx.fillStyle = "white";
          ctx.font = "bold 24px Arial";
          ctx.fillText("▶️ Presiona ESC", width / 2, resumeButtonY + 33);
          
          // Botón Reiniciar
          const restartButtonY = height / 2 + 50;
          ctx.fillStyle = "rgba(200, 0, 0, 0.8)";
          ctx.fillRect(width / 2 - 120, restartButtonY, 240, 50);
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.strokeRect(width / 2 - 120, restartButtonY, 240, 50);
          
          ctx.fillStyle = "white";
          ctx.font = "bold 24px Arial";
          ctx.fillText("🔄 Presiona R", width / 2, restartButtonY + 33);
          
          ctx.textAlign = "left";
        }

        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Lógica del juego (solo si no está congelado)
      checkPowerupExpiration();
      trySpawnPowerup();

      particles.forEach((p) => {
        ctx.drawImage(preloadedAssets.particle, p.x, p.y, p.size, p.size);
        p.y += p.speed;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      const diff = player.targetX - player.x;
      const distance = Math.abs(diff);
      const direction = Math.sign(diff);
      const actualSpeed = Math.min(distance, player.maxSpeed);
      player.x += actualSpeed * direction * 0.25;

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

      ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);

      const speedMultiplier = powerupState.slowmo.active ? 0.5 : 1;

      powerups.forEach((powerup, i) => {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = "yellow";
        ctx.drawImage(powerup.img, powerup.x, powerup.y, powerup.size, powerup.size);
        ctx.restore();
        
        powerup.y += powerup.speed * speedMultiplier;

        if (
          powerup.y + powerup.size > player.y &&
          powerup.x < player.x + player.width &&
          powerup.x + powerup.size > player.x
        ) {
          sounds.powerup.currentTime = 0;
          sounds.powerup.play();
          powerup.data.effect();
          powerups.splice(i, 1);
        }

        if (powerup.y > height) {
          powerups.splice(i, 1);
        }
      });

      items.forEach((item, i) => {
        ctx.drawImage(item.img, item.x, item.y, item.size, item.size);
        item.y += item.speed * speedMultiplier;

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
            
            // NO aumentar cantidad de items, solo la velocidad aumenta
          }

          items[i] = createItem();
        }

        if (item.y > height) {
          if (!powerupState.shield.active) {
            sounds.hit.currentTime = 0;
            sounds.hit.play();
            livesRef.current--;
            setCurrentLives(livesRef.current);
          }
          
          items[i] = createItem();
        }
      });

      // UI
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`🎁 Puntaje: ${scoreRef.current}`, 15, 30);
      ctx.fillText(`❤️ Vidas: ${livesRef.current}`, 15, 60);
      ctx.fillText(`🔥 Nivel: ${levelRef.current}`, 15, 90);

      // Power-ups activos
      const now = Date.now();
      let powerupY = 30;
      const powerupSize = 50;
      const powerupSpacing = 70;
      
      if (powerupState.speedBoost.active && powerupState.speedBoost.endTime > now) {
        const remaining = Math.ceil((powerupState.speedBoost.endTime - now) / 1000);
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "yellow";
        ctx.drawImage(preloadedAssets.powerups.speed, width - powerupSize - 15, powerupY, powerupSize, powerupSize);
        ctx.restore();
        
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
        ctx.drawImage(preloadedAssets.powerups.shield, width - powerupSize - 15, powerupY, powerupSize, powerupSize);
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
        ctx.drawImage(preloadedAssets.powerups.slowmo, width - powerupSize - 15, powerupY, powerupSize, powerupSize);
        ctx.restore();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
        ctx.fillText(remaining + "s", width - powerupSize / 2 - 10, powerupY + powerupSize + 18);
      }

      if (livesRef.current <= 0 && !showingGameOverRef.current) {
        endGame();
      }

      if (showingGameOverRef.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "#FF0000";
        ctx.font = "bold 72px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 6;
        ctx.strokeText("GAME OVER", width / 2, height / 2);
        ctx.fillText("GAME OVER", width / 2, height / 2);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.strokeText(`Puntaje Final: ${scoreRef.current}`, width / 2, height / 2 + 60);
        ctx.fillText(`Puntaje Final: ${scoreRef.current}`, width / 2, height / 2 + 60);
        ctx.textAlign = "left";
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      running = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      sounds.music.pause();
    };
  }, [gameState, gameKey]);

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

      {gameState === "playing" && (
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#888" }}>
          Presiona ESC para pausar
        </p>
      )}
    </div>
  );
}

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