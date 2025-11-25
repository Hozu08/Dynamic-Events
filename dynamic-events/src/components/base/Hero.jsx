import "../../styles/base/hero.css";

/**
 * Hero - Componente reutilizable de sección hero
 * 
 * @param {Object} props
 * @param {string} props.title - Título principal
 * @param {string} props.subtitle - Subtítulo
 * @param {React.ReactNode} props.children - Contenido adicional
 * @param {string} props.backgroundImage - URL de imagen de fondo
 * @param {string} props.className - Clases adicionales
 */
export function Hero({
  title,
  subtitle,
  children,
  backgroundImage,
  className = "",
}) {
  return (
    <section className={`hero ${className}`}>
      {backgroundImage && (
        <div
          className="hero__background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="hero__content">
        {title && <h1 className="hero__title">{title}</h1>}
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

