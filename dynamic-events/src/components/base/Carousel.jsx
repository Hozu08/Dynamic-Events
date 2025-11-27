import { useState } from "react";
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
  
  // Calcular el máximo índice para evitar sobreposición
  // Mostramos 3 items a la vez, así que el máximo es items.length - 3
  const maxIndex = Math.max(0, items.length - 3);

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
            transform: `translateX(-${currentIndex * (350 + 48)}px)`,
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

