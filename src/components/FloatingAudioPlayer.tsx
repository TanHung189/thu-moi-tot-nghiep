// Component AudioPlayer - Nút nhạc nền nổi, có thể kéo thả
// Nhạc tự bật khi người dùng tương tác đầu tiên (scroll, click, touch, phím...)
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const MUSIC_URL = "/music.mp3";
const STORAGE_KEY = "audio_player_pos";

// Các sự kiện tính là "tương tác đầu tiên"
const INTERACTION_EVENTS = ["scroll", "click", "touchstart", "keydown", "mousemove", "pointerdown"] as const;

export default function FloatingAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isDraggingRef = useRef(false);
  const userPausedRef = useRef(false);
  const startedRef = useRef(false); // Đảm bảo chỉ bật nhạc 1 lần

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.4;
    let isMounted = true;

    audio.addEventListener("error", () => {
      if (isMounted) { setHasError(true); setIsPlaying(false); }
    });

    // Hàm xóa tất cả listener sau khi đã dùng
    const removeAll = () => {
      INTERACTION_EVENTS.forEach(evt =>
        document.removeEventListener(evt, onFirstInteraction)
      );
    };

    // Khi người dùng tương tác lần đầu → bật nhạc
    const onFirstInteraction = async () => {
      if (startedRef.current || userPausedRef.current) return;
      startedRef.current = true;
      removeAll();
      try {
        audio.muted = false;
        await audio.play();
        if (isMounted) setIsPlaying(true);
      } catch (err) {
        console.warn("Không thể phát nhạc:", err);
      }
    };

    // Thử autoplay ngay (sẽ thành công nếu browser cho phép)
    const tryAutoplay = async () => {
      try {
        audio.muted = false;
        await audio.play();
        startedRef.current = true;
        if (isMounted) setIsPlaying(true);
      } catch {
        // Browser block → đăng ký chờ tương tác đầu tiên
        INTERACTION_EVENTS.forEach(evt =>
          document.addEventListener(evt, onFirstInteraction, { once: false, passive: true })
        );
      }
    };

    tryAutoplay();

    return () => {
      isMounted = false;
      removeAll();
      audio.pause();
    };
  }, []);

  const togglePlay = async () => {
    if (isDraggingRef.current) return;
    const audio = audioRef.current;
    if (!audio || hasError) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        userPausedRef.current = true; // User chủ động dừng
      } else {
        audio.muted = false;
        await audio.play();
        setIsPlaying(true);
        userPausedRef.current = false;
        startedRef.current = true;
      }
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
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: x.get(), y: y.get() }));
        } catch {}
        setTimeout(() => { isDraggingRef.current = false; }, 100);
      }}
      whileDrag={{ scale: 1.12, cursor: "grabbing" }}
    >
      <audio ref={audioRef} src={MUSIC_URL} preload="auto" aria-hidden="true" />

      <motion.button
        onClick={togglePlay}
        id="audio-player-toggle-btn"
        className="w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm border-2 border-[#bca374] shadow-lg text-[#bca374] hover:bg-[#bca374] hover:text-white transition-colors rounded-full select-none cursor-grab relative z-10"
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
