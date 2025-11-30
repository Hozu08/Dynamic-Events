import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getAllThemes } from "../../config/themes";
import { Dropdown } from "./Dropdown";
import "../../styles/base/header.css";

/**
 * Header - Componente reutilizable de encabezado
 * 
 * @param {Object} props
 * @param {string} props.logo - Texto del logo
 * @param {React.ReactNode} props.children - Elementos del nav (botones, links, etc.)
 * @param {string} props.className - Clases adicionales
 * @param {boolean} props.sticky - Si el header debe ser sticky
 * @param {string} props.variant - Variante de color (light, dark)
 * @param {Function} props.onLogoClick - Callback cuando se hace clic en el logo
 */
export function Header({ 
  logo, 
  children, 
  className = "", 
  sticky = true, 
  variant = "light",
  onLogoClick,
  showThemeSelector = true
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { currentTheme, changeTheme } = useTheme();
  const allThemes = getAllThemes();

  const logoColorClass = variant === "dark" ? "white" : "primary";

  // Items del dropdown de temas
  const themeItems = allThemes.map(theme => ({
    label: `${theme.icon} ${theme.name}`,
    onClick: () => changeTheme(theme.id),
    icon: theme.icon,
  }));

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Verificar si el clic no fue en el botón hamburguesa
        const hamburgerButton = document.querySelector('.header__hamburger');
        if (hamburgerButton && !hamburgerButton.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Cerrar menú al presionar ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <>
      <header className={`header header--${currentTheme} ${sticky ? "header--sticky" : ""} header--${variant} ${className}`}>
        <div className="header__container">
          <div className="header__left">
            <button
              className="header__hamburger"
              onClick={toggleMenu}
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
              type="button"
            >
              <span className="header__hamburger-line"></span>
              <span className="header__hamburger-line"></span>
              <span className="header__hamburger-line"></span>
            </button>
            <span 
        className={`header__logo header__logo--${logoColorClass} ${onLogoClick ? "header__logo--clickable" : ""}`}
        onClick={onLogoClick}
        role={onLogoClick ? "button" : undefined}
        tabIndex={onLogoClick ? 0 : undefined}
        onKeyDown={onLogoClick ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onLogoClick();
          }
        } : undefined}
      >
        {logo}
            </span>
          </div>
          <nav className="header__nav header__nav--right">
            {children}
            {showThemeSelector && (
              <Dropdown
                label="Escoger época"
                variant="pill"
                size="md"
                position="bottom-left"
                items={themeItems}
                className="header__theme-selector"
              />
            )}
          </nav>
      </div>
    </header>

      {/* Overlay del menú móvil */}
      <div 
        className={`header__menu-overlay ${isMenuOpen ? "header__menu-overlay--open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>

      {/* Menú lateral móvil */}
      <aside 
        ref={menuRef}
        className={`header__menu-drawer ${isMenuOpen ? "header__menu-drawer--open" : ""}`}
        aria-label="Menú de navegación"
      >
        <div className="header__menu-header">
          <span className={`header__menu-logo header__logo--${logoColorClass}`}>{logo}</span>
          <button
            className="header__menu-close"
            onClick={closeMenu}
            aria-label="Cerrar menú"
            type="button"
          >
            ×
          </button>
        </div>
        <nav 
          className="header__menu-nav" 
          onClick={(e) => {
            // Cerrar menú solo si el click no fue en un dropdown trigger
            const target = e.target;
            const isDropdownTrigger = target.closest('.dropdown__trigger');
            if (!isDropdownTrigger) {
              closeMenu();
            }
          }}
        >
          {children}
          {showThemeSelector && (
            <Dropdown
              label="Escoger época"
              variant="pill"
              size="md"
              position="bottom-left"
              items={themeItems}
              className="header__theme-selector"
            />
          )}
        </nav>
      </aside>
    </>
  );
}

