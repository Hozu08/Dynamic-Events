import { useState, useEffect } from "react";
import "../../styles/base/scroll-to-top.css";

/**
 * ScrollToTop - Componente reutilizable para hacer scroll al inicio de la página
 * 
 * @param {Object} props
 * @param {number} props.showAfter - Píxeles de scroll antes de mostrar el botón (default: 300)
 * @param {string} props.variant - Variante visual (primary, secondary, etc.)
 * @param {string} props.position - Posición del botón (bottom-right, bottom-left, etc.)
 * @param {string} props.className - Clases adicionales
 * @param {React.ReactNode} props.children - Contenido personalizado del botón
 * @param {boolean} props.hideAtFooter - Si es true, oculta el botón cuando el scroll llega al footer (default: false)
 */
export function ScrollToTop({
  showAfter = 300,
  variant = "primary",
  position = "bottom-right",
  className = "",
  children,
  hideAtFooter = false,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Verificar si estamos en el footer
      if (hideAtFooter) {
        const footer = document.querySelector('footer.footer');
        if (footer) {
          const footerTop = footer.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          // Si el footer está visible o comenzando a aparecer en la pantalla, ocultar el botón
          // Cuando footerTop es menor que windowHeight, significa que el footer está visible
          if (footerTop < windowHeight) {
            setIsVisible(false);
            return;
          }
        }
      }

      // Mostrar el botón si hemos scrolleado más de showAfter píxeles
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showAfter, hideAtFooter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-to-top scroll-to-top--${variant} scroll-to-top--${position} ${isVisible ? "scroll-to-top--visible" : ""} ${className}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
      type="button"
    >
      {children || "↑"}
    </button>
  );
}

