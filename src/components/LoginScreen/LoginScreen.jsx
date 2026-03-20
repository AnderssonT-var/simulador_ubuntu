import { useState, useEffect } from "react";
import "./LoginScreen.css";

export default function LoginScreen({ onLoginComplete }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-login
  useEffect(() => {
    const fullPassword = "123";
    let charIndex = 0;

    // Esperar 500ms y luego empezar a rellenar con animación
    const startTimer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < fullPassword.length) {
          setPassword(fullPassword.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          
          // Esperar 300ms más y luego hacer login
          setTimeout(() => {
            setIsLoading(true);
            
            // Simular proceso de login
            setTimeout(() => {
              onLoginComplete?.();
            }, 800);
          }, 300);
        }
      }, 100); // Velocidad de escritura (100ms por carácter)

      return () => clearInterval(typeInterval);
    }, 2000);

    return () => clearTimeout(startTimer);
  }, [onLoginComplete]);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    
    return `${day} de ${getMonthName(date.getMonth())} ${hours}:${minutes}`;
  };

  const getMonthName = (month) => {
    const months = [
      "ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic"
    ];
    return months[month];
  };

  return (
    <div className="login-screen">
      {/* Fondo de gradiente */}
      <div className="login-background"></div>

      {/* Clock en la esquina superior izquierda */}
      <div className="login-clock">
        <span className="clock-text">{formatTime(currentTime)}</span>
      </div>

      {/* Iconos en la esquina superior derecha */}
      <div className="login-top-right">
        <div className="icon-button">⊕</div>
        <div className="icon-button">👥</div>
        <div className="icon-button">🔊</div>
        <div className="icon-button">⊙</div>
        <div className="icon-button">▼</div>
      </div>

      {/* Contenedor central de login */}
      <div className="login-container">
        <div className="user-profile">
          {/* Logo UNIBE en lugar del avatar */}
          <div className="user-avatar">
            <svg
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              className="unibe-logo-login"
            >
              {/* Fondo amarillo */}
              <rect width="400" height="400" fill="#F4C430" rx="80" />

              {/* Texto UNIBE */}
              <text
                x="200"
                y="160"
                fontSize="100"
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
                y="260"
                fontSize="100"
                fontWeight="bold"
                fontFamily="Georgia, serif"
                fill="#003DA5"
                textAnchor="middle"
                letterSpacing="-2"
              >
                B.E.
              </text>

              {/* Punto decorativo */}
              <circle cx="210" cy="290" r="10" fill="#003DA5" />
            </svg>
          </div>

          <h2 className="username">softwareUni.B.E</h2>

          {/* Formulario de login */}
          <form className="login-form">
            <div className="password-input-group">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="password-input"
                readOnly
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>

            <p className="login-hint">(o pase el dedo)</p>

            <button
              type="button"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled
            >
              {isLoading ? "Iniciando sesión..." : "→"}
            </button>
          </form>
        </div>
      </div>

      {/* Logo Ubuntu en la esquina inferior izquierda */}
      <div className="login-footer">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="ubuntu-logo"
        >
          {/* Círculo blanco */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" />
          {/* Puntos de Ubuntu */}
          <circle cx="50" cy="15" r="6" fill="white" />
          <circle cx="72" cy="28" r="6" fill="white" />
          <circle cx="72" cy="72" r="6" fill="white" />
        </svg>
        <span className="footer-text">ubuntu</span>
      </div>

      {/* Icono de configuración en la esquina inferior derecha */}
      <div className="login-settings">
        <button className="settings-button">⚙️</button>
      </div>

      {/* Pantalla de carga */}
      {isLoading && (
        <div className="login-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
