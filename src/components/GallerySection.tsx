// Component Gallery - Bộ sưu tập ảnh kỷ niệm dạng Masonry với Lightbox
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages, type GalleryImage } from '../data/eventData';

// Component Lightbox - hiển thị ảnh phóng to
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-modal="true"
        aria-label="Lightbox xem ảnh"
      >
        {/* Container ảnh */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-4xl max-h-[90vh] w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="w-full h-full object-contain rounded-2xl"
            style={{ maxHeight: '80vh' }}
          />

          {/* Nút đóng */}
          <button
            onClick={onClose}
            id="lightbox-close-btn"
            className="absolute top-4 right-4 bg-[#f4f4f4] rounded-none p-2 text-[#1a1a1a] hover:bg-[#bca374] hover:text-white transition-colors border border-[#d1d5db]"
            aria-label="Đóng lightbox"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Nút điều hướng trái */}
          <button
            onClick={onPrev}
            id="lightbox-prev-btn"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#f4f4f4] rounded-none p-3 text-[#1a1a1a] hover:bg-[#bca374] hover:text-white transition-colors border border-[#d1d5db]"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Nút điều hướng phải */}
          <button
            onClick={onNext}
            id="lightbox-next-btn"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#f4f4f4] rounded-none p-3 text-[#1a1a1a] hover:bg-[#bca374] hover:text-white transition-colors border border-[#d1d5db]"
            aria-label="Ảnh tiếp theo"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Chỉ số ảnh */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#f4f4f4] px-4 py-2 rounded-none border border-[#d1d5db]">
            <span className="text-[#666666] text-sm tracking-widest">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Component card ảnh đơn lẻ
function GalleryCard({ image, index, onClick }: { image: GalleryImage; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="masonry-item group"
      onClick={onClick}
      style={{
        // Ảnh tall cao hơn ảnh normal
        aspectRatio: image.size === 'tall' ? '2/3' : image.size === 'wide' ? '16/9' : '1/1',
      }}
      aria-label={`Xem ảnh: ${image.alt}`}
    >
      <div className="relative w-full h-full overflow-hidden border-[4px] border-white shadow-sm p-1 bg-white">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover transition-all duration-700 filter grayscale sepia-[0.2] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay khi hover */}
        <div className="absolute inset-0 bg-[#f4f4f4]/0 group-hover:bg-[#f4f4f4]/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white border border-[#bca374] p-3 rounded-none">
            <Images className="w-6 h-6 text-[#bca374]" strokeWidth={1} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
  };

  return (
    <section id="gallery" className="section-padding relative z-10">
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
            <Images className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
            <span className="text-[#bca374] text-sm font-medium tracking-widest uppercase">Bộ Sưu Tập</span>
            <Images className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
          </div>
          <h2 className="section-title mb-4">
            <span className="text-[#bca374] font-script text-5xl">Kỷ Niệm</span>{' '}
            <span className="text-[#1a1a1a]">Đáng Nhớ</span>
          </h2>
          <p className="text-[#666666] max-w-lg mx-auto font-handwriting text-xl">
            Những khoảnh khắc quý giá trên hành trình đại học
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {galleryImages.map((image, index) => (
            <GalleryCard
              key={image.id}
              image={image}
              index={index}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>

        {/* Ghi chú thay ảnh */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 border border-[#d1d5db] bg-transparent p-4 text-center"
        >
          <p className="text-[#666666] text-sm tracking-widest uppercase">
            💡 <span className="text-[#bca374]">Mẹo:</span> Thay link ảnh trong file{' '}
            <code className="text-[#1a1a1a] border border-[#d1d5db] px-2 py-0.5 text-xs">
              src/data/eventData.ts
            </code>{' '}
            để hiển thị ảnh của bạn
          </p>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </section>
  );
}
