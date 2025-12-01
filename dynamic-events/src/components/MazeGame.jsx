import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/maze-game.css";

/**
 * MazeGame - Minijuego de laberinto encantado
 * Navegas un laberinto oscuro con una linterna, recolectas dulces y evitas monstruos
 */
export function MazeGame({
  width = 800,
  height = 600,
  title = "Laberinto Encantado",
  description = "¡Navega el laberinto y recolecta todos los dulces!",
  gameConfig = {
    initialLives: 3,
    batteryMax: 100,
    batteryDrainRate: 0.02, // Por frame (reducido para que dure más)
    flashlightRadius: 150,
    playerSpeed: 3,
    monsterSpeed: 0.8, // Reducido para hacerlos más lentos
    candyCount: 15,
    monsterCount: 3,
  },
  onGameOver = () => {},
  onScoreChange = () => {},
  theme = "dark",
}) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle");
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLives, setCurrentLives] = useState(gameConfig.initialLives);
  const [currentBattery, setCurrentBattery] = useState(gameConfig.batteryMax);
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Referencias para evitar re-renders
  const scoreRef = useRef(0);
  const livesRef = useRef(gameConfig.initialLives);
  const batteryRef = useRef(gameConfig.batteryMax);
  const pausedRef = useRef(false);
  const countdownRef = useRef(null);
  const showingGameOverRef = useRef(false);
  const keysRef = useRef({ up: false, down: false, left: false, right: false });
  const playerRef = useRef(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generar laberinto procedural
  const generateMaze = useMemo(() => {
    const cellSize = 40;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
    const maze = Array(rows).fill(null).map(() => Array(cols).fill(1)); // 1 = pared, 0 = pasillo
    
    // Algoritmo de generación simple (recursive backtracking simplificado)
    const stack = [];
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    
    const directions = [
      { dx: 0, dy: -1 }, // arriba
      { dx: 1, dy: 0 },  // derecha
      { dx: 0, dy: 1 },   // abajo
      { dx: -1, dy: 0 }, // izquierda
    ];
    
    function isValid(x, y) {
      return x >= 0 && x < cols && y >= 0 && y < rows;
    }
    
    function getNeighbors(x, y) {
      return directions
        .map(d => ({ x: x + d.dx * 2, y: y + d.dy * 2, dir: d }))
        .filter(n => isValid(n.x, n.y) && !visited[n.y][n.x]);
    }
    
    // Iniciar desde (1, 1)
    let currentX = 1;
    let currentY = 1;
    visited[currentY][currentX] = true;
    maze[currentY][currentX] = 0;
    
    while (true) {
      const neighbors = getNeighbors(currentX, currentY);
      
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push({ x: currentX, y: currentY });
        
        // Remover pared entre current y next
        const wallX = currentX + next.dir.dx;
        const wallY = currentY + next.dir.dy;
        maze[wallY][wallX] = 0;
        maze[next.y][next.x] = 0;
        
        currentX = next.x;
        currentY = next.y;
        visited[currentY][currentX] = true;
      } else if (stack.length > 0) {
        const prev = stack.pop();
        currentX = prev.x;
        currentY = prev.y;
      } else {
        break;
      }
    }
    
    // Asegurar entrada y salida
    maze[1][0] = 0; // Entrada
    maze[rows - 2][cols - 1] = 0; // Salida
    
    return { maze, cellSize, cols, rows };
  }, [width, height, gameKey]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const currentHeight = isMobile ? 700 : height;
    canvas.width = width;
    canvas.height = currentHeight;
    
    const ctx = canvas.getContext("2d");
    let running = true;
    let animationFrameId;

    // Inicializar referencias
    scoreRef.current = 0;
    livesRef.current = gameConfig.initialLives;
    batteryRef.current = gameConfig.batteryMax;
    pausedRef.current = false;
    countdownRef.current = null;
    showingGameOverRef.current = false;
    let lastCountdownUpdate = Date.now();

    // Actualizar estados React
    setCurrentScore(0);
    setCurrentLives(gameConfig.initialLives);
    setCurrentBattery(gameConfig.batteryMax);

    const { maze, cellSize, cols, rows } = generateMaze;

    // Jugador
    const player = {
      x: cellSize * 1.5, // Posición inicial cerca de la entrada
      y: cellSize * 1.5,
      size: cellSize * 0.6,
      speed: gameConfig.playerSpeed,
      color: "#FFD700",
    };
    playerRef.current = player;

    // Dulces
    const candies = [];
    const candyPositions = [];
    
    // Generar posiciones válidas para dulces (en pasillos)
    for (let i = 0; i < gameConfig.candyCount; i++) {
      let attempts = 0;
      let valid = false;
      let candyX, candyY;
      
      while (!valid && attempts < 100) {
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        
        if (maze[row][col] === 0) {
          candyX = col * cellSize + cellSize / 2;
          candyY = row * cellSize + cellSize / 2;
          
          // Verificar que no esté muy cerca del jugador inicial
          const distToPlayer = Math.sqrt(
            Math.pow(candyX - player.x, 2) + Math.pow(candyY - player.y, 2)
          );
          
          if (distToPlayer > cellSize * 3) {
            valid = true;
            candyPositions.push({ x: candyX, y: candyY });
          }
        }
        attempts++;
      }
      
      if (valid) {
        candies.push({
          x: candyX,
          y: candyY,
          size: cellSize * 0.4,
          collected: false,
          color: `hsl(${Math.random() * 60 + 300}, 70%, 60%)`, // Colores rosados/morados
        });
      }
    }

    // Monstruos
    const monsters = [];
    for (let i = 0; i < gameConfig.monsterCount; i++) {
      let attempts = 0;
      let valid = false;
      let monsterX, monsterY;
      
      while (!valid && attempts < 100) {
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        
        if (maze[row][col] === 0) {
          monsterX = col * cellSize + cellSize / 2;
          monsterY = row * cellSize + cellSize / 2;
          
          // Verificar que no esté muy cerca del jugador inicial
          const distToPlayer = Math.sqrt(
            Math.pow(monsterX - player.x, 2) + Math.pow(monsterY - player.y, 2)
          );
          
          if (distToPlayer > cellSize * 5) {
            valid = true;
          }
        }
        attempts++;
      }
      
      if (valid) {
        monsters.push({
          x: monsterX,
          y: monsterY,
          size: cellSize * 0.7,
          speed: gameConfig.monsterSpeed,
          direction: Math.random() * Math.PI * 2,
          color: "#8B0000",
          lastDirectionChange: Date.now(),
        });
      }
    }

    // Sonidos (usar los mismos del otro juego o crear nuevos)
    const sounds = {
      collect: new Audio("/sounds/catch.ogg"),
      hit: new Audio("/sounds/hit.ogg"),
      gameOver: new Audio("/sounds/gameover.wav"),
    };

    // Manejo de teclado
    const handleKeyDown = (e) => {
      if (countdownRef.current !== null) return;
      
      if (e.key === "Escape" || e.key === "Esc") {
        if (!pausedRef.current) {
          pausedRef.current = true;
        } else {
          // Reanudar desde pausa
          countdownRef.current = 3;
          lastCountdownUpdate = Date.now();
          pausedRef.current = false;
        }
      } else if ((e.key === "r" || e.key === "R") && pausedRef.current) {
        // Reiniciar desde pausa
        running = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        canvas.removeEventListener("click", handleCanvasInteraction);
        canvas.removeEventListener("mousemove", handleCanvasInteraction);
        canvas.removeEventListener("touchmove", handleCanvasInteraction);
        canvas.removeEventListener("touchend", handleCanvasInteraction);
        setGameKey((k) => k + 1);
      } else if (!pausedRef.current) {
        // Solo procesar movimiento si no está pausado
        switch (e.key.toLowerCase()) {
          case "w":
          case "arrowup":
            keysRef.current.up = true;
            break;
          case "s":
          case "arrowdown":
            keysRef.current.down = true;
            break;
          case "a":
          case "arrowleft":
            keysRef.current.left = true;
            break;
          case "d":
          case "arrowright":
            keysRef.current.right = true;
            break;
        }
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          keysRef.current.up = false;
          break;
        case "s":
        case "arrowdown":
          keysRef.current.down = false;
          break;
        case "a":
        case "arrowleft":
          keysRef.current.left = false;
          break;
        case "d":
        case "arrowright":
          keysRef.current.right = false;
          break;
      }
    };

    // Verificar colisión con paredes
    function checkWallCollision(newX, newY) {
      const margin = player.size / 2;
      const cellX = Math.floor(newX / cellSize);
      const cellY = Math.floor(newY / cellSize);
      
      // Verificar celda actual y adyacentes
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const checkX = cellX + dx;
          const checkY = cellY + dy;
          
          if (checkX >= 0 && checkX < cols && checkY >= 0 && checkY < rows) {
            if (maze[checkY][checkX] === 1) {
              // Verificar si el jugador está dentro de esta pared
              const wallLeft = checkX * cellSize;
              const wallRight = (checkX + 1) * cellSize;
              const wallTop = checkY * cellSize;
              const wallBottom = (checkY + 1) * cellSize;
              
              if (
                newX - margin < wallRight &&
                newX + margin > wallLeft &&
                newY - margin < wallBottom &&
                newY + margin > wallTop
              ) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }

    // Mover monstruos
    function updateMonsters() {
      monsters.forEach((monster) => {
        // Cambiar dirección ocasionalmente
        if (Date.now() - monster.lastDirectionChange > 2000 + Math.random() * 2000) {
          monster.direction = Math.random() * Math.PI * 2;
          monster.lastDirectionChange = Date.now();
        }
        
        // Mover en la dirección actual
        const newX = monster.x + Math.cos(monster.direction) * monster.speed;
        const newY = monster.y + Math.sin(monster.direction) * monster.speed;
        
        // Verificar colisión con paredes
        const cellX = Math.floor(newX / cellSize);
        const cellY = Math.floor(newY / cellSize);
        
        if (
          cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows &&
          maze[cellY][cellX] === 0
        ) {
          monster.x = newX;
          monster.y = newY;
        } else {
          // Rebote - cambiar dirección
          monster.direction = Math.random() * Math.PI * 2;
        }
      });
    }

    // Detectar colisiones
    function checkCollisions() {
      // Dulces
      candies.forEach((candy) => {
        if (!candy.collected) {
          const dist = Math.sqrt(
            Math.pow(candy.x - player.x, 2) + Math.pow(candy.y - player.y, 2)
          );
          
          if (dist < (player.size / 2 + candy.size / 2)) {
            candy.collected = true;
            scoreRef.current += 10;
            setCurrentScore(scoreRef.current);
            onScoreChange(scoreRef.current);
            sounds.collect.currentTime = 0;
            sounds.collect.play();
            
            // Recargar batería un poco al recoger dulce
            batteryRef.current = Math.min(
              gameConfig.batteryMax,
              batteryRef.current + 5
            );
            setCurrentBattery(batteryRef.current);
          }
        }
      });
      
      // Monstruos
      monsters.forEach((monster) => {
        const dist = Math.sqrt(
          Math.pow(monster.x - player.x, 2) + Math.pow(monster.y - player.y, 2)
        );
        
        if (dist < (player.size / 2 + monster.size / 2)) {
          livesRef.current--;
          setCurrentLives(livesRef.current);
          sounds.hit.currentTime = 0;
          sounds.hit.play();
          
          // Reposicionar jugador lejos del monstruo
          player.x = cellSize * 1.5;
          player.y = cellSize * 1.5;
          
          if (livesRef.current <= 0) {
            endGame();
          }
        }
      });
    }

    // Fin del juego
    function endGame() {
      running = false;
      showingGameOverRef.current = true;
      sounds.gameOver.currentTime = 0;
      sounds.gameOver.play();
      
      setTimeout(() => {
        setFinalScore(scoreRef.current);
        setGameState("gameover");
        onGameOver({
          score: scoreRef.current,
          lives: livesRef.current,
        });
      }, 2000);
    }

    // Verificar victoria
    function checkWin() {
      const allCollected = candies.every((c) => c.collected);
      if (allCollected) {
        // Bonus por completar
        scoreRef.current += 100;
        setCurrentScore(scoreRef.current);
        onScoreChange(scoreRef.current);
        endGame();
      }
    }

    // Detectar hover y clicks en los botones de pausa
    const getButtonBounds = (currentHeight) => {
      const resumeButtonY = currentHeight / 2 - 20;
      const resumeButtonX = width / 2 - 120;
      const resumeButtonWidth = 240;
      const resumeButtonHeight = 50;
      
      const restartButtonY = currentHeight / 2 + 50;
      const restartButtonX = width / 2 - 120;
      const restartButtonWidth = 240;
      const restartButtonHeight = 50;
      
      return {
        resume: {
          x: resumeButtonX,
          y: resumeButtonY,
          width: resumeButtonWidth,
          height: resumeButtonHeight,
        },
        restart: {
          x: restartButtonX,
          y: restartButtonY,
          width: restartButtonWidth,
          height: restartButtonHeight,
        }
      };
    };

    // Handler para detectar hover y clicks en botones
    const handleCanvasInteraction = (e) => {
      if (!pausedRef.current || countdownRef.current !== null) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = currentHeight / rect.height;
      
      const clickX = (e.clientX || (e.touches && e.touches[0].clientX) || 0) - rect.left;
      const clickY = (e.clientY || (e.touches && e.touches[0].clientY) || 0) - rect.top;
      
      const canvasX = clickX * scaleX;
      const canvasY = clickY * scaleY;
      
      const bounds = getButtonBounds(currentHeight);
      
      // Detectar hover
      const isOverResume = canvasX >= bounds.resume.x && 
                          canvasX <= bounds.resume.x + bounds.resume.width &&
                          canvasY >= bounds.resume.y && 
                          canvasY <= bounds.resume.y + bounds.resume.height;
      
      const isOverRestart = canvasX >= bounds.restart.x && 
                           canvasX <= bounds.restart.x + bounds.restart.width &&
                           canvasY >= bounds.restart.y && 
                           canvasY <= bounds.restart.y + bounds.restart.height;
      
      if (isOverResume) {
        setHoveredButton('resume');
        canvas.style.cursor = 'pointer';
      } else if (isOverRestart) {
        setHoveredButton('restart');
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredButton(null);
        canvas.style.cursor = 'default';
      }
      
      // Detectar click
      if (e.type === 'click' || e.type === 'touchend') {
        if (isOverResume) {
          // Reanudar
          countdownRef.current = 3;
          lastCountdownUpdate = Date.now();
          pausedRef.current = false;
          setHoveredButton(null);
        } else if (isOverRestart) {
          // Reiniciar
          running = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          document.removeEventListener("keydown", handleKeyDown);
          document.removeEventListener("keyup", handleKeyUp);
          canvas.removeEventListener("click", handleCanvasInteraction);
          canvas.removeEventListener("mousemove", handleCanvasInteraction);
          canvas.removeEventListener("touchmove", handleCanvasInteraction);
          canvas.removeEventListener("touchend", handleCanvasInteraction);
          setGameKey((k) => k + 1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    
    // Eventos para los botones de pausa
    canvas.addEventListener("click", handleCanvasInteraction);
    canvas.addEventListener("mousemove", handleCanvasInteraction);
    canvas.addEventListener("touchmove", handleCanvasInteraction);
    canvas.addEventListener("touchend", handleCanvasInteraction);

    // Loop del juego
    function gameLoop() {
      if (!running) return;

      ctx.clearRect(0, 0, width, currentHeight);

      // Fondo oscuro
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, currentHeight);

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
        // (el laberinto y elementos se dibujan después)
        
        // UI
        ctx.fillStyle = "white";
        ctx.font = "bold 20px Arial";
        ctx.fillText(`🍬 Dulces: ${candies.filter(c => c.collected).length}/${candies.length}`, 15, 30);
        ctx.fillText(`❤️ Vidas: ${livesRef.current}`, 15, 60);
        ctx.fillText(`🔋 Batería: ${Math.ceil(batteryRef.current)}%`, 15, 90);
        ctx.fillText(`⭐ Puntaje: ${scoreRef.current}`, 15, 120);

        // Cuenta regresiva
        if (isCountingDown && countdownRef.current > 0) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0, 0, width, currentHeight);
          
          ctx.fillStyle = "white";
          ctx.font = "bold 120px Arial";
          ctx.textAlign = "center";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 6;
          ctx.shadowBlur = 30;
          ctx.shadowColor = "rgba(110, 255, 142, 0.8)"; // Verde de Halloween
          ctx.strokeText(countdownRef.current, width / 2, currentHeight / 2);
          ctx.fillText(countdownRef.current, width / 2, currentHeight / 2);
          ctx.textAlign = "left";
          ctx.shadowBlur = 0;
        }

        // Menú de pausa
        if (pausedRef.current && !isCountingDown) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(0, 0, width, currentHeight);
          
          ctx.fillStyle = "#FF7518"; // Naranja de Halloween
          ctx.font = "bold 48px Arial";
          ctx.textAlign = "center";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          ctx.strokeText("PAUSA", width / 2, currentHeight / 2 - 80);
          ctx.fillText("PAUSA", width / 2, currentHeight / 2 - 80);
          
          // Función helper para dibujar botón con estilo de Halloween
          const drawButton = (buttonX, buttonY, buttonWidth, buttonHeight, buttonRadius, isHovered, buttonText) => {
            // Crear degradado verde para el botón (estilo Halloween)
            const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY);
            buttonGradient.addColorStop(0, "#7EFF9E"); // Verde más claro
            buttonGradient.addColorStop(1, "#5EFF7E"); // Verde más oscuro
            
            // Sombra del botón
            ctx.save();
            ctx.shadowColor = "rgba(110, 255, 142, 0.4)"; // Verde de Halloween
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 4;
            
            // Aplicar brightness al hover
            if (isHovered) {
              ctx.filter = "brightness(1.1)";
            }
            
            ctx.fillStyle = buttonGradient;
            
            // Dibujar botón con bordes redondeados
            ctx.beginPath();
            ctx.moveTo(buttonX + buttonRadius, buttonY);
            ctx.lineTo(buttonX + buttonWidth - buttonRadius, buttonY);
            ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + buttonRadius);
            ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - buttonRadius);
            ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - buttonRadius, buttonY + buttonHeight);
            ctx.lineTo(buttonX + buttonRadius, buttonY + buttonHeight);
            ctx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - buttonRadius);
            ctx.lineTo(buttonX, buttonY + buttonRadius);
            ctx.quadraticCurveTo(buttonX, buttonY, buttonX + buttonRadius, buttonY);
            ctx.closePath();
            ctx.fill();
            
            // Resetear filter y restaurar contexto
            ctx.filter = "none";
            ctx.restore();
            
            // Texto del botón
            ctx.fillStyle = "#000000"; // Texto negro sobre fondo verde
            ctx.font = "bold 24px Arial";
            ctx.fillText(buttonText, buttonX + buttonWidth / 2, buttonY + 33);
          };
          
          // Botón Reanudar - Estilo Halloween (verde)
          const resumeButtonY = currentHeight / 2 - 20;
          const resumeButtonX = width / 2 - 120;
          const resumeButtonWidth = 240;
          const resumeButtonHeight = 50;
          const resumeButtonRadius = 25;
          
          drawButton(
            resumeButtonX,
            resumeButtonY,
            resumeButtonWidth,
            resumeButtonHeight,
            resumeButtonRadius,
            hoveredButton === 'resume',
            "Reanudar"
          );
          
          // Botón Reiniciar - Estilo Halloween (verde)
          const restartButtonY = currentHeight / 2 + 50;
          const restartButtonX = width / 2 - 120;
          const restartButtonWidth = 240;
          const restartButtonHeight = 50;
          const restartButtonRadius = 25;
          
          drawButton(
            restartButtonX,
            restartButtonY,
            restartButtonWidth,
            restartButtonHeight,
            restartButtonRadius,
            hoveredButton === 'restart',
            "Reiniciar"
          );
          
          ctx.textAlign = "left";
        }

        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Actualizar batería
      if (batteryRef.current > 0) {
        batteryRef.current -= gameConfig.batteryDrainRate;
        if (batteryRef.current < 0) batteryRef.current = 0;
        setCurrentBattery(batteryRef.current);
      }

      // Si la batería se agota, el juego termina
      if (batteryRef.current <= 0 && !showingGameOverRef.current) {
        endGame();
      }

      // Mover jugador
      let newX = player.x;
      let newY = player.y;

      if (keysRef.current.up) newY -= player.speed;
      if (keysRef.current.down) newY += player.speed;
      if (keysRef.current.left) newX -= player.speed;
      if (keysRef.current.right) newX += player.speed;

      // Normalizar movimiento diagonal
      if (
        (keysRef.current.up || keysRef.current.down) &&
        (keysRef.current.left || keysRef.current.right)
      ) {
        newX = player.x + (newX - player.x) * 0.707;
        newY = player.y + (newY - player.y) * 0.707;
      }

      // Límites del canvas (considerando el tamaño del jugador)
      const playerRadius = player.size / 2;
      const mazeWidth = cols * cellSize;
      const mazeHeight = rows * cellSize;
      
      // Limitar movimiento dentro del área del laberinto
      newX = Math.max(playerRadius, Math.min(newX, mazeWidth - playerRadius));
      newY = Math.max(playerRadius, Math.min(newY, mazeHeight - playerRadius));

      // Verificar colisiones con paredes
      if (!checkWallCollision(newX, player.y)) {
        player.x = newX;
      }
      if (!checkWallCollision(player.x, newY)) {
        player.y = newY;
      }

      // Actualizar monstruos
      updateMonsters();

      // Verificar colisiones
      checkCollisions();
      checkWin();

      // Crear máscara de iluminación (efecto de linterna)
      const flashlightRadius = batteryRef.current > 0 
        ? gameConfig.flashlightRadius * (batteryRef.current / gameConfig.batteryMax)
        : 0;

      // Guardar contexto
      ctx.save();

      // Crear máscara de oscuridad primero
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(0, 0, width, currentHeight);

      // Crear gradiente radial para la linterna (área iluminada)
      const gradient = ctx.createRadialGradient(
        player.x,
        player.y,
        0,
        player.x,
        player.y,
        flashlightRadius
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.4, "rgba(255, 255, 200, 0)");
      gradient.addColorStop(0.7, "rgba(255, 255, 150, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.95)");

      // Aplicar máscara de iluminación usando destination-out para "quitar" la oscuridad
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, currentHeight);

      // Cambiar a modo normal para dibujar elementos
      ctx.globalCompositeOperation = "source-over";

      // Dibujar elementos visibles dentro del radio de la linterna
      const visibleRadius = flashlightRadius * 1.2;

      // Dibujar laberinto visible (solo dentro del radio de luz)
      // Pasillos iluminados con el color que tenía el fondo
      ctx.fillStyle = "#1a1a2e";
      ctx.strokeStyle = "#16213e";
      ctx.lineWidth = 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cellX = col * cellSize;
          const cellY = row * cellSize;
          const cellCenterX = cellX + cellSize / 2;
          const cellCenterY = cellY + cellSize / 2;
          const dist = Math.sqrt(
            Math.pow(cellCenterX - player.x, 2) + Math.pow(cellCenterY - player.y, 2)
          );
          
          // Solo dibujar si está dentro del radio de luz o la batería está agotada
          if (dist < visibleRadius || batteryRef.current <= 0) {
            if (maze[row][col] === 0) {
              // Pasillos: dibujar con el color iluminado
              ctx.fillStyle = "#1a1a2e";
              ctx.fillRect(cellX, cellY, cellSize, cellSize);
            } else {
              // Paredes: dibujar en negro
              ctx.fillStyle = "#000000";
              ctx.fillRect(cellX, cellY, cellSize, cellSize);
              ctx.strokeStyle = "#0a0a1a";
              ctx.strokeRect(cellX, cellY, cellSize, cellSize);
            }
          }
        }
      }

      // Dulces
      candies.forEach((candy) => {
        if (!candy.collected) {
          const dist = Math.sqrt(
            Math.pow(candy.x - player.x, 2) + Math.pow(candy.y - player.y, 2)
          );
          
          if (dist < visibleRadius || batteryRef.current <= 0) {
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = candy.color;
            ctx.fillStyle = candy.color;
            ctx.beginPath();
            ctx.arc(candy.x, candy.y, candy.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      });

      // Monstruos
      monsters.forEach((monster) => {
        const dist = Math.sqrt(
          Math.pow(monster.x - player.x, 2) + Math.pow(monster.y - player.y, 2)
        );
        
        if (dist < visibleRadius || batteryRef.current <= 0) {
          ctx.save();
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#ff0000";
          ctx.fillStyle = monster.color;
          ctx.beginPath();
          ctx.arc(monster.x, monster.y, monster.size / 2, 0, Math.PI * 2);
          ctx.fill();
          // Ojos del monstruo
          ctx.fillStyle = "#FF0000";
          ctx.beginPath();
          ctx.arc(monster.x - monster.size * 0.2, monster.y - monster.size * 0.1, monster.size * 0.15, 0, Math.PI * 2);
          ctx.arc(monster.x + monster.size * 0.2, monster.y - monster.size * 0.1, monster.size * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Jugador
      ctx.save();
      ctx.shadowBlur = 25;
      ctx.shadowColor = player.color;
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
      ctx.fill();
      // Ojos del jugador
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(player.x - player.size * 0.2, player.y - player.size * 0.1, player.size * 0.15, 0, Math.PI * 2);
      ctx.arc(player.x + player.size * 0.2, player.y - player.size * 0.1, player.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      // UI
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      ctx.fillText(`🍬 Dulces: ${candies.filter(c => c.collected).length}/${candies.length}`, 15, 30);
      ctx.fillText(`❤️ Vidas: ${livesRef.current}`, 15, 60);
      ctx.fillText(`🔋 Batería: ${Math.ceil(batteryRef.current)}%`, 15, 90);
      ctx.fillText(`⭐ Puntaje: ${scoreRef.current}`, 15, 120);

      // Barra de batería
      const barWidth = 200;
      const barHeight = 20;
      const barX = width - barWidth - 15;
      const barY = 15;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      const batteryPercent = batteryRef.current / gameConfig.batteryMax;
      ctx.fillStyle = batteryPercent > 0.3 
        ? "#00FF00" 
        : batteryPercent > 0.1 
        ? "#FFAA00" 
        : "#FF0000";
      ctx.fillRect(barX, barY, barWidth * batteryPercent, barHeight);
      
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barWidth, barHeight);

      if (showingGameOverRef.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width, currentHeight);
        
        ctx.fillStyle = "#FF0000";
        ctx.font = "bold 72px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 6;
        ctx.strokeText("GAME OVER", width / 2, currentHeight / 2);
        ctx.fillText("GAME OVER", width / 2, currentHeight / 2);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.strokeText(`Puntaje Final: ${scoreRef.current}`, width / 2, currentHeight / 2 + 60);
        ctx.fillText(`Puntaje Final: ${scoreRef.current}`, width / 2, currentHeight / 2 + 60);
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
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("click", handleCanvasInteraction);
      canvas.removeEventListener("mousemove", handleCanvasInteraction);
      canvas.removeEventListener("touchmove", handleCanvasInteraction);
      canvas.removeEventListener("touchend", handleCanvasInteraction);
      canvas.style.cursor = 'default';
    };
  }, [gameState, gameKey, isMobile, generateMaze]);

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
    <div className="maze-game-container">
      {title && <h1 className="maze-game-title">{title}</h1>}
      {description && <p className="maze-game-description">{description}</p>}

      <div className="maze-game-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={width}
          height={isMobile ? 700 : height}
          className={`maze-game-canvas maze-game-canvas--${theme}`}
        />
      </div>

      <div className="maze-game-controls">
        {gameState === "idle" && (
          <button
            onClick={handleStart}
            className="maze-game-button maze-game-button--start maze-game-button--animated maze-game-button--pulse"
          >
            🎮 Iniciar Juego
          </button>
        )}

        {gameState === "gameover" && (
          <>
            <p className="maze-game-description">
              ¡Juego terminado! Tu puntaje final: <strong>{finalScore}</strong>
            </p>
            <button
              onClick={handleRestart}
              className="maze-game-button maze-game-button--restart maze-game-button--animated"
            >
              Jugar de nuevo
            </button>
          </>
        )}
      </div>

      {gameState === "playing" && (
        <div className="maze-game-instructions">
          <p>
            {isMobile 
              ? "Usa los controles táctiles para moverte" 
              : "Usa WASD o las flechas para moverte"}
          </p>
          <p>Presiona ESC para pausar</p>
          <p>¡Recolecta todos los dulces antes de que se agote la batería!</p>
        </div>
      )}
    </div>
  );
}

