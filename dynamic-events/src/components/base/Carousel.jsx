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

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (items.length === 0) return null;

  return (
    <div className={`carousel ${className}`}>
      {showControls && (
        <button className="carousel__button carousel__button--prev" onClick={prev}>
          ‹
        </button>
      )}
      <div className="carousel__track">
        {items.map((item, index) => (
          <div
            key={index}
            className="carousel__item"
            style={{
              transform: `translateX(-${currentIndex * 110}%)`,
              transition: "transform 0.5s ease",
            }}
          >
            {renderItem ? renderItem(item, index) : item}
          </div>
        ))}
      </div>
      {showControls && (
        <button className="carousel__button carousel__button--next" onClick={next}>
          ›
        </button>
      )}
    </div>
  );
}

