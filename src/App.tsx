// ============================================================
// App.tsx - Component gốc của Thư Mời Tốt Nghiệp Online
// Tác giả: Generated for Bùi Đỗ Tấn Hưng's Graduation
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';

// Các component chính
import ParticlesBackground from './components/ParticlesBackground';
import HeroSection from './components/HeroSection';
import CountdownSection from './components/CountdownSection';
import LocationSection from './components/LocationSection';
import GallerySection from './components/GallerySection';
import RSVPForm from './components/RSVPForm';
import Guestbook from './components/Guestbook';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import QRCodeModal from './components/QRCodeModal';
import Footer from './components/Footer';

// Dữ liệu lời chúc ban đầu
import { initialMessages, type GuestMessage } from './data/eventData';

// Component Navigation (thanh điều hướng cố định phía trên)
function Navbar() {
  const navLinks = [
    { href: '#hero', label: 'Trang Chủ' },
    { href: '#countdown', label: 'Đếm Ngược' },
    { href: '#location', label: 'Địa Điểm' },
    { href: '#gallery', label: 'Kỷ Niệm' },
    { href: '#rsvp', label: 'RSVP' },
    { href: '#guestbook', label: 'Lưu Bút' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40"
      role="navigation"
      aria-label="Navigation chính"
    >
      <div
        className="mx-4 mt-4 rounded-2xl px-4 py-3"
        style={{
          background: 'rgba(7, 19, 39, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 160, 23, 0.2)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Desktop nav */}
        <div className="hidden md:flex items-center justify-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-white/70 hover:text-gold-400 rounded-xl hover:bg-white/5 transition-all duration-200 font-medium"
              aria-label={`Điều hướng đến ${link.label}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile nav - scroll ngang */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 px-3 py-1.5 text-xs text-white/70 hover:text-gold-400 rounded-xl hover:bg-white/5 transition-all duration-200 font-medium"
              aria-label={`Điều hướng đến ${link.label}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

// Component phân cách section sang trọng
function SectionDivider() {
  return (
    <div className="relative z-10 flex items-center justify-center py-4 px-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-500/20" />
      <div className="mx-4 flex items-center gap-2">
        <span className="text-gold-500/40 text-xs">✦</span>
        <span className="text-gold-500/30 text-xs">✦</span>
        <span className="text-gold-500/40 text-xs">✦</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-500/20" />
    </div>
  );
}

// ===== Component App chính =====
export default function App() {
  // State quản lý danh sách lời chúc
  const [messages, setMessages] = useState<GuestMessage[]>(initialMessages);

  // Hàm thêm lời chúc mới từ form RSVP
  const handleNewMessage = (newMessage: GuestMessage) => {
    setMessages((prev) => [newMessage, ...prev]);
  };

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-x-hidden">
      {/* Layer 0: Nền hạt vàng và gradient */}
      <ParticlesBackground />

      {/* Layer 1: Navigation */}
      <Navbar />

      {/* Layer 2: Nội dung chính */}
      <main className="relative z-10">
        {/* Hero - Phần đầu trang */}
        <HeroSection />

        <SectionDivider />

        {/* Countdown - Đồng hồ đếm ngược */}
        <CountdownSection />

        <SectionDivider />

        {/* Location - Địa điểm và bản đồ */}
        <LocationSection />

        <SectionDivider />

        {/* Gallery - Bộ sưu tập ảnh kỷ niệm */}
        <GallerySection />

        <SectionDivider />

        {/* RSVP - Form xác nhận tham dự */}
        <RSVPForm onSubmit={handleNewMessage} />

        <SectionDivider />

        {/* Guestbook - Sổ lưu bút với sticky notes */}
        <Guestbook messages={messages} />

        {/* Footer */}
        <Footer />
      </main>

      {/* Layer 3: Floating elements (không bị ảnh hưởng bởi scroll) */}
      {/* Đĩa nhạc vinyl nổi */}
      <FloatingAudioPlayer />

      {/* Nút QR Code */}
      <QRCodeModal />
    </div>
  );
}
