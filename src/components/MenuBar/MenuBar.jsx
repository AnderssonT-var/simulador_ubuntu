import "./MenuBar.css";
import { useEffect, useMemo, useState } from "react";

function formatDateTime(date) {
  const locale = "es-EC";

  const parts = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const wd = (map.weekday || "").replace(".", "");
  const mo = (map.month || "").replace(".", "");

  return `${wd} ${map.day} ${mo} ${map.hour}:${map.minute}`;
}

export default function MenuBar({ onActivities, onClock }) {

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const label = useMemo(() => formatDateTime(now), [now]);

  return (
    <header className="menuBar">

      {/* IZQUIERDA */}
      <div className="menuBar__left">

        <button
          className="menuBar__activities"
          type="button"
          onClick={onActivities}
        >
          Actividades
        </button>

      </div>

      {/* CENTRO */}
      <div className="menuBar__center">

        <button
          className="menuBar__clock"
          type="button"
          onClick={onClock}
        >
          {label}
        </button>

      </div>

      {/* DERECHA */}
      <div className="menuBar__right">

        <span className="menuBar__icon">📶</span>

        <span className="menuBar__icon">🔊</span>

        <span className="menuBar__battery">
          100%
        </span>

      </div>

    </header>
  );
}