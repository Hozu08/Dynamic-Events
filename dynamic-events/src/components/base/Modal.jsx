import { useEffect } from "react";
import "../../styles/base/modal.css";

/**
 * Modal - Componente reutilizable de modal
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Handler para cerrar
 * @param {React.ReactNode} props.children - Contenido del modal
 * @param {string} props.size - Tamaño del modal (sm, md, lg, full)
 * @param {string} props.className - Clases adicionales
 */
export function Modal({ isOpen, onClose, children, size = "md", className = "" }) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay modal-overlay--dark" onClick={onClose}>
      <div
        className={`modal modal--${size} modal--white ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

