import "../Window/Window.css";
import "./SettingsWindow.css";
import { useEffect, useMemo, useState } from "react";
import { LuX, LuMinus, LuPlus } from "react-icons/lu";
import { useWindowDrag } from "../../hooks/useWindowDrag";

export default function SettingsWindow({
  title = "Configuración",
  width = 560,
  height = 360,
  x = 140,
  y = 120,
  stageRef,
  minimized = false,
  maximized = false,
  onClose,
  onMinimize,
  onMaximize,
  onSelectWallpaper,
  currentWallpaper,
  isActive = false,
  zIndex = 1,
  onFocus,
}) {
  const drag = useWindowDrag({
    initialX: x,
    initialY: y,
    width,
    edgePadding: 120,
    overflow: 30,
    containerRef: stageRef,
  });

  const [wallpapers, setWallpapers] = useState([]);

  useEffect(() => {
    let alive = true;

    fetch("/wallpapers/wallpapers.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (alive) setWallpapers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (alive) setWallpapers([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => wallpapers ?? [], [wallpapers]);

  const DOCK_WIDTH = 64;
  const MENU_HEIGHT = 34;

  const winWidth = maximized ? `calc(100% - ${DOCK_WIDTH}px)` : `${width}px`;
  const winHeight = maximized ? `calc(100% - ${MENU_HEIGHT}px)` : `${height}px`;

  const winTransform = maximized
    ? `translate(${DOCK_WIDTH}px, ${MENU_HEIGHT}px)`
    : `translate(${drag.x}px, ${drag.y}px)`;

  return (
    <section
      className={`window ${minimized ? "window--minimized" : ""} ${
        maximized ? "window--maximized" : ""
      } ${isActive ? "window--active" : "window--inactive"}`}
      style={{
        width: winWidth,
        height: winHeight,
        zIndex,
        transform: winTransform,
      }}
      aria-label={`Ventana ${title}`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus?.();
      }}>
      <div className="window__frame">
        <header className="window__titlebar" {...drag.bindTitlebar}>
          <div className="window__traffic">
            <button
              className="window__dotBtn window__dotBtn--red"
              type="button"
              aria-label="Cerrar"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}>
              <LuX className="window__dotIcon" />
            </button>

            <button
              className="window__dotBtn window__dotBtn--yellow"
              type="button"
              aria-label="Minimizar"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize?.();
              }}>
              <LuMinus className="window__dotIcon" />
            </button>

            <button
              className="window__dotBtn window__dotBtn--green"
              type="button"
              aria-label={maximized ? "Restaurar" : "Maximizar"}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMaximize?.();
              }}>
              <LuPlus className="window__dotIcon" />
            </button>
          </div>

          <div className="window__title">{title}</div>
          <div className="window__spacer" />
        </header>

        <div className="window__body">
          <aside className="window__sidebar" aria-label="Secciones">
            <button
              type="button"
              className="window__sideItem window__sideItem--active">
              Fondos
            </button>
          </aside>

          <section className="window__content">
            <div className="settings__grid">
              {items.map((wp) => {
                const active = wp.src === currentWallpaper;

                return (
                  <button
                    key={wp.id}
                    type="button"
                    className={`settings__thumb ${
                      active ? "settings__thumb--active" : ""
                    }`}
                    onClick={() => onSelectWallpaper?.(wp.src)}
                    aria-label={`Seleccionar ${wp.id}`}>
                    <img src={`/${wp.src}`} alt="" draggable="false" />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
