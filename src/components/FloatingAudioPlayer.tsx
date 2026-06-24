// Component AudioPlayer - Nút nhạc nền nổi, có thể kéo thả
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const MUSIC_URL = "/music.mp3";

export default function FloatingAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userToggledRef = useRef(false);
  const isDraggingRef = useRef(false);

  // Vị trí kéo thả - reset về 0,0 khi reload trang
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // --- Audio Logic ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.4;
    let isMounted = true;

    const handleError = () => { setHasError(true); setIsPlaying(false); };
    audio.addEventListener("error", handleError);

    const removeListeners = () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };

    const handleInteraction = async () => {
      if (!isMounted || userToggledRef.current) { removeListeners(); return; }
      try { await audio.play(); setIsPlaying(true); }
      catch { /* ignore */ }
      finally { removeListeners(); }
    };

    const tryAutoplay = async () => {
      try { await audio.play(); if (isMounted) setIsPlaying(true); }
      catch {
        document.addEventListener("click", handleInteraction, { once: true });
        document.addEventListener("touchstart", handleInteraction, { once: true });
        document.addEventListener("scroll", handleInteraction, { once: true });
      }
    };

    tryAutoplay();
    return () => {
      isMounted = false;
      audio.removeEventListener("error", handleError);
      audio.pause();
      removeListeners();
    };
  }, []);

  const togglePlay = async () => {
    // Không bật/tắt nhạc nếu vừa kéo xong
    if (isDraggingRef.current) return;
    userToggledRef.current = true;
    const audio = audioRef.current;
    if (!audio || hasError) return;
    try {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { await audio.play(); setIsPlaying(true); }
    } catch { setHasError(true); }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      style={{ x, y, bottom: "1rem", left: "1rem" }}
      className="floating-btn touch-none"
      onDragStart={() => { isDraggingRef.current = true; }}
      onDragEnd={() => {
        // Lưu vị trí mới sau khi thả
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: x.get(), y: y.get() }));
        } catch {}
        // Delay nhỏ để tránh click ngay sau drag
        setTimeout(() => { isDraggingRef.current = false; }, 100);
      }}
      whileDrag={{ scale: 1.12, cursor: "grabbing" }}
    >
      <audio ref={audioRef} src={MUSIC_URL} preload="auto" aria-hidden="true" />

      <motion.button
        onClick={togglePlay}
        id="audio-player-toggle-btn"
        className="w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm border-2 border-[#bca374] shadow-lg text-[#bca374] hover:bg-[#bca374] hover:text-white transition-colors rounded-full select-none cursor-grab"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
      >
        {isPlaying
          ? <Volume2 className="w-5 h-5" strokeWidth={2} />
          : <VolumeX className="w-5 h-5" strokeWidth={2} />
        }
      </motion.button>

      {hasError && (
        <span className="absolute -top-7 left-0 text-red-500/90 text-[10px] whitespace-nowrap bg-white px-2 py-1 border border-red-200 shadow rounded-full">
          Lỗi nhạc
        </span>
      )}
    </motion.div>
  );
}
