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
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center relative border-[1px] border-[#d1d5db] bg-transparent"
      >
        <span
          className="countdown-digit text-3xl sm:text-4xl md:text-5xl text-[#bca374] font-serif"
          aria-label={`${value} ${label}`}
        >
          {formatted}
        </span>
      </div>
      <span className="mt-3 text-[#666666] text-xs sm:text-sm font-medium tracking-widest uppercase">
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
          <div className="flex items-center justify-center gap-3 mb-4 opacity-70">
            <Clock className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
            <span className="text-[#bca374] text-sm font-medium tracking-widest uppercase">Đếm Ngược</span>
            <Clock className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
          </div>

          {isExpired ? (
            <div className="flex flex-col items-center gap-3">
              <PartyPopper className="w-10 h-10 text-[#bca374]" strokeWidth={1.5} />
              <h2 className="section-title text-[#1a1a1a]">
                Hôm Nay Là Ngày Trọng Đại!
              </h2>
              <p className="text-[#666666] text-lg font-handwriting">Chúc mừng Bùi Đỗ Tấn Hưng tốt nghiệp!</p>
            </div>
          ) : (
            <>
              <h2 className="section-title mb-4">
                <span className="text-[#bca374]">Còn Lại</span>
                <span className="text-[#1a1a1a]"> Bao Lâu?</span>
              </h2>
              <p className="text-[#666666] text-base tracking-wider uppercase text-sm mt-4">
                Đến <span className="text-[#1a1a1a] font-semibold">{EVENT_INFO.startTime}</span>{' '}
                ngày <span className="text-[#1a1a1a] font-semibold">{EVENT_INFO.dateDisplay}</span>
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
                  <span className="text-[#d1d5db] text-2xl sm:text-4xl font-serif font-light self-start mt-4 sm:mt-5">
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
          className="mt-12 border border-[#d1d5db] p-6 bg-transparent"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#666666] text-xs uppercase tracking-widest">Đang trong hành trình...</span>
            <span className="text-[#1a1a1a] text-sm font-semibold">
              {EVENT_INFO.dateDisplay}
            </span>
          </div>
          <div className="w-full h-1 bg-[#e5e7eb] overflow-hidden">
            <div
              className="h-full transition-all duration-1000 bg-[#bca374]"
              style={{
                width: isExpired ? '100%' : `${Math.max(5, 100 - (timeLeft.days / 365) * 100)}%`,
              }}
            />
          </div>
          <p className="text-[#bca374] font-handwriting text-xl mt-4 text-center">
            "Hành trình ngàn dặm bắt đầu từ một bước chân"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
