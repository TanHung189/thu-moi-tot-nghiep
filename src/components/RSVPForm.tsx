// Component RSVP Form - Form xác nhận tham dự với validation
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Heart, PartyPopper } from 'lucide-react';
import { NOTE_COLORS, type GuestMessage } from '../data/eventData';

interface RSVPFormProps {
  onSubmit: (message: GuestMessage) => void;
}

type AttendingStatus = 'yes' | 'no' | '';

export default function RSVPForm({ onSubmit }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<AttendingStatus>('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kiểm tra validation form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập tên của bạn';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Tên phải có ít nhất 2 ký tự';
    }

    if (!attending) {
      newErrors.attending = 'Vui lòng chọn trạng thái tham dự';
    }

    if (!message.trim()) {
      newErrors.message = 'Vui lòng để lại lời chúc cho Hưng nhé!';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Lời chúc cần ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Giả lập delay gửi (thay bằng API call thực tế nếu có backend)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newMessage: GuestMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      attending: attending === 'yes',
      timestamp: new Date(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    };

    onSubmit(newMessage);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Reset form để gửi thêm lời chúc
  const handleReset = () => {
    setName('');
    setAttending('');
    setMessage('');
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="rsvp" className="section-padding relative z-10">
      <div className="max-w-2xl mx-auto">

        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-gold-400 fill-gold-400" />
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">RSVP</span>
            <Heart className="w-5 h-5 text-gold-400 fill-gold-400" />
          </div>
          <h2 className="section-title mb-4">
            <span className="gold-text">Xác Nhận</span>{' '}
            <span className="text-white">Tham Dự</span>
          </h2>
          <p className="text-white/60">
            Để lại lời chúc và cho Hưng biết bạn có đến tham dự không nhé! 💌
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card gold-border rounded-3xl p-8"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              /* Màn hình cảm ơn sau khi gửi */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-8 flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <PartyPopper className="w-16 h-16 text-gold-400" />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold gold-text">
                  Cảm ơn {name}! 🎉
                </h3>
                <p className="text-white/70 max-w-sm">
                  {attending === 'yes'
                    ? 'Tuyệt vời! Hưng rất vui khi bạn sẽ đến tham dự. Hẹn gặp bạn vào ngày trọng đại! 🎓'
                    : 'Rất tiếc khi bạn không thể đến! Hưng sẽ nhớ lời chúc của bạn! 💕'}
                </p>
                <button
                  onClick={handleReset}
                  id="rsvp-send-another-btn"
                  className="btn-glass mt-4 text-sm"
                >
                  Gửi lời chúc khác
                </button>
              </motion.div>
            ) : (
              /* Form RSVP */
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
                noValidate
              >
                {/* Trường tên */}
                <div>
                  <label htmlFor="rsvp-name" className="form-label">
                    Tên của bạn <span className="text-gold-400">*</span>
                  </label>
                  <input
                    id="rsvp-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Nguyễn Văn A..."
                    className="form-input"
                    maxLength={50}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="rsvp-name-error" className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Lựa chọn tham dự */}
                <div>
                  <label className="form-label">
                    Bạn có tham dự không? <span className="text-gold-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Trạng thái tham dự">
                    {/* Nút Tham dự */}
                    <button
                      type="button"
                      id="rsvp-attending-yes"
                      onClick={() => {
                        setAttending('yes');
                        if (errors.attending) setErrors((prev) => ({ ...prev, attending: '' }));
                      }}
                      className={`
                        relative rounded-xl px-4 py-4 border transition-all duration-300 text-center
                        ${attending === 'yes'
                          ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                          : 'glass-card border-white/10 text-white/70 hover:border-gold-500/30'
                        }
                      `}
                      aria-pressed={attending === 'yes'}
                    >
                      {attending === 'yes' && (
                        <CheckCircle className="w-4 h-4 text-gold-400 absolute top-2 right-2" />
                      )}
                      <span className="text-xl mb-1 block">🎓</span>
                      <span className="text-sm font-semibold block">Mình sẽ đến!</span>
                    </button>

                    {/* Nút Không tham dự */}
                    <button
                      type="button"
                      id="rsvp-attending-no"
                      onClick={() => {
                        setAttending('no');
                        if (errors.attending) setErrors((prev) => ({ ...prev, attending: '' }));
                      }}
                      className={`
                        relative rounded-xl px-4 py-4 border transition-all duration-300 text-center
                        ${attending === 'no'
                          ? 'bg-white/10 border-white/30 text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                          : 'glass-card border-white/10 text-white/70 hover:border-white/20'
                        }
                      `}
                      aria-pressed={attending === 'no'}
                    >
                      {attending === 'no' && (
                        <CheckCircle className="w-4 h-4 text-white/50 absolute top-2 right-2" />
                      )}
                      <span className="text-xl mb-1 block">😢</span>
                      <span className="text-sm font-semibold block">Tiếc quá, mình bận</span>
                    </button>
                  </div>
                  {errors.attending && (
                    <p className="text-red-400 text-xs mt-1">{errors.attending}</p>
                  )}
                </div>

                {/* Lời chúc */}
                <div>
                  <label htmlFor="rsvp-message" className="form-label">
                    Lời chúc của bạn <span className="text-gold-400">*</span>
                  </label>
                  <textarea
                    id="rsvp-message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    placeholder="Gửi lời chúc mừng tốt nghiệp thật ý nghĩa đến Hưng nhé..."
                    className="form-input resize-none"
                    rows={4}
                    maxLength={300}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'rsvp-message-error' : undefined}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message ? (
                      <p id="rsvp-message-error" className="text-red-400 text-xs">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-white/30 text-xs">{message.length}/300</span>
                  </div>
                </div>

                {/* Nút gửi */}
                <button
                  type="submit"
                  id="rsvp-submit-btn"
                  disabled={isSubmitting}
                  className="btn-gold flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Gửi lời chúc"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                      </svg>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Lời Chúc</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
