import { useState, useEffect, useRef } from "react";
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
  const [visibleItems, setVisibleItems] = useState(3);
  const trackRef = useRef(null);
  
  // Calcular el máximo índice dinámicamente según items visibles
  // Permite llegar hasta el último item visible
  const maxIndex = Math.max(0, items.length - visibleItems);

  // Detectar tamaño de pantalla y ajustar valores
  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      let newItemWidth, newGap, newVisibleItems;
      
      if (width <= 480) {
        newItemWidth = 180;
        newGap = 12.8; // 0.8rem = 12.8px aproximadamente
        // En móvil pequeño, típicamente se muestra 1 item a la vez
        newVisibleItems = 1;
      } else if (width <= 768) {
        newItemWidth = 220;
        newGap = 16; // 1rem = 16px
        // En tablet, calcular items visibles basado en el ancho disponible
        if (trackRef.current) {
          const trackWidth = trackRef.current.offsetWidth;
          newVisibleItems = Math.floor(trackWidth / (newItemWidth + newGap));
        } else {
          newVisibleItems = 2; // Fallback para tablet
        }
      } else {
        newItemWidth = 350;
        newGap = 48; // 3rem = 48px
        newVisibleItems = 3; // Desktop muestra 3 items
      }
      
      setItemWidth(newItemWidth);
      setGap(newGap);
      const finalVisibleItems = Math.max(1, newVisibleItems);
      setVisibleItems(finalVisibleItems);
      
      // Ajustar currentIndex si excede el nuevo maxIndex
      setCurrentIndex((prev) => {
        const newMaxIndex = Math.max(0, items.length - finalVisibleItems);
        return Math.min(prev, newMaxIndex);
      });
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, [items.length]);

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
      <div className="carousel__track" ref={trackRef}>
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

