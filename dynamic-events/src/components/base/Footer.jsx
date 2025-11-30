import "../../styles/base/footer.css";

/**
 * Footer - Componente reutilizable para el footer de todas las páginas
 * 
 * @param {Object} props
 * @param {Function} props.onNavigateToLanding - Callback para navegar a la landing
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat
 * @param {Function} props.onNavigateToCreateHistory - Callback para navegar a crear historia
 * @param {Function} props.onNavigateToAddInfo - Callback para navegar a AddInfo
 * @param {Function} props.onNavigateToAboutUs - Callback para navegar a AboutUs
 * @param {Function} props.onBack - Callback alternativo para volver (usado en algunas páginas)
 * @param {boolean} props.isAddInfoPage - Si es true, los links de información hacen scroll interno
 */
export function Footer({ 
  onNavigateToLanding, 
  onNavigateToChat, 
  onNavigateToCreateHistory,
  onNavigateToAddInfo,
  onNavigateToAboutUs,
  onBack,
  isAddInfoPage = false
}) {
  // Función helper para navegar a landing
  const handleNavigateToLanding = (e) => {
    e.preventDefault();
    if (onNavigateToLanding) {
      onNavigateToLanding();
    } else if (onBack) {
      onBack();
    }
  };

  // Función helper para navegar a AddInfo con scroll
  const handleNavigateToAddInfo = (e, section) => {
    e.preventDefault();
    if (isAddInfoPage) {
      // Si estamos en AddInfo, hacer scroll interno
      const sectionId = `add-info__${section}`;
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        const headerOffset = 100;
        const elementPosition = sectionElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else if (onNavigateToAddInfo) {
      // Si no estamos en AddInfo, navegar a la página
      onNavigateToAddInfo(section);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Navegación */}
        <div className="footer-column">
          <h3>Navegación</h3>
          <a href="#" onClick={handleNavigateToLanding}>Inicio</a>
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            if (onNavigateToChat) {
              onNavigateToChat();
            } else if (onNavigateToCreateHistory) {
              onNavigateToCreateHistory();
            }
          }}>Crear historias con IA</a>
        </div>
        
        {/* Información */}
        <div className="footer-column">
          <h3>Información</h3>
          <a href="#" onClick={(e) => handleNavigateToAddInfo(e, 'policies')}>Políticas del sitio</a>
          <a href="#" onClick={(e) => handleNavigateToAddInfo(e, 'faq')}>Preguntas frecuentes</a>
          <a href="#" onClick={(e) => handleNavigateToAddInfo(e, 'instructions')}>Instrucciones y ayuda</a>
        </div>
        
        {/* Empresa */}
        <div className="footer-column">
          <h3>Sobre la empresa</h3>
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            if (onNavigateToAboutUs) {
              onNavigateToAboutUs();
            }
          }}>Conócenos</a>
          <a href="#" onClick={(e) => { e.preventDefault(); }}>Instagram</a>
          <a href="#" onClick={(e) => { e.preventDefault(); }}>Facebook</a>
        </div>
      </div>
    </footer>
  );
}

