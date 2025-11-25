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
  onLogoClick 
}) {
  const logoColorClass = variant === "dark" ? "white" : "primary";
  
  return (
    <header className={`header ${sticky ? "header--sticky" : ""} header--${variant} ${className}`}>
      <div 
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
      </div>
      <nav className="header__nav">{children}</nav>
    </header>
  );
}

