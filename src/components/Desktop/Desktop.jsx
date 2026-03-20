import "./Desktop.css";

import Dock from "../Dock/Dock.jsx";
import Window from "../Window/Window";
import PhotosWindow from "../PhotosWindow/PhotosWindow.jsx";
import { useRef, useState } from "react";
import MenuBar from "../MenuBar/MenuBar.jsx";
import SettingsWindow from "../SettingsWindow/SettingsWindow";
import MusicWindow from "../MusicWindow/MusicWindow";
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
    open: false,
    minimized: false,
    maximized: false,
    workspace: 0,
  });

  const [music, setMusic] = useState({
    open: false,
    minimized: false,
    maximized: false,
    workspace: 0,
  });

  const [settings, setSettings] = useState({
    open: false,
    minimized: false,
    maximized: false,
    workspace: 0,
  });

  /* Focus */

  const [activeAppId, setActiveAppId] = useState(null);

  const [zMap, setZMap] = useState({
    photos: 1,
    music: 2,
    settings: 3,
  });

  const zSeedRef = useRef(4);

  const focusApp = (appId) => {

    setActiveAppId(appId);

    setZMap(prev => ({
      ...prev,
      [appId]: zSeedRef.current++
    }));

  };

  /* Close y Minimize */

  const handleClosePhotos = () =>
    setPhotos({ open:false, minimized:false, maximized:false, workspace });

  const handleMinimizePhotos = () =>
    setPhotos(prev =>
      prev.open ? { ...prev, minimized:true, maximized:false } : prev
    );

  const handleMaximizePhotos = () =>
    setPhotos(prev =>
      prev.open
        ? { ...prev, maximized: !prev.maximized, minimized: false }
        : prev
    );

  const handleCloseMusic = () =>
    setMusic({ open:false, minimized:false, maximized:false, workspace });

  const handleMinimizeMusic = () =>
    setMusic(prev =>
      prev.open ? { ...prev, minimized:true, maximized:false } : prev
    );

  const handleMaximizeMusic = () =>
    setMusic(prev =>
      prev.open
        ? { ...prev, maximized: !prev.maximized, minimized: false }
        : prev
    );

  const handleCloseSettings = () =>
    setSettings({ open:false, minimized:false, maximized:false, workspace });

  const handleMinimizeSettings = () =>
    setSettings(prev =>
      prev.open ? { ...prev, minimized:true, maximized:false } : prev
    );

  const handleMaximizeSettings = () =>
    setSettings(prev =>
      prev.open
        ? { ...prev, maximized: !prev.maximized, minimized: false }
        : prev
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

    if(appId==="music"){

      setMusic(prev => {

        if(!prev.open)
          return { open:true, minimized:false, workspace };

        if(!prev.minimized)
          return { ...prev, minimized:true };

        return { ...prev, minimized:false };

      });

      focusApp("music");

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

    if (appId === "photos") {
      setPhotos(prev => ({ ...prev, workspace: ws }));
    }

    if (appId === "music") {
      setMusic(prev => ({ ...prev, workspace: ws }));
    }

    if (appId === "settings") {
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
        windows={{photos,music,settings}}
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
          <PhotosWindow
            title="Fotos"
            x={140}
            y={120}
            width={560}
            height={360}
            stageRef={stageRef}
            minimized={photos.minimized}
            maximized={photos.maximized}
            onClose={handleClosePhotos}
            onMinimize={handleMinimizePhotos}
            onMaximize={handleMaximizePhotos}
            isActive={activeAppId==="photos"}
            zIndex={zMap.photos}
            onFocus={()=>focusApp("photos")}
          />
        )}

        {music.open && music.workspace===workspace && (
          <MusicWindow
            title="Música"
            x={200}
            y={160}
            width={520}
            height={360}
            stageRef={stageRef}
            minimized={music.minimized}
            maximized={music.maximized}
            onClose={handleCloseMusic}
            onMinimize={handleMinimizeMusic}
            onMaximize={handleMaximizeMusic}
            isActive={activeAppId==="music"}
            zIndex={zMap.music}
            onFocus={()=>focusApp("music")}
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
            maximized={settings.maximized}
            onClose={handleCloseSettings}
            onMinimize={handleMinimizeSettings}
            onMaximize={handleMaximizeSettings}
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
        appState={{photos,music,settings}}
      />

    </main>

  );

}