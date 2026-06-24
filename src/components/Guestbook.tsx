// Component Guestbook - Sổ lưu bút với Sticky Notes chuyển động
import { motion } from 'framer-motion';
import { BookOpen, UserCircle, CheckCircle, XCircle } from 'lucide-react';
import { type GuestMessage } from '../data/eventData';

interface GuestbookProps {
  messages: GuestMessage[];
}

// Component một sticky note
function StickyNote({ msg, index }: { msg: GuestMessage; index: number }) {
  // Góc xoay ngẫu nhiên nhẹ (-3 đến 3 độ) dựa trên index
  const rotate = ((index % 5) - 2) * 1.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: rotate - 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
      className={`
        sticky-note relative p-5 rounded-lg shadow-lg
        ${msg.color}
        text-gray-800
      `}
      style={{
        transform: `rotate(${rotate}deg)`,
        boxShadow: '3px 3px 10px rgba(0,0,0,0.3)',
      }}
    >
      {/* Ghim trang trí phía trên */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md"
        style={{ background: 'linear-gradient(135deg, #1d4ed8, #60a5fa)' }}
      />

      {/* Tên khách */}
      <div className="flex items-center gap-2 mb-3">
        <UserCircle className="w-5 h-5 text-gray-600 shrink-0" />
        <span className="font-bold text-sm text-gray-800 truncate">{msg.name}</span>
        {/* Icon trạng thái tham dự */}
        {msg.attending ? (
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 ml-auto" title="Sẽ tham dự" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-auto" title="Không tham dự được" />
        )}
      </div>

      {/* Nội dung lời chúc */}
      <p className="text-sm text-gray-700 leading-relaxed font-medium" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
        {msg.message}
      </p>

      {/* Badge tham dự/vắng */}
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            msg.attending
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {msg.attending ? '✓ Sẽ tham dự' : '✗ Vắng mặt'}
        </span>
      </div>

      {/* Đường kẻ ngang trang trí (như tờ giấy ghi chú) */}
      <div className="absolute bottom-6 left-4 right-4 h-px bg-gray-300/50" />
      <div className="absolute bottom-4 left-4 right-4 h-px bg-gray-300/50" />
    </motion.div>
  );
}

export default function Guestbook({ messages }: GuestbookProps) {
  return (
    <section id="guestbook" className="section-padding relative z-10">
      <div className="max-w-5xl mx-auto">

        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-gold-400" />
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">Sổ Lưu Bút</span>
            <BookOpen className="w-5 h-5 text-gold-400" />
          </div>
          <h2 className="section-title mb-4">
            <span className="gold-text">Lời Chúc</span>{' '}
            <span className="text-white">Từ Mọi Người</span>
          </h2>
          <p className="text-white/60">
            {messages.length} lời chúc đã được gửi đến Hưng 💌
          </p>
        </motion.div>

        {/* Khi chưa có lời chúc */}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card gold-border rounded-3xl"
          >
            <BookOpen className="w-12 h-12 text-gold-400/50 mx-auto mb-4" />
            <p className="text-white/50">Chưa có lời chúc nào. Hãy là người đầu tiên! 💌</p>
          </motion.div>
        ) : (
          /* Grid Sticky Notes */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {messages.map((msg, index) => (
              <StickyNote key={msg.id} msg={msg} index={index} />
            ))}
          </div>
        )}

        {/* Nút scroll lên form RSVP */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="#rsvp"
            id="guestbook-write-btn"
            className="btn-glass inline-flex items-center gap-2 text-sm"
            aria-label="Viết lời chúc mới"
          >
            <BookOpen className="w-4 h-4 text-gold-400" />
            Viết Lời Chúc Của Bạn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
