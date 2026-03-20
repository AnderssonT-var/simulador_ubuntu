import "./PhotosWindow.css";
import { useState, useEffect, useMemo } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuFolder,
} from "react-icons/lu";
import { useWindowDrag } from "../../hooks/useWindowDrag";
import { useWindowResize } from "../../hooks/useWindowResize";

export default function PhotosWindow({
  title = "Fotos",
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
  isActive = false,
  zIndex = 1,
  onFocus,
}) {
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
  const [media, setMedia] = useState({ photos: [], videos: [] });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [navLock, setNavLock] = useState(false);
  const [viewer, setViewer] = useState({ open: false, index: 0 });

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

  // Agrupar fotos por año
  const folders = useMemo(() => {
    const grouped = {};
    media.photos.forEach((photo) => {
      const year = "2025"; // Por defecto 2025
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(photo);
    });
    return Object.entries(grouped).map(([year, photos]) => ({
      year,
      photos,
      count: photos.length,
    }));
  }, [media.photos]);

  const drag = useWindowDrag({
    initialX: x,
    initialY: y,
    width: currentWidth,
    edgePadding: 120,
    overflow: 30,
    containerRef: stageRef,
  });

  const resize = useWindowResize({
    initialWidth: width,
    initialHeight: height,
    onResize: (w, h) => {
      setCurrentWidth(w);
      setCurrentHeight(h);
    },
  });

  const handleMinimize = () => {
    onMinimize?.();
  };

  const handleMaximize = () => {
    if (maximized) {
      setCurrentWidth(width);
      setCurrentHeight(height);
    } else {
      setCurrentWidth(window.innerWidth - 40);
      setCurrentHeight(window.innerHeight - 120);
    }
    onMaximize?.();
  };

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

  const windowStyle = {
    position: "absolute",
    left: `${drag.x}px`,
    top: `${drag.y}px`,
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    zIndex,
    display: minimized ? "none" : "flex",
  };

  const content = (
    <div 
      className={`photos-window ${minimized ? "photos-window--minimized" : ""} ${
        maximized ? "photos-window--maximized" : ""
      } ${isActive ? "photos-window--active" : "photos-window--inactive"}`}
      style={{
        width: winWidth,
        height: winHeight,
        zIndex,
        transform: winTransform,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus?.();
      }}
    >
      {/* Window Header */}
      <div
        className="window-header"
        onMouseDown={(e) => {
          drag.handleMouseDown(e);
          onFocus?.();
        }}
      >
        <div className="window-controls-left">
          <button
            className="window-btn window-close"
            onClick={onClose}
            title="Cerrar"
          />
          <button
            className="window-btn window-minimize"
            onClick={handleMinimize}
            title="Minimizar"
          />
          <button
            className="window-btn window-maximize"
            onClick={handleMaximize}
            title={maximized ? "Restaurar" : "Maximizar"}
          />
        </div>
        <h1 className="window-title">{title}</h1>
        <div className="window-controls-right"></div>
      </div>

      {/* Window Content */}
      <div className="photos-content">
        {selectedFolder === null ? (
          // Vista de carpetas
          <div className="folders-view">
            <div className="folders-grid">
              {folders.map((folder) => (
                <div
                  key={folder.year}
                  className="folder-item"
                  onClick={() => setSelectedFolder(folder.year)}
                >
                  <div className="folder-icon">
                    <LuFolder size={48} />
                  </div>
                  <div className="folder-info">
                    <h3 className="folder-name">{folder.year}</h3>
                    <p className="folder-count">{folder.count} fotos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Vista de fotos dentro de carpeta
          <div className="photos-view">
            <button
              className="back-button"
              onClick={() => setSelectedFolder(null)}
            >
              ← Volver
            </button>
            <div className="photos-grid">
              {folders
                .find((f) => f.year === selectedFolder)
                ?.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="photo-item"
                    onClick={() =>
                      setViewer({ open: true, index, folder: selectedFolder })
                    }
                  >
                    <img src={photo} alt={`Foto ${index}`} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return content;
}
