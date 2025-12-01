import { useEffect, useRef, useState } from "react";
import "../styles/pool-game.css";

/**
 * PoolGame - Minijuego de billar mejorado
 * Con modos Bola 8 y Bola 9, multijugador, y bolas rayadas/lisas
 */
export function PoolGame({
  width = 800,
  height = 600,
  title = "",
  description = "",
  gameConfig = {
    ballRadius: 15,
    friction: 0.98,
    minVelocity: 0.1,
    cuePower: 12, // Aumentado de 8 a 12
  },
  onGameOver = () => {},
  onScoreChange = () => {},
  theme = "dark",
}) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle");
  const [currentScore, setCurrentScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  
  // Estados para configuración del juego
  const [gameMode, setGameMode] = useState("8ball"); // "8ball" o "9ball"
  const [numPlayers, setNumPlayers] = useState(1);
  const [showSetup, setShowSetup] = useState(true);

  // Referencias
  const scoreRef = useRef(0);
  const pausedRef = useRef(false);
  const countdownRef = useRef(null);
  const showingGameOverRef = useRef(false);
  const isAimingRef = useRef(false);
  const aimStartRef = useRef(null);
  const aimEndRef = useRef(null);
  
  // Estado del juego multijugador
  const currentPlayerRef = useRef(0);
  const playersRef = useRef([]);
  const gameModeRef = useRef("8ball");
  const firstBallHitRef = useRef(null); // Para determinar tipo de bola asignada
  const ballTypeAssignedRef = useRef(false); // Si ya se asignó el tipo de bola
  const validBallPocketedRef = useRef(false); // Si se metió una bola válida en este tiro
  const lastBallsStoppedRef = useRef(true); // Estado anterior de bolas detenidas

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determinar si una bola es rayada (1-7) o lisa (9-15), 8 es negra
  const isStriped = (ballNumber) => {
    return ballNumber >= 1 && ballNumber <= 7;
  };

  const isSolid = (ballNumber) => {
    return ballNumber >= 9 && ballNumber <= 15;
  };

  // Colores de las bolas
  const ballColors = [
    null, // 0 = bola blanca
    '#FFD700', // 1 = amarillo (rayada)
    '#0000FF', // 2 = azul (rayada)
    '#FF0000', // 3 = rojo (rayada)
    '#800080', // 4 = morado (rayada)
    '#FF8C00', // 5 = naranja (rayada)
    '#008000', // 6 = verde (rayada)
    '#8B0000', // 7 = marrón (rayada)
    '#000000', // 8 = negro
    '#FFFF00', // 9 = amarillo (lisa)
    '#00FFFF', // 10 = cian (lisa)
    '#FF00FF', // 11 = magenta (lisa)
    '#FFA500', // 12 = naranja (lisa)
    '#00FF00', // 13 = verde (lisa)
    '#FF1493', // 14 = rosa (lisa)
    '#FFD700', // 15 = dorado (lisa)
  ];

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
    let lastCountdownUpdate = Date.now();

    // Configuración de la mesa
    const tableMargin = 30;
    const tableX = tableMargin;
    const tableY = tableMargin;
    const tableWidth = width - tableMargin * 2;
    const tableHeight = currentHeight - tableMargin * 2;

    // Posiciones de las troneras (6 agujeros) - CORREGIDAS
    const pockets = [
      { x: tableX - 5, y: tableY - 5 }, // Esquina superior izquierda
      { x: tableX + tableWidth / 2, y: tableY - 5 }, // Centro superior
      { x: tableX + tableWidth + 5, y: tableY - 5 }, // Esquina superior derecha
      { x: tableX - 5, y: tableY + tableHeight + 5 }, // Esquina inferior izquierda
      { x: tableX + tableWidth / 2, y: tableY + tableHeight + 5 }, // Centro inferior
      { x: tableX + tableWidth + 5, y: tableY + tableHeight + 5 }, // Esquina inferior derecha
    ];
    const pocketRadius = 25; // Aumentado para mejor detección

    // Inicializar jugadores
    const numPlayersValue = numPlayers;
    playersRef.current = Array.from({ length: numPlayersValue }, (_, i) => ({
      id: i,
      name: `Jugador ${i + 1}`,
      ballType: null, // "striped" (rayadas), "solid" (lisas), o null
      ballsPocketed: {
        striped: 0,
        solid: 0,
      },
      score: 0,
    }));
    currentPlayerRef.current = 0;
    gameModeRef.current = gameMode;
    firstBallHitRef.current = null;
    ballTypeAssignedRef.current = false;
    validBallPocketedRef.current = false;
    lastBallsStoppedRef.current = true;

    // Inicializar bolas según el modo
    const balls = [];
    const ballRadius = gameConfig.ballRadius;

    // Bola blanca (cue ball)
    balls.push({
      x: tableX + tableWidth * 0.25,
      y: tableY + tableHeight / 2,
      vx: 0,
      vy: 0,
      number: 0,
      pocketed: false,
    });

    if (gameModeRef.current === "8ball") {
      // Modo Bola 8: 15 bolas (1-15)
      const startX = tableX + tableWidth * 0.7;
      const startY = tableY + tableHeight / 2;
      let ballIndex = 1;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
          if (ballIndex <= 15) {
            const offsetX = (col - row / 2) * (ballRadius * 2.2);
            const offsetY = row * (ballRadius * 1.9);
            balls.push({
              x: startX + offsetX,
              y: startY + offsetY,
              vx: 0,
              vy: 0,
              number: ballIndex,
              pocketed: false,
            });
            ballIndex++;
          }
        }
      }
    } else if (gameModeRef.current === "9ball") {
      // Modo Bola 9: solo bolas 1-9
      const startX = tableX + tableWidth * 0.7;
      const startY = tableY + tableHeight / 2;
      let ballIndex = 1;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col <= row; col++) {
          if (ballIndex <= 9) {
            const offsetX = (col - row / 2) * (ballRadius * 2.2);
            const offsetY = row * (ballRadius * 1.9);
            balls.push({
              x: startX + offsetX,
              y: startY + offsetY,
              vx: 0,
              vy: 0,
              number: ballIndex,
              pocketed: false,
            });
            ballIndex++;
          }
        }
      }
    }

    // Inicializar referencias
    scoreRef.current = 0;
    pausedRef.current = false;
    countdownRef.current = null;
    showingGameOverRef.current = false;

    setCurrentScore(0);

    // Sonidos (simulados)
    const playSound = (type) => {
      // En una implementación real, aquí se reproducirían sonidos
    };

    // Colisión entre dos bolas
    function resolveBallCollision(ball1, ball2) {
      const dx = ball2.x - ball1.x;
      const dy = ball2.y - ball1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ballRadius * 2 && distance > 0) {
        // Normalizar
        const nx = dx / distance;
        const ny = dy / distance;

        // Velocidad relativa
        const dvx = ball2.vx - ball1.vx;
        const dvy = ball2.vy - ball1.vy;

        // Velocidad relativa en dirección normal
        const dotProduct = dvx * nx + dvy * ny;

        // No resolver si las bolas se están separando
        if (dotProduct > 0) return;

        // Impulso
        const impulse = (2 * dotProduct) / 2; // Masa = 1 para todas

        // Aplicar impulso
        ball1.vx += impulse * nx;
        ball1.vy += impulse * ny;
        ball2.vx -= impulse * nx;
        ball2.vy -= impulse * ny;

        // Separar bolas para evitar solapamiento
        const overlap = ballRadius * 2 - distance;
        const separationX = (nx * overlap) / 2;
        const separationY = (ny * overlap) / 2;

        ball1.x -= separationX;
        ball1.y -= separationY;
        ball2.x += separationX;
        ball2.y += separationY;

        playSound('collision');
        
        // Registrar primera bola golpeada (para asignar tipo en 8-ball)
        if (ball1.number === 0 && firstBallHitRef.current === null && ball2.number > 0) {
          firstBallHitRef.current = ball2.number;
        }
      }
    }

    // Verificar si una bola está en una tronera - CORREGIDO
    function checkPocket(ball) {
      for (const pocket of pockets) {
        const dx = ball.x - pocket.x;
        const dy = ball.y - pocket.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Mejor detección: considerar el radio de la bola
        if (distance < pocketRadius + ballRadius) {
          if (!ball.pocketed) {
            ball.pocketed = true;
            ball.x = -1000; // Mover fuera de la pantalla
            ball.y = -1000;
            ball.vx = 0;
            ball.vy = 0;
            playSound('pocket');

            const currentPlayer = playersRef.current[currentPlayerRef.current];
            
            if (ball.number === 0) {
              // Bola blanca metida = falta, turno al siguiente jugador
              // Reposicionar bola blanca
              ball.pocketed = false;
              ball.x = tableX + tableWidth * 0.25;
              ball.y = tableY + tableHeight / 2;
              nextPlayer();
            } else {
              // Procesar según el modo de juego
              if (gameModeRef.current === "8ball") {
                handle8BallPocket(ball, currentPlayer);
              } else if (gameModeRef.current === "9ball") {
                handle9BallPocket(ball, currentPlayer);
              }
            }
            
            setCurrentScore(scoreRef.current);
            onScoreChange(scoreRef.current);
          }
          return true;
        }
      }
      return false;
    }

    // Manejar bola metida en modo 8-ball
    function handle8BallPocket(ball, player) {
      // Si aún no se ha asignado el tipo de bola
      if (!ballTypeAssignedRef.current && firstBallHitRef.current !== null) {
        if (ball.number === firstBallHitRef.current) {
          // Asignar tipo según la primera bola metida
          if (isStriped(ball.number)) {
            player.ballType = "striped";
          } else if (isSolid(ball.number)) {
            player.ballType = "solid";
          }
          ballTypeAssignedRef.current = true;
          validBallPocketedRef.current = true; // Metió su primera bola, continúa
        } else {
          // Metió una bola diferente a la primera golpeada = falta
          validBallPocketedRef.current = false;
          nextPlayer();
          return;
        }
      } else {
        // Contar bolas metidas
        if (ball.number === 8) {
          // Bola 8 metida
          if (player.ballType === "striped" && player.ballsPocketed.striped === 7) {
            // Ganó
            scoreRef.current += 1000;
            endGame();
            return;
          } else if (player.ballType === "solid" && player.ballsPocketed.solid === 7) {
            // Ganó
            scoreRef.current += 1000;
            endGame();
            return;
          } else {
            // Perdió (bola 8 antes de tiempo)
            validBallPocketedRef.current = false;
            nextPlayer();
            return;
          }
        } else {
          // Bola normal
          if (isStriped(ball.number)) {
            player.ballsPocketed.striped++;
            if (player.ballType === "striped") {
              player.score += ball.number * 10;
              scoreRef.current += ball.number * 10;
              validBallPocketedRef.current = true; // Metió su bola, continúa
            } else if (player.ballType === "solid") {
              // Metió bola del oponente
              validBallPocketedRef.current = false;
              nextPlayer();
            } else {
              // No debería pasar, pero por seguridad
              validBallPocketedRef.current = false;
            }
          } else if (isSolid(ball.number)) {
            player.ballsPocketed.solid++;
            if (player.ballType === "solid") {
              player.score += ball.number * 10;
              scoreRef.current += ball.number * 10;
              validBallPocketedRef.current = true; // Metió su bola, continúa
            } else if (player.ballType === "striped") {
              // Metió bola del oponente
              validBallPocketedRef.current = false;
              nextPlayer();
            } else {
              // No debería pasar, pero por seguridad
              validBallPocketedRef.current = false;
            }
          }
        }
      }
    }

    // Manejar bola metida en modo 9-ball
    function handle9BallPocket(ball, player) {
      // En 9-ball, se deben golpear en orden (1-9)
      // Por simplicidad, cualquier bola metida cuenta
      if (ball.number === 9) {
        // Bola 9 metida = victoria
        scoreRef.current += 1000;
        endGame();
        return;
      } else {
        player.score += ball.number * 10;
        scoreRef.current += ball.number * 10;
        validBallPocketedRef.current = true; // Metió una bola, continúa turno
      }
    }

    // Cambiar al siguiente jugador
    function nextPlayer() {
      currentPlayerRef.current = (currentPlayerRef.current + 1) % playersRef.current.length;
      firstBallHitRef.current = null;
      validBallPocketedRef.current = false;
    }

    // Verificar colisiones con bordes
    function checkWallCollision(ball) {
      // Bordes de la mesa
      if (ball.x - ballRadius < tableX) {
        ball.x = tableX + ballRadius;
        ball.vx *= -0.8;
        playSound('wall');
      }
      if (ball.x + ballRadius > tableX + tableWidth) {
        ball.x = tableX + tableWidth - ballRadius;
        ball.vx *= -0.8;
        playSound('wall');
      }
      if (ball.y - ballRadius < tableY) {
        ball.y = tableY + ballRadius;
        ball.vy *= -0.8;
        playSound('wall');
      }
      if (ball.y + ballRadius > tableY + tableHeight) {
        ball.y = tableY + tableHeight - ballRadius;
        ball.vy *= -0.8;
        playSound('wall');
      }
    }

    // Verificar si todas las bolas están quietas
    function allBallsStopped() {
      // Verificar la bola blanca primero
      const cueBall = balls[0];
      if (cueBall.pocketed) return false; // Si la blanca está metida, no se puede jugar
      
      // Usar un umbral más estricto para asegurar que las bolas estén realmente detenidas
      const velocityThreshold = gameConfig.minVelocity * 1.5;
      
      // Verificar que la bola blanca esté completamente detenida
      if (Math.abs(cueBall.vx) > velocityThreshold || 
          Math.abs(cueBall.vy) > velocityThreshold) {
        return false;
      }
      
      // Verificar que todas las bolas no metidas estén completamente detenidas
      for (let i = 1; i < balls.length; i++) {
        const ball = balls[i];
        if (!ball.pocketed) {
          // Si la bola no está metida, debe estar completamente detenida
          if (Math.abs(ball.vx) > velocityThreshold || 
              Math.abs(ball.vy) > velocityThreshold) {
            return false;
          }
        }
      }
      
      return true;
    }

    // Verificar victoria
    function checkWin() {
      if (gameModeRef.current === "8ball") {
        // Ya se maneja en handle8BallPocket
        return;
      } else if (gameModeRef.current === "9ball") {
        // Ya se maneja en handle9BallPocket
        return;
      }
    }

    // Fin del juego
    function endGame() {
      running = false;
      showingGameOverRef.current = true;
      setTimeout(() => {
        setFinalScore(scoreRef.current);
        setGameState("gameover");
        onGameOver({
          score: scoreRef.current,
        });
      }, 2000);
    }

    // Manejo de pausa
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        if (!pausedRef.current && countdownRef.current === null) {
          pausedRef.current = true;
        } else if (pausedRef.current && countdownRef.current === null) {
          countdownRef.current = 3;
          lastCountdownUpdate = Date.now();
        }
      }
    };

    // Apuntar con el mouse
    const handleMouseDown = (e) => {
      if (pausedRef.current) return;
      
      const cueBall = balls[0];
      if (cueBall.pocketed) return;
      
      // Verificar que todas las bolas estén detenidas
      if (!allBallsStopped()) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = currentHeight / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const dx = mouseX - cueBall.x;
      const dy = mouseY - cueBall.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ballRadius * 3) {
        isAimingRef.current = true;
        aimStartRef.current = { x: cueBall.x, y: cueBall.y };
        aimEndRef.current = { x: mouseX, y: mouseY };
        // Resetear validBallPocketedRef cuando se inicia un nuevo tiro
        validBallPocketedRef.current = false;
      }
    };

    const handleMouseMove = (e) => {
      if (!isAimingRef.current || pausedRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = currentHeight / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const cueBall = balls[0];
      aimEndRef.current = { x: mouseX, y: mouseY };
    };

    const handleMouseUp = (e) => {
      if (!isAimingRef.current || pausedRef.current) return;

      const cueBall = balls[0];
      if (cueBall && !cueBall.pocketed) {
        const dx = aimEndRef.current.x - aimStartRef.current.x;
        const dy = aimEndRef.current.y - aimStartRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const power = Math.min(distance / 40, gameConfig.cuePower); // Ajustado para más fuerza

        if (power > 0.5) {
          const angle = Math.atan2(dy, dx);
          cueBall.vx = Math.cos(angle) * power;
          cueBall.vy = Math.sin(angle) * power;
          playSound('cue');
          firstBallHitRef.current = null; // Reset para nuevo tiro
          // NO resetear validBallPocketedRef aquí - se mantiene hasta que las bolas se detengan
          lastBallsStoppedRef.current = false; // Las bolas están en movimiento
        }
      }

      isAimingRef.current = false;
      aimStartRef.current = null;
      aimEndRef.current = null;
    };

    // Manejo táctil
    const handleTouchStart = (e) => {
      e.preventDefault();
      if (pausedRef.current) return;
      
      // Verificar que todas las bolas estén detenidas
      if (!allBallsStopped()) return;
      
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const scaleX = width / rect.width;
      const scaleY = currentHeight / rect.height;
      const touchX = (touch.clientX - rect.left) * scaleX;
      const touchY = (touch.clientY - rect.top) * scaleY;

      const cueBall = balls[0];
      if (cueBall.pocketed) return;

      const dx = touchX - cueBall.x;
      const dy = touchY - cueBall.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ballRadius * 3) {
        isAimingRef.current = true;
        aimStartRef.current = { x: cueBall.x, y: cueBall.y };
        aimEndRef.current = { x: touchX, y: touchY };
        // Resetear validBallPocketedRef cuando se inicia un nuevo tiro
        validBallPocketedRef.current = false;
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isAimingRef.current || pausedRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const scaleX = width / rect.width;
      const scaleY = currentHeight / rect.height;
      const touchX = (touch.clientX - rect.left) * scaleX;
      const touchY = (touch.clientY - rect.top) * scaleY;

      aimEndRef.current = { x: touchX, y: touchY };
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (!isAimingRef.current || pausedRef.current) return;

      const cueBall = balls[0];
      if (cueBall && !cueBall.pocketed) {
        const dx = aimEndRef.current.x - aimStartRef.current.x;
        const dy = aimEndRef.current.y - aimStartRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const power = Math.min(distance / 40, gameConfig.cuePower);

        if (power > 0.5) {
          const angle = Math.atan2(dy, dx);
          cueBall.vx = Math.cos(angle) * power;
          cueBall.vy = Math.sin(angle) * power;
          playSound('cue');
          firstBallHitRef.current = null;
          // NO resetear validBallPocketedRef aquí - se mantiene hasta que las bolas se detengan
          lastBallsStoppedRef.current = false;
        }
      }

      isAimingRef.current = false;
      aimStartRef.current = null;
      aimEndRef.current = null;
    };

    // Botones de pausa
    const getButtonBounds = (currentHeight) => {
      const resumeButtonY = currentHeight / 2 - 20;
      const resumeButtonX = width / 2 - 120;
      const resumeButtonWidth = 240;
      const resumeButtonHeight = 50;

      const restartButtonY = currentHeight / 2 + 50;
      const restartButtonX = width / 2 - 120;
      const restartButtonWidth = 240;
      const restartButtonHeight = 50;

      const setupButtonY = currentHeight / 2 + 120;
      const setupButtonX = width / 2 - 120;
      const setupButtonWidth = 240;
      const setupButtonHeight = 50;

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
        },
        setup: {
          x: setupButtonX,
          y: setupButtonY,
          width: setupButtonWidth,
          height: setupButtonHeight,
        }
      };
    };

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

      const isOverResume = canvasX >= bounds.resume.x &&
        canvasX <= bounds.resume.x + bounds.resume.width &&
        canvasY >= bounds.resume.y &&
        canvasY <= bounds.resume.y + bounds.resume.height;

      const isOverRestart = canvasX >= bounds.restart.x &&
        canvasX <= bounds.restart.x + bounds.restart.width &&
        canvasY >= bounds.restart.y &&
        canvasY <= bounds.restart.y + bounds.restart.height;

      const isOverSetup = canvasX >= bounds.setup.x &&
        canvasX <= bounds.setup.x + bounds.setup.width &&
        canvasY >= bounds.setup.y &&
        canvasY <= bounds.setup.y + bounds.setup.height;

      if (isOverResume) {
        setHoveredButton('resume');
        canvas.style.cursor = 'pointer';
      } else if (isOverRestart) {
        setHoveredButton('restart');
        canvas.style.cursor = 'pointer';
      } else if (isOverSetup) {
        setHoveredButton('setup');
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredButton(null);
        canvas.style.cursor = 'default';
      }

      if (e.type === 'click' || e.type === 'touchend') {
        if (isOverResume) {
          countdownRef.current = 3;
          lastCountdownUpdate = Date.now();
          pausedRef.current = false;
          setHoveredButton(null);
        } else if (isOverRestart) {
          running = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          document.removeEventListener("keydown", handleKeyDown);
          canvas.removeEventListener("mousedown", handleMouseDown);
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseup", handleMouseUp);
          canvas.removeEventListener("touchstart", handleTouchStart);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
          canvas.removeEventListener("click", handleCanvasInteraction);
          canvas.removeEventListener("mousemove", handleCanvasInteraction);
          setGameKey((k) => k + 1);
        } else if (isOverSetup) {
          pausedRef.current = false;
          setShowSetup(true);
          setGameState("idle");
          setHoveredButton(null);
        }
      }
    };

    const drawButton = (x, y, width, height, radius, isHovered, text) => {
      ctx.fillStyle = isHovered ? "#4CAF50" : "#2d5a3d";
      ctx.shadowBlur = isHovered ? 10 : 5;
      ctx.shadowColor = "#4CAF50";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, width, height, radius);
      } else {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + width / 2, y + height / 2);
    };

    document.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("click", handleCanvasInteraction);
    canvas.addEventListener("mousemove", handleCanvasInteraction);

    // Loop del juego
    function gameLoop() {
      if (!running) return;

      ctx.clearRect(0, 0, width, currentHeight);

      // Fondo
      ctx.fillStyle = "#1a4d2e";
      ctx.fillRect(0, 0, width, currentHeight);

      // Dibujar mesa
      ctx.fillStyle = "#0d5d2f";
      ctx.fillRect(tableX, tableY, tableWidth, tableHeight);

      // Dibujar troneras
      ctx.fillStyle = "#000";
      pockets.forEach(pocket => {
        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, pocketRadius, 0, Math.PI * 2);
        ctx.fill();
        // Borde de la tronera
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Contador de cuenta regresiva
      if (countdownRef.current !== null) {
        const now = Date.now();
        if (now - lastCountdownUpdate >= 1000) {
          countdownRef.current--;
          lastCountdownUpdate = now;
          if (countdownRef.current <= 0) {
            countdownRef.current = null;
          }
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, width, currentHeight);

        ctx.fillStyle = "white";
        ctx.font = "bold 80px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (countdownRef.current > 0) {
          ctx.fillText(countdownRef.current, width / 2, currentHeight / 2);
        } else {
          ctx.fillText("¡Vamos!", width / 2, currentHeight / 2);
        }
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Menú de pausa
      if (pausedRef.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width, currentHeight);

        ctx.fillStyle = "#FF8C00";
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FF8C00";
        ctx.fillText("PAUSA", width / 2, currentHeight / 2 - 120);

        const bounds = getButtonBounds(currentHeight);
        drawButton(
          bounds.resume.x,
          bounds.resume.y,
          bounds.resume.width,
          bounds.resume.height,
          25,
          hoveredButton === 'resume',
          "Continuar"
        );

        drawButton(
          bounds.restart.x,
          bounds.restart.y,
          bounds.restart.width,
          bounds.restart.height,
          25,
          hoveredButton === 'restart',
          "Reiniciar"
        );

        drawButton(
          bounds.setup.x,
          bounds.setup.y,
          bounds.setup.width,
          bounds.setup.height,
          25,
          hoveredButton === 'setup',
          "Configuración"
        );

        ctx.textAlign = "left";
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Actualizar física
      balls.forEach((ball, i) => {
        if (ball.pocketed) return;

        // Aplicar fricción
        ball.vx *= gameConfig.friction;
        ball.vy *= gameConfig.friction;

        // Detener si la velocidad es muy baja (forzar detención completa)
        const stopThreshold = gameConfig.minVelocity * 0.5;
        if (Math.abs(ball.vx) < stopThreshold) {
          ball.vx = 0;
        }
        if (Math.abs(ball.vy) < stopThreshold) {
          ball.vy = 0;
        }

        // Actualizar posición
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Colisiones con bordes
        checkWallCollision(ball);

        // Verificar troneras
        checkPocket(ball);

        // Colisiones entre bolas
        for (let j = i + 1; j < balls.length; j++) {
          const otherBall = balls[j];
          if (!otherBall.pocketed) {
            resolveBallCollision(ball, otherBall);
          }
        }
      });

      // Verificar victoria
      checkWin();

      // Verificar si todas las bolas se detuvieron y cambiar turno si es necesario
      const allStopped = allBallsStopped();
      
      // Solo procesar cuando las bolas pasan de movimiento a detenidas
      if (allStopped && !lastBallsStoppedRef.current) {
        // Las bolas acaban de detenerse
        // Si no se metió una bola válida, cambiar al siguiente jugador
        if (!validBallPocketedRef.current) {
          nextPlayer();
        }
        // Si se metió una bola válida, el jugador continúa
        // Resetear firstBallHitRef para el siguiente tiro
        firstBallHitRef.current = null;
        // NO resetear validBallPocketedRef aquí - se reseteará cuando inicie el siguiente tiro
      }
      
      // Actualizar el estado de bolas detenidas
      lastBallsStoppedRef.current = allStopped;

      // Dibujar bolas
      balls.forEach(ball => {
        if (ball.pocketed) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        
        if (ball.number === 0) {
          // Bola blanca
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.strokeStyle = "#CCC";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Bola numerada
          const baseColor = ballColors[ball.number] || "#888";
          ctx.fillStyle = baseColor;
          ctx.fill();
          
          // Dibujar rayas si es rayada (1-7)
          if (isStriped(ball.number)) {
            ctx.strokeStyle = "#FFF";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ballRadius * 0.7, 0, Math.PI * 2);
            ctx.stroke();
            // Rellenar con blanco en el centro
            ctx.fillStyle = "#FFF";
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ballRadius * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
          ctx.stroke();
          
          // Número
          ctx.fillStyle = ball.number === 8 ? "#FFF" : "#000";
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(ball.number.toString(), ball.x, ball.y);
        }
        ctx.restore();
      });

      // Dibujar línea de apuntado
      if (isAimingRef.current && aimStartRef.current && aimEndRef.current) {
        const cueBall = balls[0];
        if (cueBall && !cueBall.pocketed) {
          const dx = aimEndRef.current.x - aimStartRef.current.x;
          const dy = aimEndRef.current.y - aimStartRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const power = Math.min(distance / 40, 1);

          ctx.strokeStyle = `rgba(255, ${255 - power * 200}, 0, 0.8)`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cueBall.x, cueBall.y);
          ctx.lineTo(aimEndRef.current.x, aimEndRef.current.y);
          ctx.stroke();

          // Indicador de fuerza
          ctx.fillStyle = `rgba(255, ${255 - power * 200}, 0, 0.6)`;
          ctx.beginPath();
          ctx.arc(aimEndRef.current.x, aimEndRef.current.y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // UI
      ctx.fillStyle = "white";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`⭐ Puntaje: ${scoreRef.current}`, 15, 30);
      
      const activeBalls = balls.filter(b => !b.pocketed && b.number > 0).length;
      ctx.fillText(`🎱 Bolas: ${activeBalls}/${gameModeRef.current === "8ball" ? 15 : 9}`, 15, 60);
      
      // Información del jugador actual
      const currentPlayer = playersRef.current[currentPlayerRef.current];
      if (currentPlayer) {
        ctx.fillText(`👤 ${currentPlayer.name}`, 15, 90);
        if (currentPlayer.ballType) {
          ctx.fillText(
            `Tipo: ${currentPlayer.ballType === "striped" ? "Rayadas" : "Lisas"}`,
            15,
            120
          );
          ctx.fillText(
            `Rayadas: ${currentPlayer.ballsPocketed.striped} | Lisas: ${currentPlayer.ballsPocketed.solid}`,
            15,
            150
          );
        }
      }

      // Game Over
      if (showingGameOverRef.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width, currentHeight);

        ctx.fillStyle = "#FF0000";
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FF0000";
        ctx.fillText("GAME OVER", width / 2, currentHeight / 2);

        ctx.fillStyle = "white";
        ctx.font = "bold 30px Arial";
        ctx.strokeText(`Puntaje Final: ${scoreRef.current}`, width / 2, currentHeight / 2 + 60);
        ctx.fillText(`Puntaje Final: ${scoreRef.current}`, width / 2, currentHeight / 2 + 60);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("click", handleCanvasInteraction);
      canvas.removeEventListener("mousemove", handleCanvasInteraction);
    };
  }, [gameState, gameKey, isMobile, gameMode, numPlayers]);

  const startGame = () => {
    setGameState("playing");
    setFinalScore(0);
    setShowSetup(false);
  };

  return (
    <div className="pool-game">
      {/* Pantalla de configuración */}
      {showSetup && (
        <div className="pool-game__setup">
          <div className="pool-game__setup-content">
            <div className="pool-game__setup-header">
              <h3 className="pool-game__setup-title">Configuración del Juego</h3>
              <button 
                className="pool-game__close-button"
                onClick={() => setShowSetup(false)}
                aria-label="Cerrar configuración"
              >
                ✕
              </button>
            </div>
            
            <div className="pool-game__setup-section">
              <label className="pool-game__setup-label">Modo de Juego:</label>
              <div className="pool-game__setup-buttons">
                <button
                  className={`pool-game__setup-btn ${gameMode === "8ball" ? "active" : ""}`}
                  onClick={() => setGameMode("8ball")}
                >
                  Bola 8
                </button>
                <button
                  className={`pool-game__setup-btn ${gameMode === "9ball" ? "active" : ""}`}
                  onClick={() => setGameMode("9ball")}
                >
                  Bola 9
                </button>
              </div>
            </div>

            <div className="pool-game__setup-section">
              <label className="pool-game__setup-label">Número de Jugadores:</label>
              <div className="pool-game__setup-buttons">
                {[1, 2].map(num => (
                  <button
                    key={num}
                    className={`pool-game__setup-btn ${numPlayers === num ? "active" : ""}`}
                    onClick={() => setNumPlayers(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="pool-game__setup-actions">
              <button className="pool-game__start-button pool-game__start-button--vacation" onClick={startGame}>
                Iniciar Partida
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pool-game__canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="pool-game__canvas"
          width={width}
          height={isMobile ? 700 : height}
        />
        {gameState === "idle" && !showSetup && (
          <div className="pool-game__start-screen">
            <button className="pool-game__start-button pool-game__start-button--vacation" onClick={startGame}>
              Jugar
            </button>
            <p className="pool-game__instructions">
              {isMobile
                ? "Toca y arrastra desde la bola blanca para apuntar"
                : "Haz clic y arrastra desde la bola blanca para apuntar"}
            </p>
          </div>
        )}
      </div>
      {gameState === "gameover" && (
        <div className="pool-game__gameover">
          <p>
            ¡Juego terminado! Tu puntaje final: <strong>{finalScore}</strong>
          </p>
          <button
            className="pool-game__restart-button pool-game__start-button--vacation"
            onClick={() => {
              setGameState("idle");
              setGameKey((k) => k + 1);
              setFinalScore(0);
              setShowSetup(true);
            }}
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
