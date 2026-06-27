// ===== Dữ liệu ảnh kỷ niệm =====
// ⚠️ THAY ĐỔI: Thay các URL bên dưới bằng link ảnh thực của bạn
// Gợi ý: Upload ảnh lên Google Drive, Imgur, hoặc Cloudinary rồi lấy direct link
// Ví dụ Imgur: https://i.imgur.com/XXXXXXX.jpg

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  // 'tall' | 'wide' | 'normal' để kiểm soát kích thước trong masonry grid
  size: "tall" | "wide" | "normal";
}

// ===== Thông tin sự kiện =====
export const EVENT_INFO = {
  name: "BÙI ĐỖ TẤN HƯNG",
  // Ngày tốt nghiệp: 11/07/2026
  // ⚠️ THAY ĐỔI: Chỉnh lại năm cho đúng với năm tốt nghiệp của bạn
  eventDate: new Date("2026-07-11T13:30:00+07:00"),
  startTime: "13:30",
  endTime: "17:00",
  dateDisplay: "Ngày 11 Tháng 7",
  venue: "Hội Trường 300A, \n Trường Đại học An Giang - ĐHQG TP.HCM",
  address: "18 Ung Văn Khiêm, Đông Xuyên, Thành phố Long Xuyên, An Giang",
  // ⚠️ THAY ĐỔI: URL trang web của bạn khi deploy (dùng cho QR Code)
  shareUrl: "https://thu-moi-tot-nghiep-pi.vercel.app/",
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
  "bg-yellow-200/90",
  "bg-blue-200/90",
  "bg-green-200/90",
  "bg-pink-200/90",
  "bg-purple-200/90",
  "bg-orange-200/90",
];
