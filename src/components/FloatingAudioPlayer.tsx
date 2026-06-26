// Component AudioPlayer - Nút nhạc nền nổi, có thể kéo thả
// Chiến lược: Màn hình "bấm để vào" → nhạc bật ngay (100% hoạt động mọi browser)
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Sparkles } from "lucide-react";

const MUSIC_URL = "/music.mp3";
const STORAGE_KEY = "audio_player_pos";

// Họa tiết kim cương
const Diamond = ({ className }: { className?: string }) => (
  <div className={`rotate-45 bg-[#bca374] ${className}`} />
);

// ─── Màn hình chào mở cổng Grand Gate (Sang trọng, quý phái) ────
function WelcomeOverlay({
  onEnter,
  onComplete,
}: {
  onEnter: () => void;
  onComplete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onEnter(); // Kích hoạt nhạc ngay khi có tương tác
    setTimeout(() => onComplete(), 1800); // Đợi animation cửa mở xong hoàn toàn
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none flex">
      {/* ─── CỬA TRÁI ─── */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "-100%" : 0 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="relative w-1/2 h-full bg-[#030914] pointer-events-auto border-r border-[#bca374]/40 shadow-[20px_0_50px_rgba(0,0,0,0.8)] flex flex-col items-end justify-center overflow-hidden"
      >
        {/* Glow nền */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_right_center,#bca374_0%,transparent_60%)]" />

        {/* Khung viền chỉ vàng cổ điển */}
        <div className="absolute top-6 bottom-6 left-6 right-2 border-y border-l border-[#bca374]/20 rounded-l-md" />
        <div className="absolute top-8 bottom-8 left-8 right-4 border-y border-l border-[#bca374]/10 rounded-l-md" />

        {/* Họa tiết ở giữa (nằm trên đường cắt của 2 cửa) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 opacity-60">
          <div className="w-px h-24 md:h-32 bg-gradient-to-b from-transparent to-[#bca374]" />
          <Diamond className="w-2 h-2 md:w-2.5 md:h-2.5" />
          <Diamond className="w-1 h-1 md:w-1.5 md:h-1.5" />
          <div className="h-36 md:h-48" />{" "}
          {/* Khoảng trống cho con dấu (nhỏ hơn trên mobile) */}
          <Diamond className="w-1 h-1 md:w-1.5 md:h-1.5" />
          <Diamond className="w-2 h-2 md:w-2.5 md:h-2.5" />
          <div className="w-px h-24 md:h-32 bg-gradient-to-t from-transparent to-[#bca374]" />
        </div>
      </motion.div>

      {/* ─── CỬA PHẢI ─── */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "100%" : 0 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="relative w-1/2 h-full bg-[#030914] pointer-events-auto border-l border-[#bca374]/40 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col items-start justify-center overflow-hidden"
      >
        {/* Glow nền */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_left_center,#bca374_0%,transparent_60%)]" />

        {/* Khung viền chỉ vàng cổ điển */}
        <div className="absolute top-6 bottom-6 right-6 left-2 border-y border-r border-[#bca374]/20 rounded-r-md" />
        <div className="absolute top-8 bottom-8 right-8 left-4 border-y border-r border-[#bca374]/10 rounded-r-md" />
      </motion.div>

      {/* ─── TRUNG TÂM (Con dấu & Typography) ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10"
          >
            {/* Typography Lời Mời */}
            <motion.div
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-10 md:mb-14 text-center px-4 w-full max-w-[95vw]"
            >
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 opacity-80">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#bca374]" />
                <p className="text-[#bca374] text-[9px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.4em] uppercase font-medium">
                  Trân trọng kính mời
                </p>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#bca374]" />
              </div>
              <h1 className="font-serif text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-2 md:mb-4 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Lễ Tốt Nghiệp
              </h1>
              <p className="font-script text-[#bca374] text-4xl sm:text-5xl md:text-7xl drop-shadow-lg leading-tight px-2">
                Bùi Đỗ Tấn Hưng
              </p>
            </motion.div>

            {/* Wax Seal Button (Con dấu Hoàng Gia) */}
            <div
              className="relative pointer-events-auto cursor-pointer group"
              onClick={handleOpen}
            >
              {/* Vòng sáng tỏa ra */}
              <span
                className="absolute inset-0 rounded-full border-2 border-[#bca374] animate-ping opacity-30"
                style={{ animationDuration: "2.5s" }}
              />
              {/* Vòng quay đứt nét */}
              <span
                className="absolute -inset-3 md:-inset-4 rounded-full border border-[#bca374] border-dashed animate-spin opacity-30 group-hover:opacity-60 transition-opacity"
                style={{ animationDuration: "15s" }}
              />
              {/* Vòng quay ngược chiều */}
              <span
                className="absolute -inset-6 md:-inset-8 rounded-full border border-[#bca374]/30 animate-spin opacity-20"
                style={{
                  animationDuration: "20s",
                  animationDirection: "reverse",
                }}
              />

              {/* Con dấu chính (Logo AGU Khóa 23) */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#d4af37] via-[#aa8222] to-[#7a5a12] shadow-[0_0_50px_rgba(188,163,116,0.6)] border-[4px] border-[#030914] flex flex-col items-center justify-center text-[#030914] transition-all duration-500 group-hover:scale-110 group-hover:brightness-110">
                <div className="flex flex-col items-center justify-center mt-1">
                  <span className="font-serif text-3xl md:text-4xl font-bold tracking-widest leading-none drop-shadow-sm">
                    AGU
                  </span>
                  <div className="flex items-center gap-1.5 my-1.5 opacity-90">
                    <span className="w-3 h-px bg-[#030914]"></span>
                    <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase">
                      Khóa 23
                    </span>
                    <span className="w-3 h-px bg-[#030914]"></span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 bg-[#030914]/10 px-2 py-0.5 rounded-full">
                    <Music className="w-3 h-3" strokeWidth={2.5} />
                    <span className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase">
                      Mở Thiệp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint text */}
            <motion.div
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-14 flex items-center gap-4"
            >
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#bca374]/50"></span>
              <p className="text-[#bca374]/80 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">
                Bấm vào để mở thư mời
              </p>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#bca374]/50"></span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Component chính ────────────────────────────────────────────────────────
export default function FloatingAudioPlayer() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isDraggingRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleEnter = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.4;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Không thể phát nhạc:", err);
      setHasError(true);
    }
  };

  const handleComplete = () => {
    setShowOverlay(false);
  };

  // Dọn dẹp khi unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
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
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      setHasError(true);
    }
  };

  return (
    <>
      {showOverlay && (
        <WelcomeOverlay onEnter={handleEnter} onComplete={handleComplete} />
      )}

      {/* Nút nhạc nổi */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.05}
        style={{ x, y, bottom: "1rem", left: "1rem" }}
        className="floating-btn touch-none"
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ x: x.get(), y: y.get() }),
            );
          } catch {}
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 100);
        }}
        whileDrag={{ scale: 1.12, cursor: "grabbing" }}
      >
        <audio
          ref={audioRef}
          src={MUSIC_URL}
          preload="auto"
          aria-hidden="true"
          onError={() => setHasError(true)}
        />

        <motion.button
          onClick={togglePlay}
          id="audio-player-toggle-btn"
          className="w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm border-2 border-[#bca374] shadow-lg text-[#bca374] hover:bg-[#bca374] hover:text-white transition-colors rounded-full select-none cursor-grab relative z-10"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5" strokeWidth={2} />
          ) : (
            <VolumeX className="w-5 h-5" strokeWidth={2} />
          )}
        </motion.button>

        {hasError && (
          <span className="absolute -top-7 left-0 text-red-500/90 text-[10px] whitespace-nowrap bg-white px-2 py-1 border border-red-200 shadow rounded-full">
            Lỗi nhạc
          </span>
        )}
      </motion.div>
    </>
  );
}
