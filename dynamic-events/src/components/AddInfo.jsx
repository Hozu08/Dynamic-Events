import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Header } from "./base/Header";
import { ScrollToTop } from "./base/ScrollToTop";
import { Footer } from "./base/Footer";
import "../styles/ChristmasLanding.css";
import "../styles/AddInfo.css";
import "../styles/base/utilities.css";

/**
 * AddInfo - Página de información del sitio (Políticas, FAQ, Instrucciones)
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Callback para volver a la landing
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 * @param {Function} props.onNavigateToCreateHistory - Callback para navegar a crear historia
 * @param {Function} props.onNavigateToMinijuegos - Callback para navegar a la sección de minijuegos
 * @param {Function} props.onNavigateToAboutUs - Callback para navegar a AboutUs
 * @param {Function} props.onNavigateToLanding - Callback para navegar a la landing
 * @param {string} props.scrollToSection - Sección a la que hacer scroll ('policies' | 'faq' | 'instructions')
 */
export function AddInfo({ 
  onBack, 
  onNavigateToChat, 
  onNavigateToCreateHistory, 
  onNavigateToMinijuegos, 
  onNavigateToAboutUs,
  onNavigateToLanding,
  scrollToSection = null 
}) {
  // Estado para manejar qué preguntas están abiertas
  const [openFaqs, setOpenFaqs] = useState({});

  // Función para toggle de preguntas frecuentes
  const toggleFaq = (index) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Efecto para hacer scroll a la sección correspondiente cuando se carga la página
  useEffect(() => {
    if (scrollToSection) {
      // Esperar a que el DOM esté completamente renderizado
      setTimeout(() => {
        const sectionId = `add-info__${scrollToSection}`;
        const section = document.getElementById(sectionId);
        if (section) {
          const headerOffset = 100; // Compensar header sticky
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Si no hay sección específica, scroll al inicio
      window.scrollTo(0, 0);
    }
  }, [scrollToSection]);

  const { currentTheme } = useTheme();
  return (
    <div className={`landing landing--${currentTheme}`}>
      {/* HEADER */}
      <Header
        logo="Dynamic Events"
        className={`landing-header landing-header--${currentTheme}`}
        sticky
        variant="light"
        onLogoClick={onNavigateToLanding || onBack}
        showThemeSelector={true}
      >
        <a href="#minijuegos" className="nav-link" onClick={(e) => { 
          e.preventDefault(); 
          if (onNavigateToMinijuegos) {
            onNavigateToMinijuegos();
          }
        }}>
          Minijuegos
        </a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); if (onNavigateToCreateHistory) onNavigateToCreateHistory(); }}>
          Crear historia IA
        </a>
      </Header>

      {/* HERO */}
      <section className="hero hero--index-navidad hero--red-page add-info-hero">
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              Información del sitio
            </h1>
            <p className="hero-synopsis">
              Conoce nuestras políticas, preguntas frecuentes y la forma correcta de usar Desing Events.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="landing-section landing-section--padding">
        <div className="add-info__content-wrapper">
          
          {/* SECCIÓN: Políticas del sitio */}
          <div id="add-info__policies" className="add-info__section">
            <div className="add-info__section-inner">
              <div className="add-info__section-content">
              <div className="add-info__section-text">
                <h2 className="add-info__section-title">Políticas del sitio</h2>
                <p className="add-info__intro-text">
                  Desing Events es una plataforma creativa enfocada en historias interactivas y minijuegos temáticos. 
                  Nuestro objetivo es ofrecer una experiencia segura, divertida y familiar.
                </p>
                
                <div className="add-info__policy-item">
                  <h3 className="add-info__policy-number">1. Naturaleza del contenido</h3>
                  <ul className="add-info__list">
                    <li>Incluye historias, minijuegos y contenido creado con IA.</li>
                    <li>El contenido está orientado a un público familiar.</li>
                    <li>El material es educativo y recreativo.</li>
                  </ul>
                </div>

                <div className="add-info__policy-item">
                  <h3 className="add-info__policy-number">2. Uso permitido del sitio</h3>
                  <ul className="add-info__list">
                    <li>Para uso personal y educativo.</li>
                    <li>No se permite el uso comercial sin autorización.</li>
                    <li>No se permite copiar o redistribuir el contenido como propio.</li>
                  </ul>
                </div>

                <div className="add-info__policy-item">
                  <h3 className="add-info__policy-number">3. Público objetivo</h3>
                  <ul className="add-info__list">
                    <li>Dirigido a todas las audiencias.</li>
                    <li>Se recomienda supervisión para menores.</li>
                  </ul>
                </div>

                <div className="add-info__policy-item">
                  <h3 className="add-info__policy-number">4. Contenido generado con IA</h3>
                  <ul className="add-info__list">
                    <li>Algunas historias son generadas con IA y revisadas manualmente.</li>
                    <li>Puede haber variaciones menores en el contenido.</li>
                  </ul>
                </div>

                <div className="add-info__policy-item">
                  <h3 className="add-info__policy-number">5. Privacidad</h3>
                  <ul className="add-info__list">
                    <li>No solicitamos datos sensibles.</li>
                    <li>Los datos de historias y puntuaciones se almacenan localmente en tu navegador.</li>
                    <li>No compartimos información con terceros.</li>
                  </ul>
                </div>
              </div>
              <div className="add-info__section-image">
                <img 
                  src="/images/dwarf.png" 
                  alt="Elfo navideño" 
                  className="add-info__image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const emojiDiv = document.createElement('div');
                    emojiDiv.style.fontSize = '8rem';
                    emojiDiv.textContent = '🎁';
                    emojiDiv.style.textAlign = 'center';
                    e.target.parentElement.appendChild(emojiDiv);
                  }}
                />
              </div>
            </div>
            </div>
          </div>

          {/* SECCIÓN: Preguntas frecuentes */}
          <div id="add-info__faq" className="add-info__section">
            <div className="add-info__section-inner">
            <h2 className="add-info__section-title">Preguntas frecuentes</h2>
            
            <div className="add-info__faq-item">
              <button 
                className="add-info__faq-header add-info__faq-button"
                onClick={() => toggleFaq(0)}
                aria-expanded={openFaqs[0] || false}
              >
                <span className="add-info__faq-icon">{openFaqs[0] ? '−' : '+'}</span>
                <h3 className="add-info__faq-question">¿Necesito registrarme para usar Desing Events?</h3>
              </button>
              {openFaqs[0] && (
                <p className="add-info__faq-answer">
                  No, no es necesario registrarse. Puedes usar todas las funcionalidades de Desing Events de forma gratuita 
                  sin crear una cuenta. Todas tus historias y puntuaciones se guardan localmente en tu navegador.
                </p>
              )}
            </div>

            <div className="add-info__faq-item">
              <button 
                className="add-info__faq-header add-info__faq-button"
                onClick={() => toggleFaq(1)}
                aria-expanded={openFaqs[1] || false}
              >
                <span className="add-info__faq-icon">{openFaqs[1] ? '−' : '+'}</span>
                <h3 className="add-info__faq-question">¿Las historias generadas cambian cada vez?</h3>
              </button>
              {openFaqs[1] && (
                <p className="add-info__faq-answer">
                  Sí, las historias generadas con IA son únicas cada vez que las creas. Aunque uses el mismo tema, 
                  la inteligencia artificial creará una versión diferente basada en tus interacciones y preferencias.
                </p>
              )}
            </div>

            <div className="add-info__faq-item">
              <button 
                className="add-info__faq-header add-info__faq-button"
                onClick={() => toggleFaq(2)}
                aria-expanded={openFaqs[2] || false}
              >
                <span className="add-info__faq-icon">{openFaqs[2] ? '−' : '+'}</span>
                <h3 className="add-info__faq-question">¿Puedo usar el contenido para mis clases?</h3>
              </button>
              {openFaqs[2] && (
                <p className="add-info__faq-answer">
                  Sí, puedes usar el contenido de Desing Events para fines educativos. Las historias y minijuegos 
                  están diseñados para ser educativos y recreativos. Sin embargo, no se permite el uso comercial 
                  sin autorización previa.
                </p>
              )}
            </div>

            <div className="add-info__faq-item">
              <button 
                className="add-info__faq-header add-info__faq-button"
                onClick={() => toggleFaq(3)}
                aria-expanded={openFaqs[3] || false}
              >
                <span className="add-info__faq-icon">{openFaqs[3] ? '−' : '+'}</span>
                <h3 className="add-info__faq-question">¿Los minijuegos funcionan en celulares?</h3>
              </button>
              {openFaqs[3] && (
                <p className="add-info__faq-answer">
                  Sí, los minijuegos están optimizados para funcionar en dispositivos móviles. Recomendamos usar 
                  navegadores modernos como Google Chrome, Edge o Safari para la mejor experiencia.
                </p>
              )}
            </div>
            </div>
          </div>

          {/* SECCIÓN: Instrucciones y ayuda */}
          <div id="add-info__instructions" className="add-info__section">
            <div className="add-info__section-inner">
              <div className="add-info__section-content">
              <div className="add-info__section-text">
                <h2 className="add-info__section-title">Instrucciones y ayuda</h2>
                <p className="add-info__intro-text">
                  Si es tu primera vez en Desing Events, te recomendamos:
                </p>
                
                <ul className="add-info__list add-info__list--instructions">
                  <li>Explora la historia destacada en la página principal.</li>
                  <li>Prueba el minijuego disponible.</li>
                  <li>Usa Google Chrome, Edge o Safari para la mejor experiencia.</li>
                  <li>Recarga la página si un minijuego no carga correctamente.</li>
                </ul>

                <div className="add-info__help-section">
                  <h3 className="add-info__help-title">¿Cómo usar Dynamic Events?</h3>
                  <p className="add-info__help-text">
                    <strong>1. Historias con IA:</strong> Navega a la sección "Crear historia IA" y crea tu propia 
                    historia navideña interactuando con Santa Claus. Puedes elegir un tema predefinido o crear uno 
                    completamente original.
                  </p>
                  <p className="add-info__help-text">
                    <strong>2. Minijuegos:</strong> Accede a la sección "Minijuegos" para disfrutar de juegos temáticos 
                    navideños. ¡Intenta superar tu récord personal!
                  </p>
                  <p className="add-info__help-text">
                    <strong>3. Navegación:</strong> Usa los botones del header para moverte entre las diferentes secciones. 
                    El logo "Dynamic Events" siempre te llevará de vuelta a la página principal.
                  </p>
                  <p className="add-info__help-text">
                    <strong>4. Temas:</strong> Explora los diferentes temas de historias disponibles en el carrusel de la 
                    página principal.
                  </p>
                </div>
              </div>
              <div className="add-info__section-image">
                <img 
                  src="/images/dwarfSled.png" 
                  alt="Trineo navideño" 
                  className="add-info__image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const emojiDiv = document.createElement('div');
                    emojiDiv.style.fontSize = '8rem';
                    emojiDiv.textContent = '🛷';
                    emojiDiv.style.textAlign = 'center';
                    e.target.parentElement.appendChild(emojiDiv);
                  }}
                />
              </div>
            </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer
        onNavigateToLanding={onNavigateToLanding}
        onBack={onBack}
        onNavigateToChat={onNavigateToChat}
        onNavigateToCreateHistory={onNavigateToCreateHistory}
        onNavigateToAddInfo={undefined}
        onNavigateToAboutUs={onNavigateToAboutUs}
        isAddInfoPage={true}
      />

      {/* SCROLL TO TOP */}
      <ScrollToTop variant="primary" position="bottom-right" hideAtFooter={false} />
    </div>
  );
}

