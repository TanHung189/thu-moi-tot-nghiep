// ============================================================
// App.tsx - Component gốc của Thư Mời Tốt Nghiệp Online
// Tác giả: Generated for Bùi Đỗ Tấn Hưng's Graduation
// ============================================================

import { useState, useEffect } from 'react';

// Các component chính
import HeroSection from './components/HeroSection';
import CountdownSection from './components/CountdownSection';
import LocationSection from './components/LocationSection';
import GallerySection from './components/GallerySection';
import RSVPForm from './components/RSVPForm';
import Guestbook from './components/Guestbook';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import QRCodeModal from './components/QRCodeModal';
import Footer from './components/Footer';
import AdminGalleryManager from './components/AdminGalleryManager';

// Dữ liệu lời chúc ban đầu
import { type GuestMessage } from './data/eventData';
import { supabase } from './lib/supabaseClient';


// Component phân cách section sang trọng
function SectionDivider() {
  return (
    <div className="relative z-10 flex items-center justify-center py-4 px-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-500/20" />
      <div className="mx-4 flex items-center gap-2">
        <span className="text-[#bca374] text-xs">✦</span>
        <span className="text-[#bca374] text-xs">✦</span>
        <span className="text-[#bca374] text-xs">✦</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-500/20" />
    </div>
  );
}

// ===== Component App chính =====
export default function App() {
  // State quản lý danh sách lời chúc từ Supabase
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Tải lời chúc từ Supabase khi ứng dụng khởi chạy
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedMessages = data.map((msg: any) => ({
            id: msg.id,
            name: msg.name,
            message: msg.message,
            attending: msg.attending,
            color: msg.color,
            timestamp: new Date(msg.created_at),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu từ Supabase:', error);
      }
    };

    fetchMessages();

    // Check for admin route
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Hàm thêm lời chúc mới từ form RSVP lên Supabase
  const handleNewMessage = async (newMessage: GuestMessage) => {
    // Cập nhật giao diện ngay lập tức (Optimistic Update)
    setMessages((prev) => [newMessage, ...prev]);

    // Gửi dữ liệu lên Supabase
    try {
      const { error } = await supabase.from('guestbook').insert([
        {
          id: newMessage.id,
          name: newMessage.name,
          message: newMessage.message,
          attending: newMessage.attending,
          color: newMessage.color,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Lỗi khi gửi lời chúc lên Supabase:', error);
    }
  };

  if (isAdminRoute) {
    return <AdminGalleryManager />;
  }

  return (
    <div className="relative min-h-screen bg-transparent overflow-x-hidden">
      {/* Layer 1: Nội dung chính */}
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
