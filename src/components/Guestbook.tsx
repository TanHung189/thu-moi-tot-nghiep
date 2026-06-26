// Component Guestbook - Sổ lưu bút với Sticky Notes chuyển động
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, UserCircle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { type GuestMessage } from '../data/eventData';

const INITIAL_SHOW = 6; // Số tin nhắn hiển thị mặc định

interface GuestbookProps {
  messages: GuestMessage[];
}

// Component một sticky note
function StickyNote({ msg, index }: { msg: GuestMessage; index: number }) {
  const rotate = ((index % 5) - 2) * 1.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: rotate - 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4), type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
      className={`p-6 border-[1px] border-[#d1d5db] text-[#1a1a1a] shadow-sm relative ${msg.color}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* Ghim trang trí phía trên */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-[#d1d5db]"
        style={{ background: '#e5e7eb' }}
      />

      {/* Tên khách */}
      <div className="flex items-center gap-2 mb-3">
        <UserCircle className="w-5 h-5 text-[#666666] shrink-0" />
        <span className="font-bold text-sm text-[#1a1a1a] truncate">{msg.name}</span>
        {msg.attending ? (
          <CheckCircle className="w-4 h-4 text-[#bca374] shrink-0 ml-auto" title="Sẽ tham dự" strokeWidth={1.5} />
        ) : (
          <XCircle className="w-4 h-4 text-[#666666] shrink-0 ml-auto" title="Không tham dự được" strokeWidth={1.5} />
        )}
      </div>

      {/* Nội dung lời chúc */}
      <p className="text-xl text-[#1a1a1a] leading-relaxed font-handwriting">
        {msg.message}
      </p>

      {/* Badge tham dự/vắng */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-[10px] px-2 py-0.5 border uppercase tracking-widest ${
            msg.attending
              ? 'border-[#bca374] text-[#bca374]'
              : 'border-[#666666] text-[#666666]'
          }`}
        >
          {msg.attending ? 'Sẽ tham dự' : 'Vắng mặt'}
        </span>
      </div>

      {/* Đường kẻ ngang trang trí */}
      <div className="absolute bottom-6 left-4 right-4 h-px bg-[#d1d5db]/30" />
      <div className="absolute bottom-4 left-4 right-4 h-px bg-[#d1d5db]/30" />
    </motion.div>
  );
}

export default function Guestbook({ messages }: GuestbookProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedMessages = showAll ? messages : messages.slice(0, INITIAL_SHOW);
  const hasMore = messages.length > INITIAL_SHOW;
  const hiddenCount = messages.length - INITIAL_SHOW;

  const handleToggle = () => {
    if (showAll) {
      // Khi thu gọn → scroll về đầu section
      setShowAll(false);
      setTimeout(() => {
        document.getElementById('guestbook')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setShowAll(true);
    }
  };

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
          <div className="flex items-center justify-center gap-3 mb-4 opacity-70">
            <BookOpen className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
            <span className="text-[#bca374] text-sm font-medium tracking-widest uppercase">Sổ Lưu Bút</span>
            <BookOpen className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
          </div>
          <h2 className="section-title mb-4">
            <span className="text-[#1a1a1a] text-2xl md:text-3xl font-serif">Lời Chúc Từ Mọi Người</span>
          </h2>
          <p className="text-[#666666]">
            {messages.length} lời chúc đã được gửi đến Hưng 💌
          </p>
        </motion.div>

        {/* Khi chưa có lời chúc */}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border-[1px] border-[#d1d5db]"
          >
            <BookOpen className="w-12 h-12 text-[#d1d5db] mx-auto mb-4" strokeWidth={1} />
            <p className="text-[#666666]">Chưa có lời chúc nào. Hãy là người đầu tiên! 💌</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Grid Sticky Notes với animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 w-full">
              <AnimatePresence initial={false}>
                {displayedMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -20 }}
                    transition={{ duration: 0.4, delay: index < INITIAL_SHOW ? 0 : (index - INITIAL_SHOW) * 0.06 }}
                  >
                    <StickyNote msg={msg} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Nút Xem tất cả / Thu gọn */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-col items-center gap-2"
              >
                <button
                  onClick={handleToggle}
                  className="group flex items-center gap-2.5 px-7 py-3 border border-[#bca374] text-[#bca374] hover:bg-[#bca374] hover:text-white rounded-full font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                      Thu gọn
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                      Xem thêm {hiddenCount} lời chúc
                    </>
                  )}
                </button>
                {!showAll && (
                  <p className="text-xs text-[#999] mt-1">
                    Đang hiển thị {INITIAL_SHOW} / {messages.length} lời chúc
                  </p>
                )}
              </motion.div>
            )}
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
            <BookOpen className="w-4 h-4 text-[#bca374]" />
            Viết Lời Chúc Của Bạn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
