// Component Countdown Timer - Đồng hồ đếm ngược đến ngày tốt nghiệp
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, PartyPopper } from 'lucide-react';
import { EVENT_INFO } from '../data/eventData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Tính thời gian còn lại
function calculateTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const target = EVENT_INFO.eventDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

// Component card hiển thị từng đơn vị thời gian
function CountdownCard({
  value,
  label,
  index,
}: {
  value: number;
  label: string;
  index: number;
}) {
  const formatted = String(value).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <div
        className="glass-card gold-border rounded-2xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center relative overflow-hidden"
        style={{
          boxShadow: '0 0 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Ánh sáng phía trên */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

        <span
          className="countdown-digit text-3xl sm:text-4xl md:text-5xl font-bold gold-text font-serif"
          aria-label={`${value} ${label}`}
        >
          {formatted}
        </span>
      </div>
      <span className="mt-3 text-white/60 text-xs sm:text-sm font-medium tracking-widest uppercase">
        {label}
      </span>
    </motion.div>
  );
}

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  // Cập nhật đếm ngược mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const units = [
    { value: timeLeft.days, label: 'Ngày' },
    { value: timeLeft.hours, label: 'Giờ' },
    { value: timeLeft.minutes, label: 'Phút' },
    { value: timeLeft.seconds, label: 'Giây' },
  ];

  return (
    <section id="countdown" className="section-padding relative z-10">
      <div className="max-w-4xl mx-auto">

        {/* Tiêu đề section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-gold-400" />
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">Đếm Ngược</span>
            <Clock className="w-5 h-5 text-gold-400" />
          </div>

          {isExpired ? (
            <div className="flex flex-col items-center gap-3">
              <PartyPopper className="w-12 h-12 text-gold-400" />
              <h2 className="section-title gold-text">
                Hôm Nay Là Ngày Trọng Đại!
              </h2>
              <p className="text-white/70 text-lg">Chúc mừng Bùi Đỗ Tấn Hưng tốt nghiệp! 🎓</p>
            </div>
          ) : (
            <>
              <h2 className="section-title mb-4">
                <span className="gold-text">Còn Lại</span>
                <span className="text-white"> Bao Lâu?</span>
              </h2>
              <p className="text-white/60 text-base">
                Đến <span className="text-gold-400 font-semibold">{EVENT_INFO.startTime}</span>{' '}
                ngày <span className="text-gold-400 font-semibold">{EVENT_INFO.dateDisplay}</span>
              </p>
            </>
          )}
        </motion.div>

        {/* Các thẻ đếm ngược */}
        {!isExpired && (
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8">
            {units.map((unit, index) => (
              <div key={unit.label} className="flex items-center gap-3 sm:gap-6">
                <CountdownCard value={unit.value} label={unit.label} index={index} />
                {/* Dấu hai chấm phân cách */}
                {index < units.length - 1 && (
                  <span className="text-gold-400/60 text-2xl sm:text-4xl font-bold self-start mt-4 sm:mt-5 animate-pulse">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Thanh tiến trình ngày */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 glass-card rounded-2xl p-6 gold-border"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Đang trong hành trình...</span>
            <span className="text-gold-400 text-sm font-semibold">
              {EVENT_INFO.dateDisplay}
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                background: 'linear-gradient(90deg, #1d4ed8, #60a5fa, #3b82f6)',
                width: isExpired ? '100%' : `${Math.max(5, 100 - (timeLeft.days / 365) * 100)}%`,
                boxShadow: '0 0 10px rgba(59,130,246,0.6)',
              }}
            />
          </div>
          <p className="text-white/40 text-xs mt-2 text-center">
            "Hành trình ngàn dặm bắt đầu từ một bước chân"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
