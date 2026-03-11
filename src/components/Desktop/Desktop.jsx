import "./Desktop.css";

import Dock from "../Dock/Dock.jsx";
import Window from "../Window/Window";
import { useRef, useState } from "react";
import MenuBar from "../MenuBar/MenuBar.jsx";
import SettingsWindow from "../SettingsWindow/SettingsWindow";
import ActivitiesOverlay from "../ActivitiesOverlay/ActivitiesOverlay.jsx";
import ClockPanel from "../ClockPanel/ClockPanel.jsx";

export default function Desktop() {

  const stageRef = useRef(null);

  /* WORKSPACES */

  const [workspace, setWorkspace] = useState(0);

  const WORKSPACES = [0,1,2,3];

  /* ACTIVITIES */

  const [activitiesOpen, setActivitiesOpen] = useState(false);

  const closeActivities = () => {
    setActivitiesOpen(false);
  };

  /* CLOCK PANEL */

  const [clockOpen, setClockOpen] = useState(false);

  const closeClock = () => {
    setClockOpen(false);
  };

  /* Wallpaper */

  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem("wallpaper") || "wallpapers/0001.webp";
  });

  const handleWallpaperChange = (src) => {
    setWallpaper(src);
    localStorage.setItem("wallpaper", src);
  };

  /* Apps */

  const [photos, setPhotos] = useState({
    open:false,
    minimized:false,
    workspace:0
  });

  const [settings, setSettings] = useState({
    open:false,
    minimized:false,
    workspace:0
  });

  /* Focus */

  const [activeAppId, setActiveAppId] = useState(null);

  const [zMap, setZMap] = useState({
    photos:1,
    settings:2
  });

  const zSeedRef = useRef(3);

  const focusApp = (appId) => {

    setActiveAppId(appId);

    setZMap(prev => ({
      ...prev,
      [appId]: zSeedRef.current++
    }));

  };

  /* Close y Minimize */

  const handleClosePhotos = () =>
    setPhotos({ open:false, minimized:false, workspace });

  const handleMinimizePhotos = () =>
    setPhotos(prev =>
      prev.open ? { ...prev, minimized:true } : prev
    );

  const handleCloseSettings = () =>
    setSettings({ open:false, minimized:false, workspace });

  const handleMinimizeSettings = () =>
    setSettings(prev =>
      prev.open ? { ...prev, minimized:true } : prev
    );

  /* DOCK + ACTIVITIES */

  const handleDockClick = (appId) => {

    if(appId==="photos"){

      setPhotos(prev => {

        if(!prev.open)
          return { open:true, minimized:false, workspace };

        if(!prev.minimized)
          return { ...prev, minimized:true };

        return { ...prev, minimized:false };

      });

      focusApp("photos");

    }

    if(appId==="settings"){

      setSettings(prev => {

        if(!prev.open)
          return { open:true, minimized:false, workspace };

        if(!prev.minimized)
          return { ...prev, minimized:true };

        return { ...prev, minimized:false };

      });

      focusApp("settings");

    }

  };

  /* lanzar apps desde Activities */

  const handleLaunchApp = (appId) => {

    handleDockClick(appId);

    closeActivities();

  };

  /* MOVER VENTANAS ENTRE WORKSPACES */

  const moveWindowToWorkspace = (appId, ws) => {

    if(appId === "photos"){
      setPhotos(prev => ({ ...prev, workspace: ws }));
    }

    if(appId === "settings"){
      setSettings(prev => ({ ...prev, workspace: ws }));
    }

  };

  return (

    <main
      className="desktop"
      style={{ backgroundImage:`url(/${wallpaper})` }}
      onMouseDown={()=>setActiveAppId(null)}
    >

      {/* MENU BAR */}

      <MenuBar
        onActivities={()=>setActivitiesOpen(prev=>!prev)}
        onClock={()=>setClockOpen(prev=>!prev)}
      />

      {/* CLOCK PANEL */}

      <ClockPanel
        open={clockOpen}
        onClose={closeClock}
      />

      {/* ACTIVITIES */}

      <ActivitiesOverlay
        open={activitiesOpen}
        onClose={closeActivities}
        onLaunchApp={handleLaunchApp}
        moveWindowToWorkspace={moveWindowToWorkspace}
        windows={{photos,settings}}
        workspace={workspace}
        setWorkspace={setWorkspace}
        workspaces={WORKSPACES}
      />

      {/* WINDOWS */}

      <div
        className="desktop__stage"
        ref={stageRef}
      >

        {photos.open && photos.workspace===workspace && (
          <Window
            title="Fotos"
            x={140}
            y={120}
            width={560}
            height={360}
            stageRef={stageRef}
            minimized={photos.minimized}
            onClose={handleClosePhotos}
            onMinimize={handleMinimizePhotos}
            isActive={activeAppId==="photos"}
            zIndex={zMap.photos}
            onFocus={()=>focusApp("photos")}
          />
        )}

        {settings.open && settings.workspace===workspace && (
          <SettingsWindow
            title="Configuración"
            x={540}
            y={120}
            width={560}
            height={360}
            stageRef={stageRef}
            minimized={settings.minimized}
            onClose={handleCloseSettings}
            onMinimize={handleMinimizeSettings}
            onSelectWallpaper={handleWallpaperChange}
            currentWallpaper={wallpaper}
            isActive={activeAppId==="settings"}
            zIndex={zMap.settings}
            onFocus={()=>focusApp("settings")}
          />
        )}

      </div>

      {/* DOCK */}

      <Dock
        onItemClick={handleDockClick}
        appState={{photos,settings}}
      />

    </main>

  );

}