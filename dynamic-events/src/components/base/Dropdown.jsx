import { useState, useRef, useEffect } from "react";
import "../../styles/base/dropdown.css";

/**
 * Dropdown - Componente reutilizable de menú desplegable
 * 
 * @param {Object} props
 * @param {string} props.label - Texto del botón que abre el dropdown
 * @param {Array} props.items - Array de items del menú [{ label, onClick, icon? }]
 * @param {string} props.variant - Variante visual (primary, secondary, etc.)
 * @param {string} props.size - Tamaño (sm, md, lg)
 * @param {string} props.className - Clases adicionales
 * @param {string} props.position - Posición del dropdown (bottom-left, bottom-right, bottom-center)
 */
export function Dropdown({
  label = "Menú",
  items = [],
  variant = "primary",
  size = "md",
  className = "",
  position = "bottom-left",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar al presionar ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  if (items.length === 0) return null;

  return (
    <div className={`dropdown dropdown--${variant} dropdown--${size} ${className}`} ref={dropdownRef}>
      <button
        className={`dropdown__trigger dropdown__trigger--${variant}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        {label}
        <span className={`dropdown__arrow ${isOpen ? "dropdown__arrow--open" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={`dropdown__menu dropdown__menu--${position}`}>
          {items.map((item, index) => (
            <button
              key={index}
              className="dropdown__item"
              onClick={() => handleItemClick(item)}
              type="button"
            >
              {item.icon && <span className="dropdown__item-icon">{item.icon}</span>}
              <span className="dropdown__item-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

