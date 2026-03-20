import "./ActivitiesOverlay.css";
import { useEffect, useState, useRef } from "react";

import photosIcon from "../../assets/icons/dock/photos.webp";
import musicIcon from "../../assets/icons/dock/music.webp";
import settingsIcon from "../../assets/icons/dock/settings.webp";
import terminalIcon from "../../assets/icons/dock/terminal.webp";
import filesIcon from "../../assets/icons/dock/finder.webp";

const APPS = [
  { id: "photos", name: "Fotos", icon: photosIcon },
  { id: "music", name: "Música", icon: musicIcon },
  { id: "settings", name: "Configuración", icon: settingsIcon },
  { id: "terminal", name: "Terminal", icon: terminalIcon },
  { id: "files", name: "Archivos", icon: filesIcon },
];

export default function ActivitiesOverlay({
  open,
  onClose,
  onLaunchApp,
  moveWindowToWorkspace,
  windows,
  workspace,
  setWorkspace,
  workspaces
}) {

  const [query,setQuery] = useState("");

  const previewRefs = useRef({});

  useEffect(()=>{

    const handleKey = (e)=>{
      if(e.key==="Escape") onClose();
    };

    window.addEventListener("keydown",handleKey);

    return ()=>window.removeEventListener("keydown",handleKey);

  },[onClose]);

  /* crear miniatura real */

  useEffect(()=>{

    Object.keys(previewRefs.current).forEach((id)=>{

      const container = previewRefs.current[id];

      if(!container) return;

      const win = document.querySelector(`[data-window-id="${id}"]`);

      if(!win) return;

      container.innerHTML="";

      const clone = win.cloneNode(true);

      clone.style.transform="scale(0.25)";
      clone.style.transformOrigin="top left";
      clone.style.pointerEvents="none";

      container.appendChild(clone);

    });

  });

  if(!open) return null;

  const filteredApps = APPS.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  const openWindows = Object.entries(windows)
    .filter(([_,state])=>state.open && state.workspace===workspace);

  return (

    <div
      className="activitiesOverlay"
      onClick={onClose}
    >

      {/* WORKSPACES PREVIEW */}

      <div className="workspaceSidebar">

        {workspaces.map((ws)=>{

          const wsWindows = Object.entries(windows)
            .filter(([_,state])=>state.open && state.workspace===ws);

          return(

            <div
              key={ws}
              className={`workspacePreview ${workspace===ws?"active":""}`}
              onClick={()=>setWorkspace(ws)}
              onDragOver={(e)=>e.preventDefault()}
              onDrop={(e)=>{

                const windowId = e.dataTransfer.getData("windowId");

                if(windowId){
                  moveWindowToWorkspace(windowId, ws);
                }

              }}
            >

              <div className="workspacePreview__screen">

                {wsWindows.map(([id])=>(
                  <div
                    key={id}
                    className="workspacePreview__window"
                    draggable
                    onDragStart={(e)=>{
                      e.dataTransfer.setData("windowId", id);
                    }}
                  >
                    {id}
                  </div>
                ))}

              </div>

            </div>

          );

        })}

      </div>

      <div
        className="activitiesOverlay__panel"
        onClick={(e)=>e.stopPropagation()}
      >

        {/* BUSCADOR */}

        <div className="activitiesOverlay__search">

          <input
            placeholder="Buscar aplicaciones..."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            autoFocus
          />

        </div>

        {/* VENTANAS ABIERTAS */}

        {openWindows.length>0 && (

          <div className="activitiesOverlay__windows">

            {openWindows.map(([id])=>(
              
              <div
                key={id}
                className="activitiesWindowPreview"
                draggable
                onDragStart={(e)=>{
                  e.dataTransfer.setData("windowId", id);
                }}
                onClick={()=>{
                  onLaunchApp(id);
                  onClose();
                }}
              >

                <div className="windowPreviewBar">
                  {id}
                </div>

                <div className="windowPreviewContent">

                  <div
                    className="windowPreviewLive"
                    ref={(el)=>previewRefs.current[id]=el}
                  />

                </div>

              </div>

            ))}

          </div>

        )}

        {/* GRID DE APPS */}

        <div className="activitiesOverlay__grid">

          {filteredApps.map((app)=>(
            
            <button
              key={app.id}
              className="activitiesApp"
              onClick={()=>{
                onLaunchApp(app.id);
                onClose();
              }}
            >

              <img
                src={app.icon}
                alt={app.name}
                draggable="false"
              />

              <span>{app.name}</span>

            </button>

          ))}

        </div>

      </div>

    </div>

  );

}