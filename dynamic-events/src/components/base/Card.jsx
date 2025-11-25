import "../../styles/base/card.css";

/**
 * Card - Componente reutilizable de tarjeta
 * 
 * @param {Object} props
 * @param {string} props.variant - Variante de color (green, brown, red, etc.)
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @param {string} props.className - Clases adicionales
 * @param {Function} props.onClick - Handler de click
 * @param {boolean} props.interactive - Si la tarjeta es clickeable
 */
export function Card({
  variant = "",
  children,
  className = "",
  onClick,
  interactive = false,
}) {
  const baseClass = "card";
  const variantClass = variant ? `card--${variant}` : "";
  const interactiveClass = interactive ? "card--interactive" : "";

  return (
    <div
      className={`${baseClass} ${variantClass} ${interactiveClass} ${className}`}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
}

