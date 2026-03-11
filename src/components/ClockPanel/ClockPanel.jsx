import "./ClockPanel.css";
import { useEffect, useState } from "react";

export default function ClockPanel({ open, onClose }) {

  const [weather, setWeather] = useState(null);

  /* cerrar con ESC */

  useEffect(() => {

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);

  }, [onClose]);

  /* obtener clima */

  useEffect(() => {

    const fetchWeather = async () => {

      try {

        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-0.22&longitude=-78.51&current_weather=true"
        );

        const data = await res.json();

        setWeather(data.current_weather);

      } catch (err) {

        console.error("Error clima:", err);

      }

    };

    fetchWeather();

  }, []);

  if (!open) return null;

  const today = new Date();

  const day = today.toLocaleDateString("es-EC", {
    weekday: "long"
  });

  const date = today.toLocaleDateString("es-EC", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (

    <div
      className="clockPanelOverlay"
      onClick={onClose}
    >

      <div
        className="clockPanel"
        onClick={(e) => e.stopPropagation()}
      >

        {/* IZQUIERDA */}

        <div className="clockPanel__left">

          <div className="notification">

            <span className="notificationIcon">💾</span>

            <div>

              <strong>
                Se puede desconectar USB Flash
              </strong>

              <p>Se puede quitar el dispositivo</p>

            </div>

          </div>

          <div className="clockPanel__footer">

            <span>No molestar</span>

            <button className="switch"/>

            <button className="clearBtn">
              Limpiar
            </button>

          </div>

        </div>

        {/* DERECHA */}

        <div className="clockPanel__right">

          <h3>{day}</h3>

          <h1>{date}</h1>

          {/* CALENDARIO */}

          <div className="calendarBox">

            <p>Calendario</p>

            <div className="calendarGrid">

              {[...Array(30)].map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}

            </div>

          </div>

          {/* CLIMA */}

          <div className="weatherBox">

            {weather ? (

              <>

                <div className="weatherTemp">
                  🌤 {weather.temperature}°C
                </div>

                <div className="weatherWind">
                  Viento {weather.windspeed} km/h
                </div>

              </>

            ) : (

              <p>Cargando clima...</p>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}