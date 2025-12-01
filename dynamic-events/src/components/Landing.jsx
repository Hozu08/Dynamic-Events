import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getTheme } from "../config/themes";
import * as christmasContent from "../config/christmasContent";
import * as halloweenContent from "../config/halloweenContent";
import * as vacationContent from "../config/vacationContent";
import { Header } from "./base/Header";
import { Button } from "./base/Button";
import { Card } from "./base/Card";
import { Modal } from "./base/Modal";
import { Hero } from "./base/Hero";
import { Carousel } from "./base/Carousel";
import { ScrollToTop } from "./base/ScrollToTop";
import { Footer } from "./base/Footer";
import "../styles/variables.css";
import "../styles/ChristmasLanding.css";
import "../styles/base/utilities.css";

/**
 * Obtiene el contenido (historias y temas) según la época actual
 */
function getContentByTheme(themeId) {
  switch (themeId) {
    case 'halloween':
      return halloweenContent;
    case 'vacation':
      return vacationContent;
    case 'christmas':
    default:
      return christmasContent;
  }
}

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

  // Obtener contenido dinámico según el tema actual
  const content = getContentByTheme(currentTheme);
  const { featuredStory, originalStories, themes, originalStoriesMetadata, themesMetadata } = content;

  const storiesRowRef = useRef(null);

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
          // Buscar la sección de minijuegos según el tema actual
          const minijuegosId = 
            currentTheme === 'christmas' ? "minijuegos" :
            currentTheme === 'halloween' ? "minijuegos-halloween" :
            currentTheme === 'vacation' ? "minijuegos-vacation" :
            "minijuegos";
          const minijuegosSection = document.getElementById(minijuegosId);
          if (minijuegosSection) {
            const headerOffset = 100; // Compensar header sticky
            const elementPosition = minijuegosSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }}>
          Minijuegos
        </a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
          Crear historia IA
        </a>
      </Header>

      {/* HERO SECTION */}
      <section className={`hero hero--index-${currentTheme}`}>
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-tag">HISTORIA DESTACADA</span>
            <h1 className="hero-title">{featuredStory.title}</h1>
            <p className="hero-synopsis">
              {featuredStory.story.substring(0, 150)}...
            </p>
            <a href="#historia-actual" className="btn btn--primary btn--md hero-btn mini-btn" onClick={(e) => {
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
        <h2 className="section-title">Historias destacadas de {theme.name}</h2>

        <div className="carousel-container-navidad">
          <button className="arrow arrow-left" id="leftBtn">&#10094;</button>
          <button className="arrow arrow-right" id="rightBtn">&#10095;</button>

          <div className="stories-row" id="storiesRow" ref={storiesRowRef}>
            {/* Cards de Temas - Mantienen funcionalidad de modal */}
            {themes.map((theme, themeIndex) => {
              const data = themesMetadata[theme.id] || { genre: "Fantasía navideña", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200" };
              
              // Imágenes específicas para Halloween - intercaladas
              const halloweenImages = [
                "https://images.pexels.com/photos/5635101/pexels-photo-5635101.jpeg?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw",
                "https://images.pexels.com/photos/619424/pexels-photo-619424.jpeg?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw",
                "https://images.pexels.com/photos/5427545/pexels-photo-5427545.jpeg?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw",
                "https://images.pexels.com/photos/3095465/pexels-photo-3095465.png?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw"
              ];
              
              // Usar imagen de Halloween si el tema es Halloween, sino usar la imagen original
              const imageUrl = currentTheme === 'halloween' 
                ? halloweenImages[themeIndex % halloweenImages.length]
                : data.pexelsImage;

              return (
                <article key={theme.id} className="story-card story-card--theme" onClick={() => openThemeModal(theme)}>
                  <div className="story-image-wrapper story-image-wrapper--theme">
                    <img
                      src={imageUrl}
                      alt={theme.title}
                      className="story-image"
                      onError={(e) => {
                        // Si es Halloween, intentar usar otra imagen de Halloween como fallback
                        if (currentTheme === 'halloween') {
                          const fallbackIndex = (themeIndex + 1) % halloweenImages.length;
                          e.target.src = halloweenImages[fallbackIndex];
                          return;
                        }
                        // Si no es Halloween, mostrar el emoticono como fallback
                        e.target.style.display = 'none';
                        const iconDiv = e.target.parentElement.querySelector('.story-icon-fallback');
                        if (iconDiv) iconDiv.style.display = 'flex';
                      }}
                    />
                    <div
                      className="story-icon-fallback"
                      style={{ display: currentTheme === 'halloween' ? 'none' : 'none' }}
                    >
                      <span style={{ fontSize: '4rem' }}>{theme.icon}</span>
                    </div>
                  </div>
                  <div className="story-body">
                    <h3 className="story-title">{theme.title}</h3>
                    <p className="story-info">Género: {data.genre}</p>
                    <p className="story-info">Año: {data.year}</p>
                    <p className="story-info">Autor: {data.author}</p>
                    <p className="story-read-link">Leer historia</p>
                  </div>
                </article>
              );
            })}

            {/* Cards de Historias Originales */}
            {originalStories.map((story, index) => {
              const metadata = originalStoriesMetadata[story.id] || { genre: "Fantasía", year: "2024", author: "Desing Events", pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200" };
              
              // Imágenes específicas para Halloween - intercaladas
              const halloweenImages = [
                "https://images.pexels.com/photos/5635101/pexels-photo-5635101.jpeg?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw",
                "https://images.pexels.com/photos/619424/pexels-photo-619424.jpeg?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw",
                "https://images.pexels.com/photos/5427545/pexels-photo-5427545.jpeg?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw",
                "https://images.pexels.com/photos/3095465/pexels-photo-3095465.png?_gl=1*1htnfa*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NDk5MDgkbzEkZzEkdDE3NjQ1NTAxMTEkajQyJGwwJGgw"
              ];
              
              // Calcular índice total (temas + historias originales)
              const totalIndex = themes.length + index;
              
              // Usar imagen de Halloween si el tema es Halloween, sino usar la imagen original
              const imageUrl = currentTheme === 'halloween' 
                ? halloweenImages[totalIndex % halloweenImages.length]
                : metadata.pexelsImage;

              return (
                <article key={story.id} className="story-card" onClick={() => openStoryModal(story)}>
                  <div className="story-image-wrapper">
                    <img
                      src={imageUrl}
                      className="story-image"
                      alt={story.title}
                      onError={(e) => {
                        // Si es Halloween, intentar usar otra imagen de Halloween como fallback
                        if (currentTheme === 'halloween') {
                          const fallbackIndex = (totalIndex + 1) % halloweenImages.length;
                          e.target.src = halloweenImages[fallbackIndex];
                          return;
                        }
                        // Si no es Halloween, mostrar el emoticono como fallback
                        e.target.style.display = 'none';
                        const iconDiv = e.target.parentElement.querySelector('.story-icon-fallback');
                        if (iconDiv) iconDiv.style.display = 'flex';
                      }}
                    />
                    <div
                      className="story-icon-fallback"
                      style={{ display: currentTheme === 'halloween' ? 'none' : 'none' }}
                    >
                      <span style={{ fontSize: '4rem' }}>{story.icon}</span>
                    </div>
                  </div>
                  <div className="story-body">
                    <h3 className="story-title">{story.title}</h3>
                    <p className="story-info">Género: {metadata.genre}</p>
                    <p className="story-info">Año: {metadata.year}</p>
                    <p className="story-info">Autor: {metadata.author}</p>
                    <p className="story-read-link">Leer historia</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN CARTA NAVIDAD - Solo visible en tema Navidad */}
      {currentTheme === 'christmas' && (
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
                <a href="#" className="btn btn--primary btn--md carta-btn" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
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
      )}

      {/* SECCIÓN HALLOWEEN - Solo visible en tema Halloween */}
      {currentTheme === 'halloween' && (
        <section className="carta-halloween">
          <div className="carta-container">
            <div className="carta-inner">
              <div className="carta-left">
                <h2 className="carta-title">Historias de Terror con IA</h2>
                <p className="carta-text">
                  ¡Buuu! <br /><br />
                  ¡Saludos, valiente aventurero! Soy el Guardián de las Sombras.<br /><br />
                  ¿Te atreves a adentrarte en mi laboratorio de historias de terror?
                  Con la ayuda de la inteligencia artificial, puedes crear relatos
                  escalofriantes que harán temblar hasta a los más valientes. Elige
                  personajes misteriosos, escenarios tenebrosos y giros inesperados
                  para dar vida a tu propia historia de miedo.<br /><br />
                  ¿Aceptas el reto?
                </p>
                <a href="#" className="btn btn--primary btn--md carta-btn" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
                  Crear historia de terror
                </a>
              </div>
              <div className="carta-right">
                <img
                  src="/images/ghost.png"
                  alt="ghost"
                  className="halloween-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const emojiDiv = document.createElement('div');
                    emojiDiv.style.fontSize = '8rem';
                    emojiDiv.textContent = '🧙‍♀️';
                    e.target.parentElement.appendChild(emojiDiv);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN VACACIONES - Solo visible en tema Vacaciones */}
      {currentTheme === 'vacation' && (
        <section className="carta-vacation">
          <div className="carta-container">
            <div className="carta-inner">
              <div className="carta-left">
                <h2 className="carta-title">Aventuras de Verano con IA</h2>
                <p className="carta-text">
                  ¡Hola, explorador! <br /><br />
                  Soy el Guardián de las Vacaciones.<br /><br />
                  ¿Listo para la aventura más emocionante del verano? En mi playbook
                  de historias, tú eres el protagonista. Con la ayuda de la inteligencia
                  artificial, puedes crear relatos llenos de diversión, playas soleadas,
                  montañas misteriosas y amistades inolvidables. ¡Solo trae tu imaginación
                  y déjanos encargarnos de la magia!<br /><br />
                  ¡Tu aventura de verano te espera!
                </p>
                <a href="#" className="btn btn--primary btn--md carta-btn mini-btn" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
                  Crear aventura
                </a>
              </div>
              <div className="carta-right">
                <img
                  src="/images/sunMan.png"
                  alt="Hombre sol de verano"
                  className="vacation-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const emojiDiv = document.createElement('div');
                    emojiDiv.style.fontSize = '8rem';
                    emojiDiv.textContent = '🏖️';
                    e.target.parentElement.appendChild(emojiDiv);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN MINIJUEGOS - Navidad */}
      {currentTheme === 'christmas' && (
        <section id="minijuegos" className="minijuegos-section">
          <div className="minijuegos-inner">
            <h2 className="minijuegos-title">Minijuegos Navideños</h2>
            <p className="minijuegos-desc">
              Explora pequeños desafíos interactivos para seguir jugando con la magia
              de la Navidad.
            </p>
            <div className="minijuegos-grid">
              <article className="mini-card">
                <h3 className="mini-name">Trineo Veloz</h3>
                <p className="mini-text">
                  Ayuda a Papá Noel a recoger los regalos de esta Navidad.
                </p>
                <a href="#" className="btn btn--primary btn--md mini-btn" onClick={(e) => { e.preventDefault(); goToGame(); }}>
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
      )}

      {/* SECCIÓN MINIJUEGOS - Halloween */}
      {currentTheme === 'halloween' && (
        <section id="minijuegos-halloween" className="minijuegos-section halloween">
          <div className="minijuegos-inner">
            <h2 className="minijuegos-title">Juegos de Terror</h2>
            <p className="minijuegos-desc">
              Desafía tus miedos con estos juegos espeluznantes llenos de misterio y emoción.
            </p>
            <div className="minijuegos-grid">
              <article className="mini-card">
                <h3 className="mini-name">Laberinto del Terror</h3>
                <p className="mini-text">
                  Encuentra la salida antes de que los espíritus te atrapen.
                </p>
                <a href="#" className="btn btn--primary btn--md mini-btn" onClick={(e) => { e.preventDefault(); goToGame(); }}>
                  Jugar ahora
                </a>
              </article>
              <div className="minijuegos-coming-soon">
                <img
                  src="/images/commingSoonH.png"
                  alt="Próximamente - Nuevo juego de terror"
                  className="minijuegos-coming-soon__image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'minijuegos-coming-soon__fallback';
                    fallbackDiv.innerHTML = '<h3 className="mini-name">Próximamente</h3><p className="mini-text">Más terror está por venir</p>';
                    e.target.parentElement.appendChild(fallbackDiv);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN MINIJUEGOS - Vacaciones */}
      {currentTheme === 'vacation' && (
        <section id="minijuegos-vacation" className="minijuegos-section vacation">
          <div className="minijuegos-inner">
            <h2 className="minijuegos-title">Aventuras de Verano</h2>
            <p className="minijuegos-desc">
              Disfruta de emocionantes juegos llenos de diversión bajo el sol.
            </p>
            <div className="minijuegos-grid">
              <article className="mini-card">
                <h3 className="mini-name">Tesoro en la Playa</h3>
                <p className="mini-text">
                  Encuentra el tesoro perdido antes de que suba la marea.
                </p>
                <a href="#" className="btn btn--primary btn--md mini-btn" onClick={(e) => { e.preventDefault(); goToGame(); }}>
                  Jugar ahora
                </a>
              </article>
              <div className="minijuegos-coming-soon">
                <img
                  src="/images/commingSoonV.jpeg"
                  alt="Próximamente - Nueva aventura de verano"
                  className="minijuegos-coming-soon__image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'minijuegos-coming-soon__fallback';
                    fallbackDiv.innerHTML = '<h3 className="mini-name">Próximamente</h3><p className="mini-text">Más diversión está en camino</p>';
                    e.target.parentElement.appendChild(fallbackDiv);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

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

