// Component Hero Section - Phần đầu trang với tên và hiệu ứng sang trọng
import { motion } from 'framer-motion';
import { GraduationCap, Star } from 'lucide-react';
import { EVENT_INFO } from '../data/eventData';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
    >
      {/* Hình nền trường đại học An Giang mờ ảo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/e2/Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_H%E1%BB%8Dc_An_Giang.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.15) saturate(0.5)',
        }}
      />

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(3,10,20,0.3) 0%, rgba(3,10,20,0.7) 50%, rgba(3,10,20,1) 100%)',
        }}
      />

      {/* Vòng tròn ánh sáng vàng phía sau */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Nội dung chính */}
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Icon nón tốt nghiệp */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="glass-card rounded-full p-5 gold-border">
            <GraduationCap className="w-12 h-12 text-blue-400" />
          </div>
        </motion.div>

        {/* Dòng chữ "Trân Trọng Kính Mời" */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gold-400 font-serif italic text-lg md:text-xl mb-4 tracking-widest"
          style={{ letterSpacing: '0.2em' }}
        >
          ✦ Trân Trọng Kính Mời ✦
        </motion.p>

        {/* Tên chủ nhân - hiệu ứng Shimmer sang trọng */}
        {/*
         * Dùng wrapper div + span trong để fix 2 vấn đề cùng lúc:
         * - div có padding-top để dấu tiếng Việt (Ù, Ổ, Ấ, Ư) không bị clip
         * - span có background-clip: text cho hiệu ứng shimmer gradient
         */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          className="hero-title-wrapper mb-6"
        >
          <h1 className="hero-title font-serif font-bold shimmer-text">
            {EVENT_INFO.name}
          </h1>
        </motion.div>

        {/* Đường kẻ vàng trang trí */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="section-divider mb-6"
        >
          <div className="divider-line" />
          <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
          <GraduationCap className="w-5 h-5 text-gold-500" />
          <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
          <div className="divider-line" />
        </motion.div>

        {/* Tiêu đề sự kiện */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="hero-subtitle font-sans text-white/80 mb-8 tracking-wide"
        >
          Lễ Tốt Nghiệp Đại Học
        </motion.h2>

        {/* Thông tin thời gian & địa điểm */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10"
        >
          {/* Thời gian */}
          <div className="glass-card gold-border rounded-2xl px-6 py-4 text-center">
            <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-1">Thời Gian</p>
            <p className="text-gold-400 font-serif text-xl font-bold">
              {EVENT_INFO.startTime} – {EVENT_INFO.endTime}
            </p>
            <p className="text-white/70 text-sm mt-1">{EVENT_INFO.dateDisplay}</p>
          </div>

          {/* Ngôi sao chia cách */}
          <Star className="w-5 h-5 text-gold-500/50 hidden sm:block" />

          {/* Địa điểm */}
          <div className="glass-card gold-border rounded-2xl px-6 py-4 text-center max-w-xs">
            <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-1">Địa Điểm</p>
            <p className="text-white font-semibold text-sm leading-snug">{EVENT_INFO.venue}</p>
          </div>
        </motion.div>

        {/* Nút cuộn xuống */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col items-center gap-2"
        >
          <a
            href="#countdown"
            className="btn-gold inline-flex items-center gap-2 text-sm font-semibold"
            aria-label="Xem đếm ngược thời gian"
          >
            <span>Xem Chi Tiết</span>
            <span className="animate-bounce">↓</span>
          </a>
        </motion.div>

        {/* Decorative corner ornaments */}
        <div className="absolute top-4 left-4 text-gold-500/30 text-4xl font-serif select-none">❝</div>
        <div className="absolute bottom-4 right-4 text-gold-500/30 text-4xl font-serif select-none">❞</div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Cuộn xuống</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold-500/50 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
