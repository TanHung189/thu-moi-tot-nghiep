// Component Location Section - Hiển thị địa điểm và bản đồ
import { motion } from 'framer-motion';
import { MapPin, Navigation, Calendar, ExternalLink } from 'lucide-react';
import { EVENT_INFO } from '../data/eventData';

// Tạo link thêm vào Google Calendar
function getGoogleCalendarUrl(): string {
  const title = encodeURIComponent(`Lễ Tốt Nghiệp - ${EVENT_INFO.name}`);
  const details = encodeURIComponent(`Trân trọng kính mời tham dự Lễ Tốt Nghiệp Đại Học của ${EVENT_INFO.name}`);
  const location = encodeURIComponent(EVENT_INFO.venue + ', ' + EVENT_INFO.address);

  // Format ngày tháng cho Google Calendar: YYYYMMDDTHHMMSS
  const startDate = '20260711T133000'; // ⚠️ THAY NĂM nếu cần
  const endDate = '20260711T170000';   // ⚠️ THAY NĂM nếu cần

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}%2F${endDate}`;
}

// Tạo file ICS để thêm vào lịch Apple/Outlook
function downloadICSFile() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Graduation Invitation//VI
BEGIN:VEVENT
DTSTART:20260711T063000Z
DTEND:20260711T100000Z
SUMMARY:Lễ Tốt Nghiệp - ${EVENT_INFO.name}
DESCRIPTION:Trân trọng kính mời tham dự Lễ Tốt Nghiệp Đại Học của ${EVENT_INFO.name}
LOCATION:${EVENT_INFO.venue}, ${EVENT_INFO.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'le-tot-nghiep-bui-do-tan-hung.ics';
  link.click();
  URL.revokeObjectURL(url);
}

export default function LocationSection() {
  return (
    <section id="location" className="section-padding relative z-10">
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
            <MapPin className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
            <span className="text-[#bca374] text-sm font-medium tracking-widest uppercase">Địa Điểm Tổ Chức</span>
            <MapPin className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
          </div>
          <h2 className="section-title mb-4">
            <span className="text-[#bca374] text-2xl md:text-3xl font-serif">Lễ Tốt Nghiệp</span>
          </h2>
        </motion.div>

        {/* Grid: Thông tin bên trái + Bản đồ bên phải */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Card thông tin địa điểm */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-[1px] border-[#d1d5db] bg-transparent p-8 flex flex-col gap-8"
          >
            {/* Tên trường */}
            <div className="flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-[#bca374] mb-3" strokeWidth={1} />
              <p className="text-[#666666] text-xs uppercase tracking-widest mb-2">Địa Điểm</p>
              <h3 className="text-[#1a1a1a] font-serif font-bold text-xl leading-snug mb-1">
                {EVENT_INFO.venue}
              </h3>
              <p className="text-[#666666] text-sm">{EVENT_INFO.address}</p>
            </div>

            {/* Đường kẻ trang trí */}
            <div className="w-24 mx-auto h-px bg-[#d1d5db]" />

            {/* Thời gian */}
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-8 h-8 text-[#bca374] mb-3" strokeWidth={1} />
              <p className="text-[#666666] text-xs uppercase tracking-widest mb-2">Thời Gian</p>
              <p className="text-[#1a1a1a] font-bold font-serif text-xl mb-1">
                {EVENT_INFO.startTime} – {EVENT_INFO.endTime}
              </p>
              <p className="text-[#666666] text-sm uppercase tracking-widest">{EVENT_INFO.dateDisplay}</p>
            </div>

            {/* Đường kẻ trang trí */}
            <div className="w-full h-px bg-[#d1d5db]" />

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Thêm vào Google Calendar */}
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-add-google-calendar"
                className="btn-gold flex items-center justify-center gap-2 text-sm flex-1"
                aria-label="Thêm vào Google Calendar"
              >
                <Calendar className="w-4 h-4" />
                <span>Google Calendar</span>
              </a>

              {/* Thêm vào lịch (.ics) */}
              <button
                onClick={downloadICSFile}
                id="btn-add-ics-calendar"
                className="btn-glass flex items-center justify-center gap-2 text-sm flex-1"
                aria-label="Tải file lịch .ics"
              >
                <Calendar className="w-4 h-4 text-[#bca374]" />
                <span>Lịch Apple/Outlook</span>
              </button>
            </div>

            {/* Nút chỉ đường */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(EVENT_INFO.venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-get-directions"
              className="flex items-center justify-center gap-2 text-[#666666] hover:text-[#bca374] transition-colors text-xs tracking-widest uppercase font-medium mt-2"
              aria-label="Xem chỉ đường trên Google Maps"
            >
              <Navigation className="w-4 h-4" />
              <span>Xem chỉ đường trên Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>

          {/* Google Maps iframe */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-[1px] border-[#d1d5db] bg-[#e5e7eb] overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            {/*
              ⚠️ THAY ĐỔI: Bên dưới là iframe Google Maps của Trường Đại học An Giang
              Để lấy iframe mới:
              1. Vào Google Maps, tìm "Trường Đại học An Giang"
              2. Click "Share" -> "Embed a map"
              3. Sao chép code iframe và dán vào đây
            */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0!2d105.4167!3d10.3833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0e3f4d5c6e7a9%3A0x1234567890abcdef!2sTr%C6%B0%E1%BB%9Dng%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20An%20Giang!5e0!3m2!1svi!2svn!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px', filter: 'grayscale(1) sepia(0.2) opacity(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Trường Đại học An Giang"
              aria-label="Bản đồ vị trí Trường Đại học An Giang"
            />
          </motion.div>
        </div>

        {/* Ghi chú */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-[#666666] font-handwriting text-xl mt-8"
        >
          🚗 Có bãi đậu xe rộng rãi trong khuôn viên trường
        </motion.p>
      </div>
    </section>
  );
}
