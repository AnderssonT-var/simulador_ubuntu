import "./Dock.css";

import finder from "../../assets/icons/dock/finder.webp";
import music from "../../assets/icons/dock/music.webp";
import photos from "../../assets/icons/dock/photos.webp";
import calculator from "../../assets/icons/dock/calculator.webp";
import notes from "../../assets/icons/dock/notes.webp";
import terminal from "../../assets/icons/dock/terminal.webp";
import settings from "../../assets/icons/dock/settings.webp";
import trash from "../../assets/icons/dock/trash.webp";

const DOCK_ITEMS = [
  { id: "finder", label: "Archivos", src: finder },
  { id: "music", label: "Música", src: music },
  { id: "photos", label: "Fotos", src: photos },
  { id: "calculator", label: "Calculadora", src: calculator },
  { id: "notes", label: "Notas", src: notes },
  { id: "terminal", label: "Terminal", src: terminal },
  { id: "settings", label: "Configuración", src: settings },
  { id: "trash", label: "Papelera", src: trash },
];

export default function Dock({ onItemClick, appState = {} }) {

  const mainApps = DOCK_ITEMS.slice(0, -1);
  const trashApp = DOCK_ITEMS[DOCK_ITEMS.length - 1];

  const renderItem = (item) => {
    const state = appState[item.id];
    const isOpen = Boolean(state?.open);
    const isMinimized = Boolean(state?.open && state?.minimized);

    const itemClass = [
      "dockItem",
      isOpen && "dockItem--open",
      isMinimized && "dockItem--minimized",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div key={item.id} className={itemClass}>
        <button
          className="icon"
          type="button"
          aria-label={item.label}
          onClick={() => onItemClick?.(item.id)}
        >
          <img src={item.src} alt={item.label} draggable="false" />
          <span className="dock-tooltip">{item.label}</span>
        </button>

        {isOpen && <span className="dock-indicator" />}
      </div>
    );
  };

  return (
    <aside className="dock" aria-label="Ubuntu Dock">

      {/* Apps principales */}
      <div className="dock-main">
        {mainApps.map(renderItem)}
      </div>

      {/* Papelera abajo */}
      <div className="dock-bottom">
        {renderItem(trashApp)}
      </div>

    </aside>
  );
}