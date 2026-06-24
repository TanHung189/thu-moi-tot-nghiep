// Component Footer - Chân trang trang trọng
import { motion } from 'framer-motion';
import { GraduationCap, Heart, Star } from 'lucide-react';
import { EVENT_INFO } from '../data/eventData';

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 px-4 mt-8">
      {/* Đường kẻ vàng trên cùng */}
      <div className="max-w-4xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mb-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Icon tốt nghiệp */}
          <div className="flex justify-center mb-4">
            <div className="glass-card rounded-full p-4 gold-border">
              <GraduationCap className="w-8 h-8 text-gold-400" />
            </div>
          </div>

          {/* Tên */}
          <h3 className="font-serif text-2xl font-bold gold-text mb-2">
            {EVENT_INFO.name}
          </h3>

          {/* Thông tin sự kiện */}
          <p className="text-slate-500 text-sm mb-1">Lễ Tốt Nghiệp Đại Học</p>
          <p className="text-slate-500 text-sm mb-6">
            {EVENT_INFO.startTime} • {EVENT_INFO.dateDisplay} • {EVENT_INFO.venue}
          </p>

          {/* Trích dẫn */}
          <div className="glass-card rounded-2xl p-6 max-w-lg mx-auto mb-8 gold-border">
            <p className="font-serif italic text-slate-700 text-lg leading-relaxed">
              "Đây không phải là kết thúc của hành trình,
              <br />
              mà là bước đầu của một chương mới."
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
            </div>
          </div>

          {/* Copyright */}
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
            Được tạo với
            <Heart className="w-3 h-3 text-red-400 fill-red-400 inline mx-1" />
            cho ngày đặc biệt của {EVENT_INFO.name}
          </p>
          <p className="text-slate-300 text-xs mt-1">
            © {new Date().getFullYear()} • All Rights Reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
