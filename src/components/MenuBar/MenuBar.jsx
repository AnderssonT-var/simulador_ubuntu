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
        <button className="menuBar__icon" type="button" aria-label="Red">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M2 16.5l1.41 1.41C6.09 15.23 8.95 14 12 14s5.91 1.23 8.59 3.91L22 16.5C18.88 13.37 15.55 12 12 12s-6.88 1.37-10 4.5z"/>
            <path fill="currentColor" d="M6.35 13.15l1.41 1.41C9.01 12.8 10.45 12 12 12s2.99.8 4.24 2.56l1.41-1.41C16.18 10.64 14.21 10 12 10s-4.18.64-5.65 3.15z"/>
            <path fill="currentColor" d="M12 8c2.21 0 4.21.64 5.65 1.85l1.41-1.41C16.99 6.09 14.09 5 12 5S7.01 6.09 5.94 8.44l1.41 1.41C7.79 8.64 9.79 8 12 8z"/>
            <path fill="currentColor" d="M12 18c-.83 0-1.5.67-1.5 1.5S11.17 21 12 21s1.5-.67 1.5-1.5S12.83 18 12 18z"/>
          </svg>
        </button>

        <button className="menuBar__icon" type="button" aria-label="Volumen">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M5 9v6h4l5 5V4L9 9H5z"/>
            <path fill="currentColor" d="M14.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"/>
            <path fill="currentColor" d="M16.5 12c0 2.5-1.5 4.65-3.75 5.5l1.5 1.5C17.12 18.28 18.5 15.33 18.5 12s-1.38-6.28-4.25-7.0l-1.5 1.5C15 7.35 16.5 9.5 16.5 12z"/>
          </svg>
        </button>

        <button className="menuBar__battery" type="button" aria-label="Batería">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M16 4h-1V2h-6v2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H8V6h8v14z"/>
            <rect fill="currentColor" x="10" y="10" width="4" height="8" rx="1"/>
          </svg>
          <span className="menuBar__batteryLabel">100%</span>
        </button>
      </div>

    </header>
  );
}