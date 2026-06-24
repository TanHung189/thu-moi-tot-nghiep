// Component Hero Section - Phần đầu trang với tên và hiệu ứng sang trọng
import { motion } from "framer-motion";
import { GraduationCap, Star } from "lucide-react";
import { EVENT_INFO } from "../data/eventData";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
    >
      {/* Lớp nền trong suốt để dùng nền giấy từ body */}
      <div className="absolute inset-0 z-0 bg-transparent" />

      {/* Vòng cung/họa tiết trang trí (giả lập bằng border mảnh) */}
      <div className="absolute inset-4 sm:inset-8 border-[1px] border-[#bca374] opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-5 sm:inset-9 border-[1px] border-[#bca374] opacity-20 pointer-events-none z-0" />

      {/* Nội dung chính */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Icon nón tốt nghiệp phong cách line-art */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="p-4 border-[1px] border-[#bca374] rounded-full">
            <GraduationCap className="w-10 h-10 text-[#bca374] stroke-[1.5]" />
          </div>
        </motion.div>

        {/* Dòng chữ "Trân Trọng Kính Mời" */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#666666] font-serif italic text-base md:text-lg mb-6 tracking-widest uppercase"
        >
          Trân trọng kính mời bạn đến tham dự buổi lễ tốt nghiệp của
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#bca374] leading-tight px-4 py-2"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.05)" }}
          >
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
          className="hero-subtitle font-sans text-slate-700 mb-8 tracking-wide"
        >
          Lễ Tốt Nghiệp Đại Học
        </motion.h2>

        {/* Thông tin thời gian & địa điểm */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-12 border-y border-[#d1d5db] py-6"
        >
          {/* Thời gian */}
          <div className="text-center px-4">
            <p className="text-[#666666] text-xs font-medium tracking-widest uppercase mb-2">
              Thời Gian
            </p>
            <p className="text-[#1a1a1a] font-serif text-xl font-bold">
              {EVENT_INFO.startTime} – {EVENT_INFO.endTime}
            </p>
            <p className="text-[#666666] text-sm mt-1">
              {EVENT_INFO.dateDisplay}
            </p>
          </div>

          {/* Ngôi sao chia cách */}
          <div className="w-px h-12 bg-[#d1d5db] hidden sm:block" />

          {/* Địa điểm */}
          <div className="text-center px-4 max-w-[200px]">
            <p className="text-[#666666] text-xs font-medium tracking-widest uppercase mb-2">
              Địa Điểm
            </p>
            <p className="text-[#1a1a1a] font-serif font-bold text-sm leading-snug">
              {EVENT_INFO.venue}
            </p>
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
        <div className="absolute top-4 left-4 text-gold-500/30 text-4xl font-serif select-none">
          ❝
        </div>
        <div className="absolute bottom-4 right-4 text-gold-500/30 text-4xl font-serif select-none">
          ❞
        </div>
      </div>
    </section>
  );
}
