// Component AudioPlayer - Đĩa nhạc vinyl xoay ở góc màn hình
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';

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
  const MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
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

    audio.addEventListener('error', handleError);
    return () => audio.removeEventListener('error', handleError);
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

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className="floating-btn"
      style={{ bottom: '6rem', right: '1.5rem' }}
      aria-label="Trình phát nhạc nổi"
    >
      {/* Audio element ẩn */}
      <audio ref={audioRef} src={MUSIC_URL} preload="none" aria-hidden="true" />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-3 glass-card gold-border rounded-2xl p-4 min-w-[200px]"
            style={{ boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}
          >
            {/* Tên bài nhạc */}
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-4 h-4 text-gold-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">
                  🎵 Nhạc Acoustic
                </p>
                {/* ⚠️ THAY ĐỔI: Tên bài hát */}
                <p className="text-white/40 text-xs truncate">Graduation Song</p>
              </div>
            </div>

            {/* Thanh tiến trình giả */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  background: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
                  width: isPlaying ? '60%' : '0%',
                  animation: isPlaying ? 'none' : undefined,
                  boxShadow: isPlaying ? '0 0 6px rgba(59,130,246,0.6)' : 'none',
                }}
              />
            </div>

            {/* Các nút điều khiển */}
            <div className="flex items-center justify-between">
              <button
                onClick={toggleMute}
                id="audio-mute-btn"
                className="text-white/60 hover:text-gold-400 transition-colors p-1"
                aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={togglePlay}
                id="audio-play-pause-btn"
                disabled={hasError}
                className={`
                  rounded-full p-2 transition-all duration-300
                  ${hasError ? 'opacity-50 cursor-not-allowed bg-white/10' : 'bg-gold-gradient hover:shadow-gold-glow'}
                `}
                aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-navy-950" />
                ) : (
                  <Play className="w-4 h-4 text-navy-950 ml-0.5" />
                )}
              </button>

              {hasError && (
                <span className="text-red-400/70 text-xs">Lỗi link</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút đĩa vinyl chính */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        id="audio-player-toggle-btn"
        className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg"
        style={{
          boxShadow: isPlaying
            ? '0 0 25px rgba(59,130,246,0.6), 0 4px 20px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.5)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isExpanded ? 'Đóng trình phát nhạc' : 'Mở trình phát nhạc'}
        aria-expanded={isExpanded}
      >
        {/* Đĩa vinyl xoay */}
        <div
          className="vinyl-disk w-full h-full flex items-center justify-center"
          style={{
            animation: isPlaying ? 'spin 4s linear infinite' : 'none',
          }}
        >
          {/* Tâm đĩa */}
          <div
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #60a5fa)',
              borderColor: 'rgba(59,130,246,0.6)',
            }}
          >
            <Music className="w-3 h-3 text-navy-950" />
          </div>
        </div>

        {/* Vòng sáng khi đang phát */}
        {isPlaying && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(59,130,246,0.2)' }}
          />
        )}
      </motion.button>
    </div>
  );
}
