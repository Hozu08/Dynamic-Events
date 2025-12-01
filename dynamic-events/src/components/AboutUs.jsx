import { useTheme } from "../context/ThemeContext";
import { Header } from "./base/Header";
import { ScrollToTop } from "./base/ScrollToTop";
import { Footer } from "./base/Footer";
import "../styles/variables.css";
import "../styles/ChristmasLanding.css";
import "../styles/AboutUs.css";
import "../styles/base/utilities.css";

/**
 * AboutUs - Página de información sobre Dynamic Events y SappCode
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Callback para volver a la landing
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 * @param {Function} props.onNavigateToCreateHistory - Callback para navegar a crear historia
 * @param {Function} props.onNavigateToMinijuegos - Callback para navegar a la sección de minijuegos
 * @param {Function} props.onNavigateToLanding - Callback para navegar a la landing
 * @param {Function} props.onNavigateToAddInfo - Callback para navegar a AddInfo
 * @param {Function} props.onNavigateToAboutUs - Callback para navegar a AboutUs
 */
export function AboutUs({ onBack, onNavigateToChat, onNavigateToCreateHistory, onNavigateToMinijuegos, onNavigateToLanding, onNavigateToAddInfo, onNavigateToAboutUs }) {
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
      <section className="hero hero--index-navidad hero--red-page about-us-hero">
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              Conócenos
          </h1>
            <p className="hero-synopsis">
            Dynamic Events es un sitio web creado por SappCode Web Experience que combina diseño temático, narrativa interactiva y tecnología de IA para crear experiencias únicas según cada época del año.
          </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="landing-section landing-section--padding">
        <div className="about-us__content-wrapper">
          
          {/* SECCIÓN: ¿Qué es Dynamic Events? */}
          <div className="about-us__section about-us__what-is">
            <div className="about-us__what-is-content">
              <div className="about-us__what-is-text">
                <h2 className="about-us__section-title">¿Qué es Dynamic Events?</h2>
                <p className="about-us__text">
                  Dynamic Events es una plataforma inmersiva e interactiva que transforma cada temporada del año en una experiencia única y personalizada. A través de un diseño temático cuidadosamente elaborado, narrativa interactiva y la integración de inteligencia artificial, creamos un universo donde cada época del año cobra vida de manera especial.
                </p>
                <p className="about-us__text">
                  Nuestras experiencias se adaptan a diferentes temas según la época:
                </p>
                <ul className="about-us__list">
                  <li><strong>Halloween:</strong> historias de misterio y aventuras sobrenaturales.</li>
                  <li><strong>Navidad:</strong> relatos llenos de magia, esperanza y unión familiar.</li>
                  <li><strong>Vacaciones:</strong> experiencias ligeras, alegres y llenas de energía estival.</li>
                </ul>
                <p className="about-us__text">
                  Además, ofrecemos historias personalizadas guiadas por IA y minijuegos temáticos que complementan cada temporada, creando una experiencia completa y envolvente.
                </p>
              </div>
              <div className="about-us__what-is-image">
                <img 
                  src={currentTheme === 'halloween' 
                    ? "https://images.pexels.com/photos/4997839/pexels-photo-4997839.jpeg?_gl=1*1neak1v*_ga*NDEzMjY2MzYzLjE3NjQ1NDk5MDg.*_ga_8JE65Q40S6*czE3NjQ1NTY3MDYkbzIkZzEkdDE3NjQ1NTY3MDckajU5JGwwJGgw"
                    : "/images/cracker.png"
                  } 
                  alt={currentTheme === 'halloween' ? "Imagen de Halloween" : "Árbol de Navidad decorado"} 
                  className="about-us__image" 
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN: Cómo vivimos cada temporada */}
          <div className="about-us__section about-us__seasons">
            <h2 className="about-us__section-title about-us__section-title--center">Cómo vivimos cada temporada</h2>
            <div className="about-us__cards-grid">
              <div className="about-us__card">
                <h3 className="about-us__card-title">Experiencia inmersiva</h3>
                <p className="about-us__card-text">
                  Sumérgete en un mundo temático completo donde cada elemento, desde los colores hasta las interacciones, está diseñado para transportarte a la época del año que estás viviendo.
                </p>
              </div>
              <div className="about-us__card">
                <h3 className="about-us__card-title">IA para historias únicas</h3>
                <p className="about-us__card-text">
                  Nuestra inteligencia artificial crea narrativas personalizadas que se adaptan a tus preferencias y decisiones, garantizando que cada historia sea única y especial para ti.
                </p>
              </div>
              <div className="about-us__card">
                <h3 className="about-us__card-title">Público al que nos dirigimos</h3>
                <p className="about-us__card-text">
                  Diseñado para todas las edades, Dynamic Events ofrece experiencias educativas, lúdicas y emocionales que pueden disfrutarse en familia o de manera individual.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN: SappCode Web Experience - Full width */}
      <section className="about-us__sappcode-section">
        <div className="about-us__sappcode-wrapper">
          <h2 className="about-us__section-title about-us__section-title--center">SappCode Web Experience</h2>
          <p className="about-us__intro-text">
            Dynamic Events forma parte del universo creativo de SappCode Web Experience, un espacio donde el diseño web, la narrativa y la tecnología se unen para crear experiencias educativas, lúdicas y emocionales. Así se reparte la magia en el taller:
          </p>
          <div className="about-us__sappcode-cards">
            <div className="about-us__sappcode-card">
              <div className="about-us__sappcode-icon">
                <span className="about-us__sappcode-letter">D</span>
              </div>
              <h3 className="about-us__sappcode-card-title">Diseño temático</h3>
              <p className="about-us__sappcode-card-text">
                Cuidamos cada detalle visual para que Halloween, Navidad y Vacaciones tengan identidad propia, pero mantengan la esencia cálida de Dynamic Events.
              </p>
            </div>
            <div className="about-us__sappcode-card">
              <div className="about-us__sappcode-icon">
                <span className="about-us__sappcode-letter">N</span>
              </div>
              <h3 className="about-us__sappcode-card-title">Narrativa interactiva</h3>
              <p className="about-us__sappcode-card-text">
                Creamos historias que conversan con el usuario, lo invitan a tomar decisiones y lo convierten en protagonista de cada temporada.
              </p>
            </div>
            <div className="about-us__sappcode-card">
              <div className="about-us__sappcode-icon">
                <span className="about-us__sappcode-letter">IA</span>
              </div>
              <h3 className="about-us__sappcode-card-title">Inteligencia artificial</h3>
              <p className="about-us__sappcode-card-text">
                Integramos IA para adaptar las historias y minijuegos, manteniendo siempre un enfoque seguro, creativo y de uso personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer
        onNavigateToLanding={onNavigateToLanding}
        onBack={onBack}
        onNavigateToCreateHistory={onNavigateToCreateHistory}
        onNavigateToAddInfo={onNavigateToAddInfo}
        onNavigateToAboutUs={onNavigateToAboutUs}
      />

      {/* SCROLL TO TOP */}
      <ScrollToTop variant="primary" position="bottom-right" />
    </div>
  );
}

