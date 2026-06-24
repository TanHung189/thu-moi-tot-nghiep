// Component AudioPlayer - Đĩa nhạc vinyl xoay ở góc màn hình
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music, Volume2, VolumeX } from "lucide-react";

export default function FloatingAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ⚠️ THAY ĐỔI: Thay URL bên dưới bằng link nhạc của bạn
  // Gợi ý nguồn nhạc miễn phí:
  // - Pixabay: https://pixabay.com/music/ (search "acoustic graduation")
  // - Free Music Archive: https://freemusicarchive.org/
  // - Hoặc upload file MP3 lên GitHub repository cùng project này
  // Ví dụ nếu để file trong /public/music.mp3: '/music.mp3'
  const MUSIC_URL =
    "https://pixabay.com/music/modern-classical-inspiring-cinematic-piano-162193/";
  // 👆 Thay URL này bằng nhạc Acoustic bạn muốn phát

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.4;

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("error", handleError);

    let isMounted = true;

    const handleInteraction = async () => {
      if (!isMounted) return;
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        // Bỏ qua lỗi
      } finally {
        removeListeners();
      }
    };

    const removeListeners = () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };

    // Tự động phát nhạc khi mở trang web (Autoplay)
    const tryAutoplay = async () => {
      try {
        await audio.play();
        if (isMounted) setIsPlaying(true);
      } catch (err) {
        // Trình duyệt chặn Autoplay (chính sách bảo mật của Chrome/Safari/...)
        // Giải pháp: Chờ người dùng tương tác lần đầu tiên
        document.addEventListener("click", handleInteraction, { once: true });
        document.addEventListener("touchstart", handleInteraction, {
          once: true,
        });
        document.addEventListener("scroll", handleInteraction, { once: true });
      }
    };

    tryAutoplay();

    return () => {
      isMounted = false;
      audio.removeEventListener("error", handleError);
      audio.pause(); // Dừng nhạc nếu component bị unmount (fix lỗi StrictMode)
      removeListeners(); // Xóa sự kiện
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      setHasError(true);
    }
  };

  return (
    <div
      className="floating-btn"
      style={{ bottom: "1rem", left: "1rem" }}
      aria-label="Trình phát nhạc nổi"
    >
      <audio ref={audioRef} src={MUSIC_URL} preload="none" aria-hidden="true" />

      <motion.button
        onClick={togglePlay}
        id="audio-player-toggle-btn"
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-[#bca374] shadow-sm text-[#bca374] hover:bg-[#bca374] hover:text-white opacity-80 hover:opacity-100 transition-all rounded-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <VolumeX className="w-5 h-5" strokeWidth={1.5} />
        )}
      </motion.button>

      {hasError && (
        <span className="absolute -top-6 right-0 text-red-500/80 text-[10px] whitespace-nowrap bg-white px-2 py-1 border border-red-200 shadow-sm">
          Lỗi link nhạc
        </span>
      )}
    </div>
  );
}
