import "../Window/Window.css";
import "./MusicWindow.css";
import { useEffect, useRef, useState } from "react";
import { LuX, LuMinus, LuPlus, LuPlay, LuPause, LuSkipBack, LuSkipForward } from "react-icons/lu";
import { useWindowDrag } from "../../hooks/useWindowDrag";

export default function MusicWindow({
  title = "Música",
  width = 700,
  height = 500,
  x = 150,
  y = 100,
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
  const drag = useWindowDrag({
    initialX: x,
    initialY: y,
    width,
    edgePadding: 120,
    overflow: 30,
    containerRef: stageRef,
  });

  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playError, setPlayError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const volumeRef = useRef(volume);

  const current = tracks[currentIndex] || null;
  const DOCK_WIDTH = 64;
  const MENU_HEIGHT = 34;
  
  const winWidth = maximized ? `calc(100% - ${DOCK_WIDTH}px)` : `${width}px`;
  const winHeight = maximized ? `calc(100% - ${MENU_HEIGHT}px)` : `${height}px`;
  const winTransform = maximized
    ? `translate(${DOCK_WIDTH}px, ${MENU_HEIGHT}px)`
    : `translate(${drag.x}px, ${drag.y}px)`;
  
  const [showFullList, setShowFullList] = useState(false);

  // Load tracks from Audius
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await fetch('https://api.audius.co/v1/tracks/trending?limit=30');
        if (!response.ok) throw new Error('Failed');
        const json = await response.json();
        setTracks(json.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading tracks:', err);
        setPlayError(true);
        setLoading(false);
      }
    };
    loadTracks();
  }, []);

  // Track time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', playNext);
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', playNext);
    };
  }, []);

  // Handle playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;

    audio.volume = volumeRef.current;
    
    // Use Audius API stream endpoint
    const streamUrl = `https://api.audius.co/v1/tracks/${current.id}/stream`;
    
    audio.src = streamUrl;
    audio.currentTime = 0;
    setProgress(0);
    setPlayError(false);

    if (playing) {
      audio.play().catch((err) => {
        console.error('Playback error:', err);
        setPlayError(true);
        setPlaying(false);
        // Auto skip to next track on error
        setTimeout(() => playNext(), 1500);
      });
    } else {
      audio.pause();
    }
  }, [current, playing]);

  const togglePlay = () => {
    if (!current || loading) return;
    setPlaying(!playing);
  };

  const playNext = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((i) => (i + 1) % tracks.length);
    setPlaying(true);
  };

  const playPrev = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
    setPlaying(true);
  };

  const percent = duration ? Math.min(100, (progress / duration) * 100) : 0;
  const artwork = current?.artwork?.['_480x480'] || current?.artwork?.['_1000x1000'] || null;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section
      className={`window music-window ${minimized ? "window--minimized" : ""} ${
        maximized ? "window--maximized" : ""
      } ${isActive ? "window--active" : "window--inactive"}`}
      style={{ width: winWidth, height: winHeight, zIndex, transform: winTransform }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus?.();
      }}
    >
      <div className="window__frame">
        <header className="window__titlebar" {...drag.bindTitlebar}>
          <div className="window__traffic">
            <button className="window__dotBtn window__dotBtn--red" type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onClose?.(); }}>
              <LuX className="window__dotIcon" />
            </button>
            <button className="window__dotBtn window__dotBtn--yellow" type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}>
              <LuMinus className="window__dotIcon" />
            </button>
            <button className="window__dotBtn window__dotBtn--green" type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}>
              <LuPlus className="window__dotIcon" />
            </button>
          </div>
          <div className="window__title">{title}</div>
          <div className="window__spacer" />
        </header>

        <div className="window__body">
          <div className="music__layout">
            {/* Player Section - FULL WIDTH AND HEIGHT */}
            <div className="music__playerMain music__playerMain--full">
              <audio ref={audioRef} crossOrigin="anonymous" />

              {/* Toggle List Button */}
              <button 
                className="music__listToggle"
                onClick={() => setShowFullList(!showFullList)}
                title={showFullList ? "Cerrar lista" : "Ver lista"}
              >
                ☰
              </button>

              {/* Expanded Playlist Overlay */}
              {showFullList && (
                <div className="music__listOverlay">
                  <div className="music__listPanel">
                    <button 
                      className="music__listClose"
                      onClick={() => setShowFullList(false)}
                    >
                      ✕
                    </button>
                    <div className="music__listTitle">Próximas canciones</div>
                    <div className="music__playlistExpanded">
                      {tracks.map((track, idx) => (
                        <button
                          key={track.id || idx}
                          type="button"
                          className={`music__listTrack ${idx === currentIndex ? "music__listTrack--active" : ""}`}
                          onClick={() => { setCurrentIndex(idx); setPlaying(true); setShowFullList(false); }}
                        >
                          <span className="music__listNum">{idx + 1}</span>
                          <div className="music__listInfo">
                            <div className="music__listTrackTitle">{track.title || 'Sin título'}</div>
                            <div className="music__listTrackArtist">{track.user?.name || 'Artista'}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Artwork */}
              <div 
                className="music__artwork"
                style={{
                  backgroundImage: artwork ? `url('${artwork}')` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!artwork && <span className="music__artworkIcon">🎵</span>}
              </div>

              {/* Info Area */}
              <div className="music__info">
                <h2 className="music__title">{current?.title || 'Selecciona una canción'}</h2>
                <p className="music__artist">{current?.user?.name || 'Artista desconocido'}</p>
              </div>

              {/* Controls Area */}
              <div className="music__controls">
                {/* Progress */}
                <div className="music__progress">
                  <span className="music__time">{formatTime(progress)}</span>
                  <div className="music__progressBar">
                    <div 
                      className="music__progressBarFill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="music__time">{formatTime(duration)}</span>
                </div>

                {/* Buttons */}
                <div className="music__buttons">
                  <button 
                    type="button" 
                    className="music__btn music__btn--prev"
                    onClick={playPrev}
                    disabled={loading || tracks.length === 0}
                  >
                    <LuSkipBack />
                  </button>
                  <button 
                    type="button" 
                    className={`music__btn music__btn--play ${playing ? 'music__btn--pause' : ''}`}
                    onClick={togglePlay}
                    disabled={loading || !current}
                  >
                    {playing ? <LuPause /> : <LuPlay />}
                  </button>
                  <button 
                    type="button" 
                    className="music__btn music__btn--next"
                    onClick={playNext}
                    disabled={loading || tracks.length === 0}
                  >
                    <LuSkipForward />
                  </button>
                </div>

                {/* Volume */}
                <div className="music__volume">
                  <span className="music__volumeIcon">🔊</span>
                  <input
                    id="volume-slider"
                    className="music__volumeSlider"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      volumeRef.current = parseFloat(e.target.value);
                      if (audioRef.current) {
                        audioRef.current.volume = parseFloat(e.target.value);
                      }
                    }}
                    disabled={loading || !current}
                  />
                  <span className="music__volumePercent">{Math.round(volume * 100)}%</span>
                </div>
              </div>

              {/* Status Messages */}
              {loading && (
                <div className="music__status music__status--loading">
                  <span className="music__spinner" />
                  Cargando...
                </div>
              )}

              {playError && (
                <div className="music__status music__status--error">
                  ❌ No se pudo reproducir
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
