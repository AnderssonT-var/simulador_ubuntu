import { useState, useEffect } from "react";
import "./BootScreen.css";

export default function BootScreen({ onComplete }) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      // Esperar a que la animación de salida termine
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 2500); // Mostrar durante 2.5 segundos

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isActive) return null;

  return (
    <div className="bootscreen">
      <div className="bootscreen-content">
        <div className="bootscreen-logo">
          <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            className="unibe-logo"
          >
            {/* Fondo amarillo */}
            <rect width="400" height="400" fill="#F4C430" />

            {/* Texto UNIBE */}
            <text
              x="200"
              y="160"
              fontSize="120"
              fontWeight="bold"
              fontFamily="Georgia, serif"
              fill="#003DA5"
              textAnchor="middle"
              letterSpacing="-2"
            >
              UNI
            </text>
            <text
              x="200"
              y="280"
              fontSize="120"
              fontWeight="bold"
              fontFamily="Georgia, serif"
              fill="#003DA5"
              textAnchor="middle"
              letterSpacing="-2"
            >
              B.E.
            </text>

            {/* Punto decorativo */}
            <circle cx="210" cy="310" r="12" fill="#003DA5" />
          </svg>
        </div>

        <div className="bootscreen-text">
          <p>Iniciando Sistema...</p>
        </div>

        <div className="bootscreen-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
