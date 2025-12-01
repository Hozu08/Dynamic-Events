import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getAllThemes } from "../../config/themes";
import "../../styles/base/mobile-theme-selector.css";

/**
 * MobileThemeSelector - Componente específico para el selector de temas en el menú hamburguesa
 * Replica la lógica del dropdown de escritorio pero con estilos simplificados para mobile
 */
export function MobileThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentTheme, changeTheme } = useTheme();
  const allThemes = getAllThemes();

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

  const handleItemClick = (theme) => {
    changeTheme(theme.id);
    setIsOpen(false);
  };

  if (allThemes.length === 0) return null;

  return (
    <div className="mobile-theme-selector" ref={dropdownRef}>
      <button
        className="mobile-theme-selector__trigger"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <span className="mobile-theme-selector__label">Escoger época</span>
        <span className={`mobile-theme-selector__arrow ${isOpen ? "mobile-theme-selector__arrow--open" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mobile-theme-selector__menu">
          {allThemes.map((theme) => (
            <button
              key={theme.id}
              className={`mobile-theme-selector__item mobile-theme-selector__item--${theme.id}`}
              onClick={() => handleItemClick(theme)}
              type="button"
            >
              <span className="mobile-theme-selector__item-label">{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


