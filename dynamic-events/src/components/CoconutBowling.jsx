import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/coconut-bowling.css";

/**
 * CoconutBowling - Minijuego de bolos con cocos
 * Lanza cocos para derribar piñas/botellas con física realista
 */
export function CoconutBowling({
  width = 800,
  height = 600,
  title = "Coconut Bowling",
  description = "¡Lanza cocos y derriba todas las piñas!",
  gameConfig = {
    initialLives: 5,
    coconutsPerRound: 3,
    gravity: 0.3,
    friction: 0.98,
    bounce: 0.75, // Aumentado para mejor rebote
  },
  onGameOver = () => {},
  onScoreChange = () => {},
  theme = "dark",
}) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle");
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLives, setCurrentLives] = useState(gameConfig.initialLives);
  const [coconutsLeft, setCoconutsLeft] = useState(gameConfig.coconutsPerRound);
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Referencias para evitar re-renders
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const livesRef = useRef(gameConfig.initialLives);
  const coconutsLeftRef = useRef(gameConfig.coconutsPerRound);
  const pausedRef = useRef(false);
  const countdownRef = useRef(null);
  const showingGameOverRef = useRef(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [aimAngle, setAimAngle] = useState(45); // Ángulo en grados
  const [aimPower, setAimPower] = useState(50); // Fuerza (0-150)
  const aimAngleRef = useRef(45); // Ref para acceso inmediato en el loop
  const aimPowerRef = useRef(50); // Ref para acceso inmediato en el loop
  const MAX_POWER = 200; // Fuerza máxima aumentada
  const isAimingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Función para generar formaciones (se llama dentro del useEffect)
  const getFormation = (level, currentWidth, currentHeight) => {
    const formations = [
      // Nivel 1: Formación simple
      [
        { x: currentWidth * 0.7, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.75, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
      ],
      // Nivel 2: Formación triangular
      [
        { x: currentWidth * 0.7, y: currentHeight * 0.55, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.75, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.725, y: currentHeight * 0.6, type: 'bottle', points: 15 },
        { x: currentWidth * 0.775, y: currentHeight * 0.6, type: 'bottle', points: 15 },
      ],
      // Nivel 3: Formación en línea
      [
        { x: currentWidth * 0.65, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.6, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.6, type: 'bottle', points: 15 },
        { x: currentWidth * 0.85, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
      ],
      // Nivel 4: Dos filas (rebote vertical)
      [
        { x: currentWidth * 0.7, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.75, y: currentHeight * 0.5, type: 'bottle', points: 15 },
        { x: currentWidth * 0.8, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.65, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.65, type: 'bottle', points: 15 },
      ],
      // Nivel 5: Formación escalonada (rebote diagonal)
      [
        { x: currentWidth * 0.65, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.55, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.55, type: 'bottle', points: 15 },
        { x: currentWidth * 0.85, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.65, type: 'bottle', points: 15 },
        { x: currentWidth * 0.8, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
      ],
      // Nivel 6: Formación en V (rebote entre filas)
      [
        { x: currentWidth * 0.7, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.65, y: currentHeight * 0.6, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.6, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.85, y: currentHeight * 0.6, type: 'bottle', points: 15 },
        { x: currentWidth * 0.7, y: currentHeight * 0.65, type: 'bottle', points: 15 },
        { x: currentWidth * 0.8, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
      ],
      // Nivel 7: Formación compacta (rebote múltiple)
      [
        { x: currentWidth * 0.7, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.75, y: currentHeight * 0.5, type: 'bottle', points: 15 },
        { x: currentWidth * 0.8, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.725, y: currentHeight * 0.575, type: 'bottle', points: 15 },
        { x: currentWidth * 0.775, y: currentHeight * 0.575, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.65, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.65, type: 'bottle', points: 15 },
      ],
      // Nivel 8: Formación en pirámide invertida (rebote estratégico)
      [
        { x: currentWidth * 0.75, y: currentHeight * 0.45, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.55, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.55, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.55, type: 'bottle', points: 15 },
        { x: currentWidth * 0.65, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.65, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.65, type: 'bottle', points: 15 },
        { x: currentWidth * 0.85, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
      ],
      // Nivel 9: Formación dispersa (rebote amplio)
      [
        { x: currentWidth * 0.6, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.48, type: 'bottle', points: 15 },
        { x: currentWidth * 0.8, y: currentHeight * 0.5, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.9, y: currentHeight * 0.52, type: 'bottle', points: 15 },
        { x: currentWidth * 0.65, y: currentHeight * 0.6, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.62, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.85, y: currentHeight * 0.6, type: 'bottle', points: 15 },
        { x: currentWidth * 0.7, y: currentHeight * 0.68, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.68, type: 'bottle', points: 15 },
      ],
      // Nivel 10+: Formación compleja (máximo rebote)
      [
        { x: currentWidth * 0.65, y: currentHeight * 0.45, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.45, type: 'bottle', points: 15 },
        { x: currentWidth * 0.75, y: currentHeight * 0.45, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.8, y: currentHeight * 0.45, type: 'bottle', points: 15 },
        { x: currentWidth * 0.85, y: currentHeight * 0.45, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.675, y: currentHeight * 0.55, type: 'bottle', points: 15 },
        { x: currentWidth * 0.725, y: currentHeight * 0.55, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.775, y: currentHeight * 0.55, type: 'bottle', points: 15 },
        { x: currentWidth * 0.825, y: currentHeight * 0.55, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.7, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
        { x: currentWidth * 0.75, y: currentHeight * 0.65, type: 'bottle', points: 15 },
        { x: currentWidth * 0.8, y: currentHeight * 0.65, type: 'pineapple', points: 10 },
      ],
    ];

    // Para niveles superiores a 10, usar formaciones aleatorias o repetir la última
    const levelIndex = Math.min(level - 1, formations.length - 1);
    return formations[levelIndex] || formations[formations.length - 1];
  };

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

    // Inicializar referencias
    scoreRef.current = 0;
    levelRef.current = 1;
    livesRef.current = gameConfig.initialLives;
    coconutsLeftRef.current = gameConfig.coconutsPerRound;
    pausedRef.current = false;
    countdownRef.current = null;
    showingGameOverRef.current = false;

    // Actualizar estados React
    setCurrentScore(0);
    setCurrentLevel(1);
    setCurrentLives(gameConfig.initialLives);
    setCoconutsLeft(gameConfig.coconutsPerRound);
    setAimAngle(45);
    setAimPower(50);
    aimAngleRef.current = 45;
    aimPowerRef.current = 50;

    // Posición del lanzador (costa)
    const launcherX = width * 0.15;
    const launcherY = height * 0.75;
    const groundY = height * 0.8;

    // Piñas/botellas objetivo
    const initialFormation = getFormation(levelRef.current, width, currentHeight);
    const targets = initialFormation.map(t => ({
      ...t,
      knocked: false,
      size: t.type === 'pineapple' ? 40 : 30,
    }));

    // Cocos en vuelo
    const coconuts = [];

    // Sonidos
    const sounds = {
      throw: new Audio("/sounds/catch.ogg"),
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
          countdownRef.current = 3;
          lastCountdownUpdate = Date.now();
          pausedRef.current = false;
        }
      } else if ((e.key === "r" || e.key === "R") && pausedRef.current) {
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
      } else if (!pausedRef.current && coconuts.length === 0 && coconutsLeftRef.current > 0) {
        // Ajustar ángulo con flechas (invertido: izquierda aumenta, derecha disminuye)
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          const delta = e.key === "ArrowLeft" ? 5 : -5; // Invertido
          const newAngle = Math.max(10, Math.min(80, aimAngleRef.current + delta));
          aimAngleRef.current = newAngle;
          setAimAngle(newAngle);
        }
        // Ajustar fuerza con flechas arriba/abajo
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          const delta = e.key === "ArrowUp" ? 5 : -5;
          const newPower = Math.max(20, Math.min(MAX_POWER, aimPowerRef.current + delta));
          aimPowerRef.current = newPower;
          setAimPower(newPower);
        }
        // Lanzar con espacio
        if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          throwCoconut();
        }
      }
    };

    // Lanzar coco
    function throwCoconut() {
      if (coconutsLeftRef.current <= 0 || coconuts.length > 0) return;
      
      coconutsLeftRef.current--;
      setCoconutsLeft(coconutsLeftRef.current);
      
      const angleRad = (aimAngleRef.current * Math.PI) / 180;
      const power = aimPowerRef.current / 10; // Escalar la fuerza
      
      coconuts.push({
        x: launcherX,
        y: launcherY,
        vx: Math.cos(angleRad) * power,
        vy: -Math.sin(angleRad) * power,
        size: 25,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
      
      sounds.throw.currentTime = 0;
      sounds.throw.play();
    }

    // Manejo de mouse para apuntar
    const handleMouseDown = (e) => {
      if (pausedRef.current || coconuts.length > 0 || coconutsLeftRef.current <= 0) return;
      isDraggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      dragStartRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !dragStartRef.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const dx = mouseX - launcherX;
      const dy = launcherY - mouseY;
      
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 250; // Aumentado para permitir más fuerza
      const power = Math.min(MAX_POWER, (distance / maxDistance) * MAX_POWER);
      
      const newAngle = Math.max(10, Math.min(80, 90 - angle));
      const newPower = Math.max(20, Math.min(MAX_POWER, power));
      aimAngleRef.current = newAngle;
      aimPowerRef.current = newPower;
      setAimAngle(newAngle);
      setAimPower(newPower);
    };

    const handleMouseUp = (e) => {
      if (isDraggingRef.current) {
        throwCoconut();
        isDraggingRef.current = false;
        dragStartRef.current = null;
      }
    };

    // Manejo táctil
    const handleTouchStart = (e) => {
      e.preventDefault();
      if (pausedRef.current || coconuts.length > 0 || coconutsLeftRef.current <= 0) return;
      isDraggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isDraggingRef.current || !dragStartRef.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const mouseX = touch.clientX - rect.left;
      const mouseY = touch.clientY - rect.top;
      
      const dx = mouseX - launcherX;
      const dy = launcherY - mouseY;
      
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 250; // Aumentado para permitir más fuerza
      const power = Math.min(MAX_POWER, (distance / maxDistance) * MAX_POWER);
      
      const newAngle = Math.max(10, Math.min(80, 90 - angle));
      const newPower = Math.max(20, Math.min(MAX_POWER, power));
      aimAngleRef.current = newAngle;
      aimPowerRef.current = newPower;
      setAimAngle(newAngle);
      setAimPower(newPower);
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (isDraggingRef.current) {
        throwCoconut();
        isDraggingRef.current = false;
        dragStartRef.current = null;
      }
    };

    // Detectar colisiones
    function checkCollisions() {
      coconuts.forEach((coconut, cIdx) => {
        // Colisión con paredes laterales (rebote)
        if (coconut.x - coconut.size / 2 <= 0) {
          coconut.x = coconut.size / 2;
          coconut.vx *= -gameConfig.bounce;
        } else if (coconut.x + coconut.size / 2 >= width) {
          coconut.x = width - coconut.size / 2;
          coconut.vx *= -gameConfig.bounce;
        }
        
        // Colisión con el techo (rebote)
        if (coconut.y - coconut.size / 2 <= 0) {
          coconut.y = coconut.size / 2;
          coconut.vy *= -gameConfig.bounce;
        }
        
        // Colisión con el suelo
        if (coconut.y + coconut.size >= groundY) {
          coconut.y = groundY - coconut.size;
          coconut.vy *= -gameConfig.bounce;
          coconut.vx *= gameConfig.friction;
          
          // Si la velocidad es muy baja, detener el coco
          if (Math.abs(coconut.vy) < 0.5 && Math.abs(coconut.vx) < 0.5) {
            coconuts.splice(cIdx, 1);
          }
        }
        
        // Colisión con objetivos
        targets.forEach((target) => {
          if (target.knocked) return;
          
          const dx = coconut.x - target.x;
          const dy = coconut.y - target.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < (coconut.size / 2 + target.size / 2)) {
            target.knocked = true;
            scoreRef.current += target.points;
            setCurrentScore(scoreRef.current);
            onScoreChange(scoreRef.current);
            sounds.hit.currentTime = 0;
            sounds.hit.play();
            
            // Aplicar impulso al coco con rebote mejorado
            const impulse = 3; // Aumentado para mejor rebote
            const normalX = dx / dist;
            const normalY = dy / dist;
            coconut.vx += normalX * impulse;
            coconut.vy += normalY * impulse;
            
            // Separar el coco del objetivo para evitar colisiones múltiples
            const overlap = (coconut.size / 2 + target.size / 2) - dist;
            if (overlap > 0) {
              coconut.x += normalX * overlap;
              coconut.y += normalY * overlap;
            }
          }
        });
      });
    }

    // Verificar victoria
    function checkWin() {
      const allKnocked = targets.every(t => t.knocked);
      if (allKnocked) {
        // Bonus base por completar nivel
        const baseBonus = 50 * levelRef.current;
        
        // Bonus por cocos restantes (mayor ponderado)
        // Cuantos más cocos queden, mayor el bonus
        const coconutsUsed = gameConfig.coconutsPerRound - coconutsLeftRef.current;
        const coconutsRemaining = coconutsLeftRef.current;
        
        // Bonus multiplicador: más cocos restantes = mayor bonus
        // Fórmula: cocos restantes * multiplicador base * nivel
        // El multiplicador aumenta exponencialmente con los cocos restantes
        const coconutsBonusMultiplier = 30; // Base por coco restante
        const coconutsBonus = coconutsRemaining * coconutsBonusMultiplier * levelRef.current;
        
        // Bonus adicional por eficiencia (usar menos cocos)
        // Si usaste 1 coco, obtienes un bonus extra
        let efficiencyBonus = 0;
        if (coconutsUsed === 1) {
          efficiencyBonus = 100 * levelRef.current; // Bonus por completar con 1 solo coco
        } else if (coconutsUsed === 2) {
          efficiencyBonus = 50 * levelRef.current; // Bonus por completar con 2 cocos
        }
        
        const totalBonus = baseBonus + coconutsBonus + efficiencyBonus;
        scoreRef.current += totalBonus;
        setCurrentScore(scoreRef.current);
        onScoreChange(scoreRef.current);
        
        // Avanzar nivel
        levelRef.current++;
        setCurrentLevel(levelRef.current);
        coconutsLeftRef.current = gameConfig.coconutsPerRound;
        setCoconutsLeft(coconutsLeftRef.current);
        
        // Regenerar formaciones
        const newFormation = getFormation(levelRef.current, width, currentHeight);
        targets.length = 0;
        newFormation.forEach(t => {
          targets.push({
            ...t,
            knocked: false,
            size: t.type === 'pineapple' ? 40 : 30,
          });
        });
        
        coconuts.length = 0;
      } else if (coconutsLeftRef.current <= 0 && coconuts.length === 0) {
        // Sin cocos y objetivos restantes - perder una vida
        livesRef.current--;
        setCurrentLives(livesRef.current);
        
        if (livesRef.current <= 0) {
          // Sin vidas - game over
          endGame();
        } else {
          // Reiniciar ronda con nuevos cocos
          coconutsLeftRef.current = gameConfig.coconutsPerRound;
          setCoconutsLeft(coconutsLeftRef.current);
          
          // Regenerar formaciones para el mismo nivel
          const newFormation = getFormation(levelRef.current, width, currentHeight);
          targets.length = 0;
          newFormation.forEach(t => {
            targets.push({
              ...t,
              knocked: false,
              size: t.type === 'pineapple' ? 40 : 30,
            });
          });
          
          coconuts.length = 0;
        }
      }
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
          level: levelRef.current,
        });
      }, 2000);
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
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("click", handleCanvasInteraction);
    canvas.addEventListener("mousemove", handleCanvasInteraction);

    // Loop del juego
    function gameLoop() {
      if (!running) return;

      ctx.clearRect(0, 0, width, currentHeight);

      // Fondo (cielo y playa)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGradient.addColorStop(0, "#87CEEB");
      skyGradient.addColorStop(1, "#FFE4B5");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, groundY);
      
      // Arena
      ctx.fillStyle = "#F4A460";
      ctx.fillRect(0, groundY, width, currentHeight - groundY);

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
        drawStaticElements();
        
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
          ctx.shadowColor = "rgba(255, 165, 0, 0.8)"; // Naranja de vacaciones
          ctx.strokeText(countdownRef.current, width / 2, currentHeight / 2);
          ctx.fillText(countdownRef.current, width / 2, currentHeight / 2);
          ctx.textAlign = "left";
          ctx.shadowBlur = 0;
        }

        // Menú de pausa
        if (pausedRef.current && !isCountingDown) {
          drawPauseMenu();
        }

        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Actualizar física
      coconuts.forEach((coconut) => {
        coconut.vy += gameConfig.gravity;
        coconut.x += coconut.vx;
        coconut.y += coconut.vy;
        coconut.rotation += coconut.rotationSpeed;
        
        // Fricción
        coconut.vx *= gameConfig.friction;
        
        // Limitar fuera de pantalla
        if (coconut.x < -50 || coconut.x > width + 50 || coconut.y > currentHeight + 50) {
          const index = coconuts.indexOf(coconut);
          if (index > -1) coconuts.splice(index, 1);
        }
      });

      checkCollisions();
      checkWin();

      // Dibujar elementos
      drawStaticElements();
      
      // Dibujar cocos
      coconuts.forEach((coconut) => {
        ctx.save();
        ctx.translate(coconut.x, coconut.y);
        ctx.rotate(coconut.rotation);
        
        // Coco
        ctx.fillStyle = "#8B4513";
        ctx.beginPath();
        ctx.arc(0, 0, coconut.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Detalles del coco
        ctx.fillStyle = "#654321";
        ctx.beginPath();
        ctx.arc(-5, -5, 3, 0, Math.PI * 2);
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.arc(0, 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // UI
      drawUI();

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

    function drawStaticElements() {
      // Dibujar objetivos
      targets.forEach((target) => {
        if (target.knocked) {
          // Objetivo derribado (dibujar caído)
          ctx.save();
          ctx.translate(target.x, target.y);
          ctx.rotate(Math.PI / 4);
          
          if (target.type === 'pineapple') {
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(0, 0, target.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(-target.size / 4, -target.size / 2, target.size / 2, target.size / 4);
          } else {
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(-target.size / 2, -target.size / 2, target.size, target.size);
            ctx.fillStyle = "#654321";
            ctx.fillRect(-target.size / 4, -target.size / 2, target.size / 2, target.size / 4);
          }
          
          ctx.restore();
        } else {
          // Objetivo en pie
          if (target.type === 'pineapple') {
            // Piña
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(target.x, target.y, target.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(target.x - target.size / 4, target.y - target.size / 2, target.size / 2, target.size / 4);
            // Hojas
            ctx.strokeStyle = "#228B22";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(target.x, target.y - target.size / 2);
            ctx.lineTo(target.x - 5, target.y - target.size / 2 - 10);
            ctx.moveTo(target.x, target.y - target.size / 2);
            ctx.lineTo(target.x + 5, target.y - target.size / 2 - 10);
            ctx.stroke();
          } else {
            // Botella
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(target.x - target.size / 2, target.y - target.size, target.size, target.size);
            ctx.fillStyle = "#654321";
            ctx.fillRect(target.x - target.size / 4, target.y - target.size, target.size / 2, target.size / 4);
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.strokeRect(target.x - target.size / 2, target.y - target.size, target.size, target.size);
          }
        }
      });

      // Dibujar lanzador y flecha de puntería
      if (coconuts.length === 0 && coconutsLeftRef.current > 0 && !pausedRef.current) {
        const angleRad = (aimAngleRef.current * Math.PI) / 180;
        // La longitud de la flecha es proporcional a la fuerza
        const arrowLength = (aimPowerRef.current / MAX_POWER) * 250; // Máximo 250px
        const endX = launcherX + Math.cos(angleRad) * arrowLength;
        const endY = launcherY - Math.sin(angleRad) * arrowLength;
        
        // Dibujar flecha
        ctx.save();
        
        // Color de la flecha según la fuerza (ajustado para MAX_POWER)
        const powerPercent = (aimPowerRef.current / MAX_POWER) * 100;
        const arrowColor = powerPercent > 70 ? "#FF0000" : powerPercent > 40 ? "#FFAA00" : "#00FF00";
        ctx.strokeStyle = arrowColor;
        ctx.fillStyle = arrowColor;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 8;
        ctx.shadowColor = arrowColor;
        
        // Línea principal de la flecha
        ctx.beginPath();
        ctx.moveTo(launcherX, launcherY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Cabeza de la flecha (triángulo)
        const arrowHeadSize = 15;
        const arrowHeadAngle = Math.PI / 6; // 30 grados
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowHeadSize * Math.cos(angleRad - arrowHeadAngle),
          endY + arrowHeadSize * Math.sin(angleRad - arrowHeadAngle)
        );
        ctx.lineTo(
          endX - arrowHeadSize * Math.cos(angleRad + arrowHeadAngle),
          endY + arrowHeadSize * Math.sin(angleRad + arrowHeadAngle)
        );
        ctx.closePath();
        ctx.fill();
        
        // Sombra adicional para efecto de profundidad
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
        // Indicador de fuerza (barra adicional)
        const powerBarWidth = 100;
        const powerBarHeight = 10;
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(launcherX - powerBarWidth / 2, launcherY + 30, powerBarWidth, powerBarHeight);
        ctx.fillStyle = arrowColor;
        ctx.fillRect(launcherX - powerBarWidth / 2, launcherY + 30, (powerBarWidth * aimPowerRef.current) / MAX_POWER, powerBarHeight);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(launcherX - powerBarWidth / 2, launcherY + 30, powerBarWidth, powerBarHeight);
      }
      
      // Dibujar lanzador (coco en posición)
      ctx.fillStyle = "#8B4513";
      ctx.beginPath();
      ctx.arc(launcherX, launcherY, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPauseMenu() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, width, currentHeight);
      
      ctx.fillStyle = "#FF8C00"; // Naranja de vacaciones
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.strokeText("PAUSA", width / 2, currentHeight / 2 - 80);
      ctx.fillText("PAUSA", width / 2, currentHeight / 2 - 80);
      
      // Función helper para dibujar botón con estilo de vacaciones
      const drawButton = (buttonX, buttonY, buttonWidth, buttonHeight, buttonRadius, isHovered, buttonText) => {
        const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY);
        buttonGradient.addColorStop(0, "#FF8C00"); // Naranja
        buttonGradient.addColorStop(1, "#FF6347"); // Tomate
        
        ctx.save();
        ctx.shadowColor = "rgba(255, 140, 0, 0.4)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        if (isHovered) {
          ctx.filter = "brightness(1.1)";
        }
        
        ctx.fillStyle = buttonGradient;
        
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
        
        ctx.filter = "none";
        ctx.restore();
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px Arial";
        ctx.fillText(buttonText, buttonX + buttonWidth / 2, buttonY + 33);
      };
      
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

    function drawUI() {
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      ctx.fillText(`⭐ Puntaje: ${scoreRef.current}`, 15, 30);
      ctx.fillText(`🎯 Nivel: ${levelRef.current}`, 15, 60);
      ctx.fillText(`❤️ Vidas: ${livesRef.current}`, 15, 90);
      ctx.fillText(`🥥 Cocos: ${coconutsLeftRef.current}`, 15, 120);
      ctx.fillText(`📊 Objetivos: ${targets.filter(t => !t.knocked).length}/${targets.length}`, 15, 150);
      
      // Indicadores de ángulo y fuerza
      if (coconuts.length === 0 && coconutsLeftRef.current > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "14px Arial";
        ctx.fillText(`Ángulo: ${Math.round(aimAngleRef.current)}°`, width - 150, 30);
        ctx.fillText(`Fuerza: ${Math.round(aimPowerRef.current)}%`, width - 150, 50);
        ctx.fillText("Flechas: Ajustar | Espacio: Lanzar", width - 200, 80);
      }
    }

    gameLoop();

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
      canvas.style.cursor = 'default';
    };
  }, [gameState, gameKey, isMobile]);

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
    <div className="coconut-bowling-container">
      {title && <h1 className="coconut-bowling-title">{title}</h1>}
      {description && <p className="coconut-bowling-description">{description}</p>}

      <div className="coconut-bowling-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={width}
          height={isMobile ? 700 : height}
          className={`coconut-bowling-canvas coconut-bowling-canvas--${theme}`}
        />
      </div>

      <div className="coconut-bowling-controls">
        {gameState === "idle" && (
          <button
            onClick={handleStart}
            className="coconut-bowling-button coconut-bowling-button--start coconut-bowling-button--animated coconut-bowling-button--pulse"
          >
            🎮 Iniciar Juego
          </button>
        )}

        {gameState === "gameover" && (
          <>
            <p className="coconut-bowling-description">
              ¡Juego terminado! Tu puntaje final: <strong>{finalScore}</strong>
            </p>
            <button
              onClick={handleRestart}
              className="coconut-bowling-button coconut-bowling-button--restart coconut-bowling-button--animated"
            >
              Jugar de nuevo
            </button>
          </>
        )}
      </div>

      {gameState === "playing" && (
        <div className="coconut-bowling-instructions">
          <p>
            {isMobile 
              ? "Arrastra para apuntar y suelta para lanzar" 
              : "Arrastra el mouse para apuntar o usa las flechas. Espacio para lanzar"}
          </p>
          <p>Presiona ESC para pausar</p>
        </div>
      )}
    </div>
  );
}

