import { useState, useEffect } from "react";
import "../../styles/base/carousel.css";

/**
 * Carousel - Componente reutilizable de carrusel
 * 
 * @param {Object} props
 * @param {Array} props.items - Array de items a mostrar
 * @param {Function} props.renderItem - Función para renderizar cada item
 * @param {string} props.className - Clases adicionales
 * @param {boolean} props.showControls - Si mostrar controles de navegación
 */
export function Carousel({
  items = [],
  renderItem,
  className = "",
  showControls = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(350);
  const [gap, setGap] = useState(48);
  
  // Calcular el máximo índice para evitar sobreposición
  // Mostramos 3 items a la vez, así que el máximo es items.length - 3
  const maxIndex = Math.max(0, items.length - 3);

  // Detectar tamaño de pantalla y ajustar valores
  useEffect(() => {
    const updateSizes = () => {
      if (window.innerWidth <= 480) {
        setItemWidth(180);
        setGap(12.8); // 0.8rem = 12.8px aproximadamente
      } else if (window.innerWidth <= 768) {
        setItemWidth(220);
        setGap(16); // 1rem = 16px
      } else {
        setItemWidth(350);
        setGap(48); // 3rem = 48px
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (items.length === 0) return null;

  return (
    <div className={`carousel ${className}`}>
      {showControls && (
        <button className="carousel__button carousel__button--prev" onClick={prev} aria-label="Anterior">
          ←
        </button>
      )}
      <div className="carousel__track">
        <div 
          className="carousel__items-wrapper"
          style={{
            transform: `translateX(-${currentIndex * (itemWidth + gap)}px)`,
            transition: "transform 0.5s ease",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="carousel__item"
            >
              {renderItem ? renderItem(item, index) : item}
            </div>
          ))}
        </div>
      </div>
      {showControls && (
        <button className="carousel__button carousel__button--next" onClick={next} aria-label="Siguiente">
          →
        </button>
      )}
    </div>
  );
}

