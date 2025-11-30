import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getTheme } from "../config/themes";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
import { Card } from "./base/Card";
import { Modal } from "./base/Modal";
import { Hero } from "./base/Hero";
import { Carousel } from "./base/Carousel";
import { ScrollToTop } from "./base/ScrollToTop";
import { Footer } from "./base/Footer";
import "../styles/ChristmasLanding.css";
import "../styles/base/utilities.css";

/**
 * Landing - Landing page con navegación a Chat y Juego
 * 
 * @param {Object} props
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 * @param {Function} props.onNavigateToCreateHistory - Callback para navegar a crear historia
 * @param {Function} props.onNavigateToGame - Callback para navegar al juego
 * @param {Function} props.onNavigateToLanding - Callback para navegar a la landing (para el logo)
 * @param {Function} props.onNavigateToMinijuegos - Callback para navegar a la sección de minijuegos
 * @param {Function} props.onNavigateToAboutUs - Callback para navegar a AboutUs
 * @param {Function} props.onNavigateToAddInfo - Callback para navegar a AddInfo
 */
export function Landing({ onNavigateToChat, onNavigateToCreateHistory, onNavigateToGame, onNavigateToLanding, onNavigateToMinijuegos, onNavigateToAboutUs, onNavigateToAddInfo }) {
  const { currentTheme } = useTheme();
  const theme = getTheme(currentTheme);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedThemeForModal, setSelectedThemeForModal] = useState(null);
  const [showFooterModal, setShowFooterModal] = useState(null); // 'instructions' | 'policies' | 'about' | null
  
  // Historia destacada del hero
  const featuredStory = {
    id: 'carta-perdida',
    title: "La Carta Perdida de Navidad",
    icon: "📮",
    story: "En una pequeña ciudad nevada, una joven llamada Elena encontró una carta que nunca llegó a Papá Noel. Era una carta antigua, amarillenta por el tiempo, con una dirección borrosa que apenas podía leerse. Elena, con un corazón lleno de curiosidad y bondad, decidió emprender un viaje mágico antes de que terminara la noche de Navidad. Siguió las pistas que la carta guardaba entre sus pliegues: un copo de nieve especial, un fragmento de campanilla y un pequeño trozo de papel con coordenadas misteriosas. Con la ayuda de sus amigos y un poco de magia navideña, Elena logró encontrar al destinatario original de la carta: un anciano que había perdido la esperanza años atrás. Cuando leyó la carta, sus ojos brillaron con lágrimas de alegría. La carta perdida trajo de vuelta la magia a su corazón y a toda la comunidad. Elena aprendió que nunca es tarde para hacer llegar un mensaje de amor, y que la Navidad tiene el poder de conectar almas perdidas a través del tiempo."
  };

  // Historias para las cards originales
  const originalStories = [
    {
      id: 'carta-tarde',
      title: "La carta que llegó tarde",
      icon: "📮",
      story: "En una pequeña ciudad nevada, una niña llamada Sofía escribió una carta especial a Papá Noel pidiendo un regalo para su abuela enferma. Sin embargo, la carta se perdió en una tormenta de nieve y llegó al Polo Norte demasiado tarde, justo cuando Santa ya había partido. Un elfo mensajero llamado Pip descubrió la carta y, conmovido por el pedido de Sofía, decidió ayudar. Con la ayuda de los renos más veloces y un poco de magia navideña, logró alcanzar a Santa en pleno vuelo. Santa, emocionado por la bondad de Sofía, preparó un regalo especial: una manta tejida con hilos de esperanza que ayudaría a la abuela a sentirse mejor. La carta que llegó tarde se convirtió en el regalo más importante de esa Navidad, recordando a todos que nunca es tarde para la bondad y el amor."
    },
    {
      id: 'arbol-luces',
      title: "El árbol sin luces",
      icon: "🎄",
      story: "En el centro del pueblo había un árbol de Navidad gigante que cada año se iluminaba con miles de luces de colores. Pero ese año, una tormenta eléctrica había dañado todas las luces y no había tiempo para reemplazarlas antes de la víspera de Navidad. Los niños del pueblo estaban tristes, especialmente Mateo, quien amaba ver el árbol brillante. Decidió pedirle ayuda a sus amigos y juntos crearon luces caseras con frascos, velas y papel de colores. Cada familia del pueblo contribuyó con su propia creación. Cuando llegó la noche de Navidad, el árbol brillaba con una luz cálida y especial que nunca antes habían visto. El árbol sin luces se convirtió en el más hermoso de todos, iluminado por la creatividad y el trabajo en equipo de toda la comunidad."
    },
    {
      id: 'reno-timido',
      title: "El reno tímido",
      icon: "🦌",
      story: "Blitzen era un reno joven y muy tímido que soñaba con volar junto al trineo de Santa, pero tenía miedo de hablar con los otros renos. Cada Navidad, observaba desde lejos cómo los renos principales despegaban mientras él se quedaba en el establo. Una noche, una estrella fugaz cayó cerca y Blitzen la siguió hasta un claro mágico donde conoció a un sabio reno anciano. El anciano le enseñó que el coraje no es la ausencia de miedo, sino actuar a pesar de él. Con esta lección, Blitzen regresó y le pidió a Santa una oportunidad. En la víspera de Navidad, cuando uno de los renos principales se resfrió, Blitzen se ofreció a tomar su lugar. Guió al trineo con valentía y determinación, superando su timidez y convirtiéndose en uno de los renos más confiables del equipo de Santa."
    }
  ];
  const storiesRowRef = useRef(null);

  // Temas disponibles para las historias
  const themes = [
    {
      id: 1,
      title: "Un regalo especial",
      icon: "🎁",
      color: "green",
      description: "Un elfo que perdió un regalo importante",
      story: "En el taller del Polo Norte, el elfo Timmy había perdido el regalo más importante de la temporada: un osito de peluche mágico que podía hablar y contar historias. Este regalo estaba destinado a una niña llamada Emma, quien había pedido un amigo que nunca la dejara sola. Timmy buscó por todo el taller, entre cajas y papeles de regalo, pero no lo encontró. Con lágrimas en sus ojos, decidió pedirle ayuda a sus amigos elfos. Juntos, buscaron en cada rincón hasta que finalmente lo encontraron en el trineo de Santa, quien lo había guardado porque sabía lo especial que era. Emma recibió su regalo en Navidad y nunca estuvo sola de nuevo.",
      image: "/images/theme-gift.png"
    },
    {
      id: 2,
      title: "El árbol mágico",
      icon: "🎄",
      color: "brown",
      description: "Una estrella mágica que guía a los duendes",
      story: "En lo alto del árbol de Navidad del Polo Norte brillaba una estrella especial. Esta estrella no era como las demás; tenía el poder de guiar a los duendes cuando se perdían en la noche nevada. Una noche, tres duendes jóvenes salieron a buscar piñas para decorar, pero una tormenta de nieve los desorientó. La estrella comenzó a brillar más fuerte que nunca, creando un camino de luz dorada que los guió de regreso a casa. Desde entonces, los duendes siempre miraban la estrella antes de salir, sabiendo que ella los protegería. La estrella se convirtió en el símbolo de esperanza del Polo Norte.",
      image: "/images/theme-tree.png"
    },
    {
      id: 3,
      title: "Leyenda de nieve",
      icon: "⛄",
      color: "red",
      description: "Un pueblo sin nieve en víspera de Navidad",
      story: "El pueblo de Villa Esperanza nunca había pasado una Navidad sin nieve, pero ese año el clima había cambiado. Los niños estaban tristes porque no podrían hacer muñecos de nieve ni tener una blanca Navidad. La pequeña Luna decidió escribirle a Santa pidiéndole, no juguetes, sino nieve para su pueblo. Santa leyó la carta y se conmovió tanto que pidió ayuda a Jack Frost, el espíritu del invierno. Juntos crearon una tormenta mágica que cubrió el pueblo con la nieve más brillante que habían visto. Los niños despertaron en Navidad con un paisaje blanco y mágico, y Luna aprendió que la generosidad es el mejor regalo.",
      image: "/images/theme-snowman.png"
    },
    {
      id: 4,
      title: "El reno valiente",
      icon: "🦌",
      color: "green",
      description: "Un reno que quiere volar por primera vez",
      story: "Rudolph era un reno joven que soñaba con volar junto al trineo de Santa, pero tenía miedo de las alturas. Cada Navidad, veía a los otros renos despegar mientras él se quedaba en el suelo. Una noche, una estrella fugaz cayó cerca del establo y Rudolph la siguió. La estrella lo llevó a un lugar mágico donde conoció a un sabio reno anciano que le enseñó que el coraje no es la ausencia de miedo, sino actuar a pesar de él. Con esta lección, Rudolph regresó y le pidió a Santa una oportunidad. En la víspera de Navidad, Rudolph guió al trineo con su nariz brillante, superando su miedo y convirtiéndose en el reno más valiente del Polo Norte.",
      image: null
    },
    {
      id: 5,
      title: "La carta perdida",
      icon: "📮",
      color: "brown",
      description: "Una carta que llega tarde al Polo Norte",
      story: "En el último día antes de Navidad, una carta especial se perdió en una tormenta de nieve. Era la carta de un niño llamado Leo, quien pedía un regalo para su abuela enferma. La carta viajó por el viento hasta llegar a las manos de un elfo mensajero que se había quedado dormido. Cuando despertó y vio la fecha, supo que tenía que actuar rápido. Con la ayuda de los renos más veloces y la magia de Santa, la carta llegó justo a tiempo. Santa leyó el pedido de Leo y se emocionó tanto que preparó un regalo especial: una manta tejida con hilos de esperanza que ayudaría a la abuela a sentirse mejor. Leo y su abuela pasaron la Navidad más cálida de sus vidas.",
      image: null
    },
    {
      id: 6,
      title: "El juguete mágico",
      icon: "🧸",
      color: "red",
      description: "Un juguete que cobra vida en la noche de Navidad",
      story: "En el taller de juguetes, había un osito de peluche llamado Teddy que anhelaba tener un dueño. Cada noche, miraba cómo otros juguetes eran elegidos, pero él siempre se quedaba. En la víspera de Navidad, una magia especial recorrió el taller y Teddy cobró vida. Decidió buscar a un niño que lo necesitara. Viajó por la nieve hasta encontrar una casa donde un pequeño llamado Tomás estaba triste porque sus padres no podían comprar regalos. Teddy se presentó y le dijo que él sería su mejor amigo. A la mañana siguiente, Tomás encontró a Teddy bajo el árbol y supo que la Navidad había traído algo más valioso que cualquier juguete: un amigo verdadero.",
      image: null
    },
    {
      id: 7,
      title: "El taller secreto",
      icon: "🔨",
      color: "green",
      description: "Un niño que desea conocer el taller de Santa",
      story: "Mateo era un niño curioso que siempre había querido ver el taller de Santa. Escribió una carta especial pidiendo visitar el Polo Norte. Santa, conmovido por su entusiasmo, le concedió el deseo de manera mágica. Una noche, Mateo se despertó en el taller más increíble que había visto: elfos trabajando, renos relinchando y juguetes por todas partes. Pasó el día ayudando a los elfos y aprendiendo el valor del trabajo en equipo. Antes de regresar, Santa le dio un pequeño martillo mágico como recuerdo. Mateo despertó en su cama con el martillo en sus manos, sabiendo que había vivido una aventura real. Desde entonces, siempre creyó en la magia de Navidad.",
      image: null
    },
    {
      id: 8,
      title: "La campana de la esperanza",
      icon: "🔔",
      color: "brown",
      description: "Una campana que suena solo para corazones puros",
      story: "En la cima del árbol de Navidad del pueblo había una campana antigua que solo sonaba cuando alguien con un corazón puro la tocaba. Nadie la había escuchado en años, hasta que una niña llamada Sofía, que siempre ayudaba a los demás sin esperar nada a cambio, pasó por allí. Cuando Sofía extendió su mano hacia la campana, esta comenzó a sonar con una melodía mágica que llenó el pueblo de alegría. El sonido atrajo a Santa, quien había estado buscando a alguien especial para entregar un regalo muy importante: la capacidad de hacer felices a los demás. Desde ese día, Sofía se convirtió en la portadora de la magia navideña, y la campana siempre sonaba cuando ella estaba cerca, recordando a todos que la bondad es el verdadero espíritu de Navidad.",
      image: null
    }
  ];

  // Navegar al chat con o sin tema
  const goToChat = (theme = null) => {
    if (onNavigateToChat) {
      onNavigateToChat(theme);
    }
  };

  // Navegar al juego
  const goToGame = () => {
    if (onNavigateToGame) {
      onNavigateToGame();
    }
  };

  // Abrir modal de tema o historia original
  const openThemeModal = (theme) => {
    setSelectedThemeForModal(theme);
    setShowThemeModal(true);
  };

  // Abrir modal de historia original
  const openStoryModal = (story) => {
    setSelectedThemeForModal(story);
    setShowThemeModal(true);
  };

  // Cerrar modal
  const closeThemeModal = () => {
    setShowThemeModal(false);
    setSelectedThemeForModal(null);
  };

  // Abrir modal del footer
  const openFooterModal = (modalType) => {
    setShowFooterModal(modalType);
  };

  // Cerrar modal del footer
  const closeFooterModal = () => {
    setShowFooterModal(null);
  };

  // Funcionalidad del carrusel
  useEffect(() => {
    const storiesRow = storiesRowRef.current;
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    if (!storiesRow || !leftBtn || !rightBtn) return;

    const getCardWidth = () => {
      // Obtener la primera card para calcular su ancho
      const firstCard = storiesRow.querySelector('.story-card');
      if (!firstCard) return 360 + 32; // Fallback a valor por defecto

      const cardRect = firstCard.getBoundingClientRect();
      const cardWidth = cardRect.width;
      
      // Obtener el gap del contenedor (2rem = 32px por defecto)
      const gap = parseInt(window.getComputedStyle(storiesRow).gap) || 32;
      
      return cardWidth + gap;
    };

    const scrollLeft = () => {
      const cardWidth = getCardWidth();
      // Calcular la posición actual del scroll
      const currentScroll = storiesRow.scrollLeft;
      // Calcular cuántas cards completas se han desplazado
      const cardsScrolled = Math.round(currentScroll / cardWidth);
      // Calcular la nueva posición para retroceder exactamente una card
      const newScrollPosition = Math.max(0, (cardsScrolled - 1) * cardWidth);
      
      storiesRow.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
    };

    const scrollRight = () => {
      const cardWidth = getCardWidth();
      // Calcular la posición actual del scroll
      const currentScroll = storiesRow.scrollLeft;
      // Calcular cuántas cards completas se han desplazado
      const cardsScrolled = Math.round(currentScroll / cardWidth);
      // Calcular la nueva posición para avanzar exactamente una card
      const newScrollPosition = (cardsScrolled + 1) * cardWidth;
      
      storiesRow.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
    };

    leftBtn.addEventListener('click', scrollLeft);
    rightBtn.addEventListener('click', scrollRight);

    return () => {
      leftBtn.removeEventListener('click', scrollLeft);
      rightBtn.removeEventListener('click', scrollRight);
    };
  }, []);

  // Renderizar item del carrusel
  const renderThemeCard = (theme) => (
    <Card
      key={theme.id}
      variant={theme.color}
      className="theme-card"
      interactive
      onClick={() => openThemeModal(theme)}
    >
      {theme.image ? (
        <img
          src={theme.image}
          alt={theme.title}
          className="card__image theme-card__image"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'block';
            }
          }}
        />
      ) : null}
      <div
        className="card__icon theme-card__icon"
        style={{ display: theme.image ? 'none' : 'block' }}
      >
        {theme.icon}
      </div>
      <h3 className="card__title theme-card__title">{theme.title}</h3>
    </Card>
  );

  return (
    <div className={`landing landing--${currentTheme}`}>
      {/* HEADER */}
      <Header
        logo="Dynamic Events"
        className={`landing-header landing-header--${currentTheme}`}
        sticky
        variant="light"
        onLogoClick={onNavigateToLanding}
        showThemeSelector={true}
      >
        <a href="#minijuegos" className="nav-link" onClick={(e) => { 
          e.preventDefault(); 
          const minijuegosSection = document.getElementById("minijuegos");
          if (minijuegosSection) {
            minijuegosSection.scrollIntoView({ behavior: "smooth" });
          }
        }}>
          Minijuegos
        </a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
          Crear historia IA
        </a>
      </Header>

      {/* HERO SECTION */}
      <section className="hero hero--index-navidad">
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-tag">HISTORIA DESTACADA</span>
            <h1 className="hero-title">La Carta Perdida de Navidad</h1>
            <p className="hero-meta">Historia corta · Fantasía navideña</p>
            <p className="hero-synopsis">
              Una joven encuentra una carta que nunca llegó a Papá Noel y decide emprender
              un viaje mágico antes de que termine la noche de Navidad.
            </p>
            <a href="#historia-actual" className="hero-btn" onClick={(e) => { 
              e.preventDefault(); 
              openStoryModal(featuredStory);
            }}>
              Leer más
            </a>
          </div>
        </div>
      </section>

      {/* CAROUSEL DE HISTORIAS Y TEMAS */}
      <section id="historia-actual" className="landing-section landing-section--padding carousel-section">
        <h2 className="section-title">Historias destacadas de Navidad</h2>
        
        <div className="carousel-container-navidad">
          <button className="arrow arrow-left" id="leftBtn">&#10094;</button>
          <button className="arrow arrow-right" id="rightBtn">&#10095;</button>
          
          <div className="stories-row" id="storiesRow" ref={storiesRowRef}>
            {/* Cards de Temas - Mantienen funcionalidad de modal */}
            {themes.map((theme) => {
              // Datos inventados para cada tema
              const themeData = {
                1: { genre: "Fantasía navideña", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
                2: { genre: "Aventura mágica", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/1661907/pexels-photo-1661907.jpeg?auto=compress&cs=tinysrgb&w=1200" },
                3: { genre: "Cuento navideño", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200" },
                4: { genre: "Aventura de superación", year: "2023", author: "Taller de Historias", pexelsImage: "https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=1200" },
                5: { genre: "Drama navideño", year: "2023", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
                6: { genre: "Cuento infantil", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/1661907/pexels-photo-1661907.jpeg?auto=compress&cs=tinysrgb&w=1200" },
                7: { genre: "Aventura familiar", year: "2023", author: "Taller de Historias", pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200" },
                8: { genre: "Fantasía espiritual", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=1200" },
              };
              const data = themeData[theme.id] || { genre: "Fantasía navideña", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200" };

              return (
                <article key={theme.id} className="story-card story-card--theme" onClick={() => openThemeModal(theme)}>
                  <div className="story-image-wrapper story-image-wrapper--theme">
                    <img
                      src={data.pexelsImage}
                      alt={theme.title}
                      className="story-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const iconDiv = e.target.parentElement.querySelector('.story-icon-fallback');
                        if (iconDiv) iconDiv.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="story-icon-fallback"
                      style={{ display: 'none' }}
                    >
                      <span style={{ fontSize: '4rem' }}>{theme.icon}</span>
                    </div>
                  </div>
                  <div className="story-body">
                    <h3 className="story-title">{theme.title}</h3>
                    <p className="story-info">Género: {data.genre}</p>
                    <p className="story-info">Año: {data.year}</p>
                    <p className="story-info">Autor: {data.author}</p>
                  </div>
                </article>
              );
            })}

            {/* CARD - La carta que llegó tarde */}
            <article className="story-card" onClick={() => openStoryModal(originalStories[0])}>
              <div className="story-image-wrapper">
                <img
                  src="https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  className="story-image"
                  alt="La carta que llegó tarde"
                />
              </div>
              <div className="story-body">
                <h3 className="story-title">La carta que llegó tarde</h3>
                <p className="story-info">Género: Fantasía navideña</p>
                <p className="story-info">Año: 2024</p>
                <p className="story-info">Autora: Desing Events</p>
              </div>
            </article>

            {/* CARD - El árbol sin luces */}
            <article className="story-card" onClick={() => openStoryModal(originalStories[1])}>
              <div className="story-image-wrapper">
                <img
                  src="https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  className="story-image"
                  alt="El árbol sin luces"
                />
              </div>
              <div className="story-body">
                <h3 className="story-title">El árbol sin luces</h3>
                <p className="story-info">Género: Aventura familiar</p>
                <p className="story-info">Año: 2023</p>
                <p className="story-info">Autor: Taller de Historias</p>
        </div>
            </article>

            {/* CARD - El reno tímido */}
            <article className="story-card" onClick={() => openStoryModal(originalStories[2])}>
              <div className="story-image-wrapper">
                <img
                  src="https://images.pexels.com/photos/1661907/pexels-photo-1661907.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  className="story-image"
                  alt="El reno tímido"
                />
              </div>
              <div className="story-body">
                <h3 className="story-title">El reno tímido</h3>
                <p className="story-info">Género: Cuento infantil</p>
                <p className="story-info">Año: 2022</p>
                <p className="story-info">Autora: Desing Events</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECCIÓN CARTA NAVIDAD */}
      <section className="carta-navidad">
        <div className="carta-container">
          <div className="carta-inner">
            <div className="carta-left">
              <h2 className="carta-title">Historias personalizadas con IA</h2>
              <p className="carta-text">
                ¡Ho, ho, ho! <br /><br />
                ¡Hola, amiguito! Te habla Papá Noel.<br /><br />
                Quiero invitarte a mi taller mágico para que crees tu propia historia
                personalizada con IA. Solo debes seguir unas simples instrucciones,
                elegir los elementos que más te gusten y, con un toque de magia
                navideña, la inteligencia artificial transformará tus ideas en un
                relato único y especial.<br /><br />
                Tu historia te está esperando.
              </p>
              <a href="#" className="carta-btn" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
                Crear ahora
              </a>
              </div>
            <div className="carta-right">
              <img 
                src="/images/santa.png" 
                alt="Papá Noel"
                className="santa-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const emojiDiv = document.createElement('div');
                  emojiDiv.style.fontSize = '8rem';
                  emojiDiv.textContent = '🎅';
                  e.target.parentElement.appendChild(emojiDiv);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN MINIJUEGOS */}
      <section id="minijuegos" className="minijuegos-section">
        <div className="minijuegos-inner">
          <h2 className="minijuegos-title">Minijuegos navideños</h2>
          <p className="minijuegos-desc">
            Explora pequeños desafíos interactivos para seguir jugando con la magia
            de la Navidad.
          </p>
          <div className="minijuegos-grid">
            <article className="mini-card">
              <h3 className="mini-name">Trineo veloz</h3>
              <p className="mini-text">
                Ayuda a Papá Noel a recoger los regalos de esta navidad.
              </p>
              <a href="#" className="mini-btn" onClick={(e) => { e.preventDefault(); goToGame(); }}>
                Jugar ahora
              </a>
            </article>
            <div className="minijuegos-coming-soon">
              <img 
                src="/images/commingSoonChrist.png" 
                alt="Próximamente - Nuevo minijuego navideño"
                className="minijuegos-coming-soon__image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'minijuegos-coming-soon__fallback';
                  fallbackDiv.innerHTML = '<h3 className="mini-name">Próximamente</h3><p className="mini-text">Nuevos juegos se están cocinando</p>';
                  e.target.parentElement.appendChild(fallbackDiv);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer
        onNavigateToLanding={onNavigateToLanding}
        onNavigateToChat={goToChat}
        onNavigateToCreateHistory={onNavigateToCreateHistory}
        onNavigateToAddInfo={onNavigateToAddInfo}
        onNavigateToAboutUs={onNavigateToAboutUs}
      />

      {/* MODAL DE HISTORIA */}
      <Modal
        isOpen={showThemeModal}
        onClose={closeThemeModal}
        size="md"
        className="modal--white"
      >
        {selectedThemeForModal && (
          <div className="story-modal">
            <div className="story-modal__header u-text-center">
              <span className="story-modal__icon">{selectedThemeForModal.icon || "📖"}</span>
              <h2 className="story-modal__title u-text-primary">{selectedThemeForModal.title}</h2>
            </div>
            <p className="story-modal__text u-text-dark">{selectedThemeForModal.story}</p>
            <Button
              variant="primary"
              size="md"
              className="story-modal__button u-width-full"
              onClick={() => {
                closeThemeModal();
                goToChat(selectedThemeForModal);
              }}
            >
              Crear mi propia versión de esta historia
            </Button>
          </div>
        )}
      </Modal>

      {/* MODALES DEL FOOTER */}
      {/* Modal de Instrucciones */}
      <Modal
        isOpen={showFooterModal === 'instructions'}
        onClose={closeFooterModal}
        size="md"
        className="modal--white"
      >
        <div className="footer-modal">
          <div className="footer-modal__header u-text-center">
            <h2 className="footer-modal__title u-text-primary">📖 Instrucciones</h2>
          </div>
          <div className="footer-modal__content u-text-dark">
            <h3>¿Cómo usar Dynamic Events?</h3>
            <p>
              <strong>1. Historias con IA:</strong> Navega a la sección "Historias IA" y crea tu propia historia navideña 
              interactuando con Santa Claus. Puedes elegir un tema predefinido o crear uno completamente original.
            </p>
            <p>
              <strong>2. Minijuegos:</strong> Accede a la sección "Minijuegos" para disfrutar de juegos temáticos navideños. 
              ¡Intenta superar tu récord personal!
            </p>
            <p>
              <strong>3. Navegación:</strong> Usa los botones del header para moverte entre las diferentes secciones. 
              El logo "Dynamic Events" siempre te llevará de vuelta a la página principal.
            </p>
            <p>
              <strong>4. Temas:</strong> Explora los diferentes temas de historias disponibles en el carrusel de la página principal.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal de Políticas */}
      <Modal
        isOpen={showFooterModal === 'policies'}
        onClose={closeFooterModal}
        size="md"
        className="modal--white"
      >
        <div className="footer-modal">
          <div className="footer-modal__header u-text-center">
            <h2 className="footer-modal__title u-text-primary">📋 Políticas</h2>
          </div>
          <div className="footer-modal__content u-text-dark">
            <h3>Política de Privacidad</h3>
            <p>
              Dynamic Events respeta tu privacidad. Los datos de las historias y puntuaciones de juegos se almacenan 
              localmente en tu navegador y no se comparten con terceros.
            </p>
            <h3>Términos de Uso</h3>
            <p>
              Al usar Dynamic Events, aceptas utilizar la plataforma de manera responsable. El contenido generado por IA 
              es para entretenimiento y uso personal.
            </p>
            <h3>Uso de IA</h3>
            <p>
              Las historias son generadas mediante inteligencia artificial. Dynamic Events no se hace responsable del 
              contenido generado, aunque se esfuerza por mantener un ambiente familiar y seguro.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal de Conócenos */}
      <Modal
        isOpen={showFooterModal === 'about'}
        onClose={closeFooterModal}
        size="md"
        className="modal--white"
      >
        <div className="footer-modal">
          <div className="footer-modal__header u-text-center">
            <h2 className="footer-modal__title u-text-primary">🎄 Conócenos</h2>
          </div>
          <div className="footer-modal__content u-text-dark">
            <h3>Acerca de Dynamic Events</h3>
            <p>
              Dynamic Events es una plataforma interactiva que evoluciona con las épocas del año, ofreciendo experiencias 
              únicas y personalizadas. Nuestro objetivo es crear un entorno adaptable, interactivo y entretenido.
            </p>
            <h3>Nuestra Misión</h3>
            <p>
              Ofrecer historias personalizadas guiadas por IA y minijuegos temáticos que se adaptan a cada temporada del año, 
              creando momentos mágicos e inolvidables para nuestros usuarios.
            </p>
            <h3>Características</h3>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
              <li>Historias interactivas con inteligencia artificial</li>
              <li>Minijuegos temáticos y entretenidos</li>
              <li>Diseño adaptable según la época del año</li>
              <li>Experiencia completamente personalizada</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* SCROLL TO TOP */}
      <ScrollToTop variant="primary" position="bottom-right" hideAtFooter={true} />
    </div>
  );
}

