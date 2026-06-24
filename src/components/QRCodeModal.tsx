// Component QR Code Modal - Hiển thị mã QR để chia sẻ link trang web
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { QrCode, X, Copy, Check, Share2 } from 'lucide-react';
// qrcode.react v3+ sử dụng named exports
import { QRCodeSVG } from 'qrcode.react';
import { EVENT_INFO } from '../data/eventData';

export default function QRCodeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isDraggingRef = useRef(false);

  // Vị trí kéo thả - reset về 0,0 khi reload trang
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Sao chép link vào clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(EVENT_INFO.shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback cho trình duyệt không hỗ trợ clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = EVENT_INFO.shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Chia sẻ qua Web Share API (hỗ trợ trên mobile)
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thư mời tốt nghiệp - ${EVENT_INFO.name}`,
          text: `Trân trọng kính mời bạn đến tham dự Lễ Tốt Nghiệp của ${EVENT_INFO.name} vào ${EVENT_INFO.startTime} ${EVENT_INFO.dateDisplay} tại ${EVENT_INFO.venue}`,
          url: EVENT_INFO.shareUrl,
        });
      } catch {
        // Người dùng hủy chia sẻ, không làm gì
      }
    } else {
      // Nếu không hỗ trợ Web Share API thì copy link
      copyToClipboard();
    }
  };

  return (
    <>
      {/* Nút nổi QR Code - Có thể kéo để di chuyển */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.05}
        style={{ x, y, bottom: '1rem', right: '1rem' }}
        className="floating-btn touch-none opacity-80 hover:opacity-100 transition-opacity"
        onDragStart={() => { isDraggingRef.current = true; }}
        onDragEnd={() => {
          setTimeout(() => { isDraggingRef.current = false; }, 100);
        }}
        whileDrag={{ scale: 1.12, cursor: "grabbing" }}
      >
        <motion.button
          onClick={() => { if (!isDraggingRef.current) setIsOpen(true); }}
          id="qr-code-open-btn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="select-none cursor-grab"
          aria-label="Mở mã QR để chia sẻ thư mời"
          aria-haspopup="dialog"
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              boxShadow: '0 0 20px rgba(59,130,246,0.4), 0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <QrCode className="w-6 h-6 text-white" />
          </div>
        </motion.button>
      </motion.div>

      {/* Modal QR Code */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="qr-modal-title"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-4 z-[91] w-[320px] glass-card gold-border rounded-3xl p-6"
              style={{ boxShadow: '0 0 40px rgba(59,130,246,0.25), 0 20px 60px rgba(0,0,0,0.5)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 id="qr-modal-title" className="font-serif font-bold text-lg gold-text">
                  Chia Sẻ Thư Mời
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  id="qr-modal-close-btn"
                  className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-lg hover:bg-slate-100"
                  aria-label="Đóng modal QR Code"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-5">
                <div
                  className="rounded-2xl p-4 bg-white"
                  style={{ boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                >
                  <QRCodeSVG
                    value={EVENT_INFO.shareUrl}
                    size={180}
                    level="H"
                    // Màu QR Code: navy trên nền trắng
                    fgColor="#071327"
                    bgColor="#ffffff"
                    includeMargin={false}
                    imageSettings={{
                      // Logo ở giữa QR code
                      src: '/cap.svg',
                      height: 30,
                      width: 30,
                      excavate: true,
                    }}
                  />
                </div>
              </div>

              {/* Mô tả */}
              <p className="text-slate-500 text-sm text-center mb-4">
                Quét mã QR này để mở thư mời 🎓
              </p>

              {/* URL rút gọn */}
              <div className="glass-card-light rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                <span className="text-slate-500 text-xs truncate flex-1 font-mono">
                  {EVENT_INFO.shareUrl}
                </span>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-2">
                {/* Sao chép link */}
                <button
                  onClick={copyToClipboard}
                  id="qr-copy-link-btn"
                  className={`btn-glass flex-1 flex items-center justify-center gap-2 text-sm py-2 ${isCopied ? 'border-green-400/50 text-green-400' : ''}`}
                  aria-label="Sao chép link thư mời"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                {/* Chia sẻ */}
                <button
                  onClick={shareLink}
                  id="qr-share-btn"
                  className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm py-2"
                  aria-label="Chia sẻ thư mời"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Chia Sẻ</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
