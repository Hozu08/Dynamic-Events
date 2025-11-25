import "../../styles/base/button.css";

/**
 * Button - Componente reutilizable de botón
 * 
 * @param {Object} props
 * @param {string} props.variant - Variante del botón (primary, secondary, pill, etc.)
 * @param {string} props.size - Tamaño (sm, md, lg)
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} props.className - Clases adicionales
 * @param {Function} props.onClick - Handler de click
 * @param {boolean} props.disabled - Si está deshabilitado
 * @param {string} props.type - Tipo de botón (button, submit, reset)
 */
export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

