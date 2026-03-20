import "./Window.css";
import { useEffect, useMemo, useState } from "react";
import {
  LuX,
  LuMinus,
  LuPlus,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { createPortal } from "react-dom";
import { useWindowDrag } from "../../hooks/useWindowDrag";
import { useWindowResize } from "../../hooks/useWindowResize";

const TABS = [
  { id: "all", label: "Todo" },
  { id: "photos", label: "Fotos" },
  { id: "videos", label: "Videos" },
];

export default function Window({
  title = "Fotos",
  width = 560,
  height = 360,
  x = 120,
  y = 120,
  stageRef,
  minimized = false,
  maximized = false,
  onClose,
  onMinimize,
  onMaximize,
  isActive = false,
  zIndex = 1,
  onFocus,
}) {
  const [navLock, setNavLock] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [viewer, setViewer] = useState({ open: false, index: 0 });
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);

  const [media, setMedia] = useState({ photos: [], videos: [] });

  useEffect(() => {
    let alive = true;

    fetch("/multimedia/media.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (!alive) return;

        setMedia({
          photos: Array.isArray(data?.photos) ? data.photos : [],
          videos: Array.isArray(data?.videos) ? data.videos : [],
        });
      })
      .catch(() => {
        if (alive) setMedia({ photos: [], videos: [] });
      });

    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    if (activeTab === "photos") return media.photos;
    if (activeTab === "videos") return media.videos;
    return [...media.photos, ...media.videos];
  }, [activeTab, media.photos, media.videos]);

  const openViewer = (index) => setViewer({ open: true, index });
  const closeViewer = () => setViewer({ open: false, index: 0 });

  const prevItem = () => {
    if (navLock || viewer.index === 0) return;

    setNavLock(true);
    setViewer((v) => ({ ...v, index: v.index - 1 }));
    setTimeout(() => setNavLock(false), 120);
  };

  const nextItem = () => {
    if (navLock || viewer.index === items.length - 1) return;

    setNavLock(true);
    setViewer((v) => ({ ...v, index: v.index + 1 }));
    setTimeout(() => setNavLock(false), 120);
  };

  const drag = useWindowDrag({
    initialX: x,
    initialY: y,
    width: currentWidth,
    edgePadding: 120,
    overflow: 30,
    containerRef: stageRef,
  });

  const resize = useWindowResize({
    initialWidth: currentWidth,
    initialHeight: currentHeight,
    minWidth: 300,
    minHeight: 200,
    containerRef: stageRef,
  });

  // Update size state when resize changes
  const [prevResizeWidth, setPrevResizeWidth] = useState(resize.width);
  const [prevResizeHeight, setPrevResizeHeight] = useState(resize.height);

  useEffect(() => {
    if (resize.width !== prevResizeWidth) {
      setCurrentWidth(resize.width);
      setPrevResizeWidth(resize.width);
    }
    if (resize.height !== prevResizeHeight) {
      setCurrentHeight(resize.height);
      setPrevResizeHeight(resize.height);
    }
  }, [resize.width, resize.height, prevResizeWidth, prevResizeHeight]);

  const DOCK_WIDTH = 64;
  const MENU_HEIGHT = 34;

  const winWidth = maximized ? `calc(100% - ${DOCK_WIDTH}px)` : `${currentWidth}px`;
  const winHeight = maximized ? `calc(100% - ${MENU_HEIGHT}px)` : `${currentHeight}px`;

  const winTransform = maximized
    ? `translate(${DOCK_WIDTH}px, ${MENU_HEIGHT}px)`
    : `translate(${drag.x}px, ${drag.y}px)`;

  return (
    <section
      data-window-id={title.toLowerCase()}
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
      }}
    >
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
              }}
            >
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
              }}
            >
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
              }}
            >
              <LuPlus className="window__dotIcon" />
            </button>
          </div>

          <div className="window__title">{title}</div>
          <div className="window__spacer" />
        </header>

        <div className="window__body">
          <aside className="window__sidebar" aria-label="Secciones">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`window__sideItem ${
                  activeTab === tab.id ? "window__sideItem--active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <section className="window__content">
            <div className="window__grid">
              {items.map((item, i) => {
                const isVideo = item.src.startsWith("videos/");

                return (
                  <button
                    key={item.id}
                    className="window__thumb"
                    type="button"
                    onClick={() => openViewer(i)}
                    aria-label={`Abrir ${item.id}`}
                  >
                    {isVideo ? (
                      <video
                        className="window__thumbMedia"
                        src={`/multimedia/${item.src}`}
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <img
                        className="window__thumbMedia"
                        src={`/multimedia/${item.src}`}
                        alt=""
                        loading="lazy"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {viewer.open &&
          createPortal(
            <div className="viewer" aria-modal="true" role="dialog">
              <div className="viewer__backdrop" onClick={closeViewer} />

              <div className="viewer__content" role="document">
                <div className="viewer__media">
                  {(() => {
                    const current = items[viewer.index];
                    const isVideo = current.src.startsWith("videos/");

                    return isVideo ? (
                      <video
                        src={`/multimedia/${current.src}`}
                        controls
                        autoPlay
                        className="viewer__mediaEl"
                      />
                    ) : (
                      <img
                        src={`/multimedia/${current.src}`}
                        alt=""
                        className="viewer__mediaEl"
                      />
                    );
                  })()}
                </div>

                <button
                  className="viewer__btn viewer__btn--left"
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevItem();
                  }}
                  disabled={viewer.index === 0 || navLock}
                  aria-label="Anterior"
                >
                  <LuChevronLeft />
                </button>

                <button
                  className="viewer__btn viewer__btn--right"
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextItem();
                  }}
                  disabled={viewer.index === items.length - 1 || navLock}
                  aria-label="Siguiente"
                >
                  <LuChevronRight />
                </button>

                <button
                  className="viewer__btn viewer__btn--close"
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeViewer();
                  }}
                  aria-label="Cerrar"
                >
                  <LuX />
                </button>
              </div>
            </div>,
            document.body,
          )}
      </div>

      {/* Resize Handles */}
      {!maximized && (
        <>
          {/* Corners */}
          <div className="window__resizeHandle window__resizeHandle--nw" {...resize.bindResize('top-left')} />
          <div className="window__resizeHandle window__resizeHandle--ne" {...resize.bindResize('top-right')} />
          <div className="window__resizeHandle window__resizeHandle--sw" {...resize.bindResize('bottom-left')} />
          <div className="window__resizeHandle window__resizeHandle--se" {...resize.bindResize('bottom-right')} />

          {/* Edges */}
          <div className="window__resizeHandle window__resizeHandle--n" {...resize.bindResize('top')} />
          <div className="window__resizeHandle window__resizeHandle--s" {...resize.bindResize('bottom')} />
          <div className="window__resizeHandle window__resizeHandle--w" {...resize.bindResize('left')} />
          <div className="window__resizeHandle window__resizeHandle--e" {...resize.bindResize('right')} />
        </>
      )}
    </section>
  );
}