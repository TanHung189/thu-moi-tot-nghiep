// ===== Dữ liệu ảnh kỷ niệm =====
// ⚠️ THAY ĐỔI: Thay các URL bên dưới bằng link ảnh thực của bạn
// Gợi ý: Upload ảnh lên Google Drive, Imgur, hoặc Cloudinary rồi lấy direct link
// Ví dụ Imgur: https://i.imgur.com/XXXXXXX.jpg

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  // 'tall' | 'wide' | 'normal' để kiểm soát kích thước trong masonry grid
  size: 'tall' | 'wide' | 'normal';
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    // 👉 THAY Link ảnh 1: ví dụ ảnh chụp trong trường, mặc áo tốt nghiệp
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
    alt: 'Kỷ niệm tốt nghiệp 1',
    size: 'tall',
  },
  {
    id: 2,
    // 👉 THAY Link ảnh 2: ảnh nhóm bạn bè
    src: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=400&q=80',
    alt: 'Kỷ niệm tốt nghiệp 2',
    size: 'normal',
  },
  {
    id: 3,
    // 👉 THAY Link ảnh 3: ảnh nhận bằng
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
    alt: 'Kỷ niệm tốt nghiệp 3',
    size: 'normal',
  },
  {
    id: 4,
    // 👉 THAY Link ảnh 4: ảnh cùng giáo viên
    src: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=400&q=80',
    alt: 'Kỷ niệm tốt nghiệp 4',
    size: 'tall',
  },
  {
    id: 5,
    // 👉 THAY Link ảnh 5: ảnh campus trường
    src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&q=80',
    alt: 'Kỷ niệm tốt nghiệp 5',
    size: 'normal',
  },
  {
    id: 6,
    // 👉 THAY Link ảnh 6: ảnh kỷ niệm
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
    alt: 'Kỷ niệm tốt nghiệp 6',
    size: 'normal',
  },
];

// ===== Thông tin sự kiện =====
export const EVENT_INFO = {
  name: 'BÙI ĐỖ TẤN HƯNG',
  // Ngày tốt nghiệp: 11/07/2026
  // ⚠️ THAY ĐỔI: Chỉnh lại năm cho đúng với năm tốt nghiệp của bạn
  eventDate: new Date('2026-07-11T13:30:00+07:00'),
  startTime: '13:30',
  endTime: '17:00',
  dateDisplay: 'Ngày 11 Tháng 7',
  venue: 'Trường Đại học An Giang - ĐHQG TP.HCM',
  address: '18 Ung Văn Khiêm, Đông Xuyên, Thành phố Long Xuyên, An Giang',
  // ⚠️ THAY ĐỔI: URL trang web của bạn khi deploy (dùng cho QR Code)
  shareUrl: 'https://your-username.github.io/graduation-invitation/',
};

// ===== Lời chúc mẫu ban đầu =====
export interface GuestMessage {
  id: string;
  name: string;
  message: string;
  attending: boolean;
  timestamp: Date;
  color: string;
}

// Màu sắc cho sticky notes
export const NOTE_COLORS = [
  'bg-yellow-200/90',
  'bg-blue-200/90',
  'bg-green-200/90',
  'bg-pink-200/90',
  'bg-purple-200/90',
  'bg-orange-200/90',
];

export const initialMessages: GuestMessage[] = [
  {
    id: '1',
    name: 'Nguyễn Minh Tuấn',
    message: 'Chúc mừng Hưng tốt nghiệp! Bốn năm vất vả đã được đền đáp xứng đáng. Chúc bạn thành công rực rỡ trên con đường phía trước! 🎓',
    attending: true,
    timestamp: new Date(),
    color: NOTE_COLORS[0],
  },
  {
    id: '2',
    name: 'Trần Thị Mai',
    message: 'Hưng ơi, tự hào về cậu lắm! Chặng đường dài phấn đấu hôm nay đã có kết quả. Mình chắc chắn sẽ có mặt để chúc mừng cậu! 🌟',
    attending: true,
    timestamp: new Date(),
    color: NOTE_COLORS[1],
  },
  {
    id: '3',
    name: 'Lê Hoàng Phúc',
    message: 'Ủa hôm đó tao bận quá không đến được nhé! Nhưng tao gửi ngàn lời chúc đến mày! Chúc mày thành công 🍀',
    attending: false,
    timestamp: new Date(),
    color: NOTE_COLORS[2],
  },
];
