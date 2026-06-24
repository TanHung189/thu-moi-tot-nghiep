// Component Gallery - Bộ sưu tập ảnh kỷ niệm dạng Timeline với Infinite Scroll
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, X, ChevronLeft, ChevronRight, Heart, MessageCircle, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useInView } from 'react-intersection-observer';
import { useGallery, type GalleryPhoto, type PhotoComment } from '../hooks/useGallery';

// Component Lightbox - hiển thị ảnh phóng to và comments
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onLike,
  onAddComment,
  getComments
}: {
  images: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLike: (id: string) => void;
  onAddComment: (id: string, name: string, content: string) => Promise<PhotoComment>;
  getComments: (id: string) => Promise<PhotoComment[]>;
}) {
  const currentPhoto = images[currentIndex];
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingComments(true);
    getComments(currentPhoto.id).then((data) => {
      if (isMounted) {
        setComments(data);
        setLoadingComments(false);
      }
    });
    return () => { isMounted = false; };
  }, [currentPhoto.id, getComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const added = await onAddComment(currentPhoto.id, commentName, newComment);
      setComments(prev => [...prev, added]);
      setNewComment('');
    } catch (err) {
      console.error('Lỗi khi thêm bình luận', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        aria-modal="true"
      >
        <div className="flex flex-col lg:flex-row w-full max-w-6xl h-full max-h-[90vh] mx-4 bg-white rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* Nút đóng cho Mobile & Desktop */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-[#f4f4f4]/80 backdrop-blur-md rounded-full p-2 text-[#1a1a1a] hover:bg-[#bca374] hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Phần Ảnh */}
          <div className="flex-1 relative bg-black/5 flex items-center justify-center p-4 lg:p-8">
            <img
              src={currentPhoto.image_url}
              alt={currentPhoto.caption || 'Kỷ niệm'}
              className="max-w-full max-h-full object-contain drop-shadow-lg"
            />

            <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 hover:bg-[#bca374] hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 hover:bg-[#bca374] hover:text-white transition-colors">
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* Phần Tương tác (Caption, Comments) */}
          <div className="w-full lg:w-[400px] flex flex-col bg-white border-l border-gray-100">
            {/* Header: User / Tương tác */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="font-semibold text-gray-800">
                {currentPhoto.timeline_date ? format(parseISO(currentPhoto.timeline_date), 'dd MMMM, yyyy', { locale: vi }) : 'Kỷ niệm'}
              </div>
              <button 
                onClick={() => onLike(currentPhoto.id)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${currentPhoto.user_has_liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-sm font-medium">{currentPhoto.likes_count || 0}</span>
              </button>
            </div>

            {/* Content (Caption + Comments list) */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {currentPhoto.caption && (
                <div className="mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{currentPhoto.caption}</p>
                </div>
              )}

              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> 
                Bình luận ({currentPhoto.comments_count || 0})
              </h4>

              {loadingComments ? (
                <div className="text-center text-sm text-gray-400 py-4">Đang tải...</div>
              ) : comments.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
              ) : (
                <div className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className="flex flex-col">
                      <span className="font-semibold text-sm text-gray-900">{c.author_name}</span>
                      <span className="text-sm text-gray-700 mt-0.5">{c.content}</span>
                      <span className="text-xs text-gray-400 mt-1">{format(parseISO(c.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100 bg-gray-50/50">
              <input
                type="text"
                placeholder="Tên của bạn..."
                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 mb-2 outline-none focus:border-[#bca374] transition-colors"
                value={commentName}
                onChange={e => setCommentName(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  className="w-full text-sm bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2 outline-none focus:border-[#bca374] transition-colors"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting || !newComment.trim() || !commentName.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#bca374] disabled:opacity-50 hover:text-gold-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Card hiển thị trên masonry grid
function GalleryCard({ 
  image, 
  index, 
  onClick 
}: { 
  image: GalleryPhoto; 
  index: number; 
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
      className="masonry-item group relative break-inside-avoid mb-4"
      onClick={onClick}
    >
      <div className="relative w-full overflow-hidden border-[4px] border-white shadow-sm p-1 bg-white rounded-xl">
        <img
          src={image.image_url}
          alt={image.caption || 'Kỷ niệm'}
          className="w-full h-auto object-cover transition-all duration-700 filter group-hover:scale-105 rounded-lg"
          loading="lazy"
        />
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
          <div className="flex items-center gap-4 text-white font-medium drop-shadow-md">
            <div className="flex items-center gap-1.5">
              <Heart className={`w-5 h-5 ${image.user_has_liked ? 'fill-red-500 text-red-500' : 'fill-white'}`} />
              <span>{image.likes_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{image.comments_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Tạo identifier ngẫu nhiên (hoặc lấy từ localStorage) cho user
const getUserIdentifier = () => {
  let uid = localStorage.getItem('gallery_user_uid');
  if (!uid) {
    uid = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('gallery_user_uid', uid);
  }
  return uid;
};

export default function GallerySection() {
  const userIdentifier = useMemo(() => getUserIdentifier(), []);
  const { photos, loading, hasMore, fetchPhotos, toggleLike, addComment, getComments } = useGallery(userIdentifier);
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '400px',
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchPhotos();
    }
  }, [inView, hasMore, loading, fetchPhotos]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  };

  // Group photos by Month-Year timeline
  const timelineGroups = useMemo(() => {
    const groups: { [key: string]: GalleryPhoto[] } = {};
    photos.forEach(photo => {
      // Use YYYY-MM as the key for reliable grouping and sorting
      const groupKey = photo.timeline_date ? photo.timeline_date.substring(0, 7) : 'Chưa phân loại';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(photo);
    });
    
    return Object.entries(groups)
      .sort((a, b) => {
        if (a[0] === 'Chưa phân loại') return 1;
        if (b[0] === 'Chưa phân loại') return -1;
        // Since key is YYYY-MM, string comparison works perfectly for descending order
        return b[0].localeCompare(a[0]);
      })
      .map(([key, groupPhotos]) => {
        let displayName = 'Chưa phân loại';
        if (key !== 'Chưa phân loại') {
          const dateObj = parseISO(`${key}-01`);
          displayName = format(dateObj, "'Tháng' M 'năm' yyyy", { locale: vi });
        }
        return { key, displayName, groupPhotos };
      });
  }, [photos]);

  return (
    <section id="gallery" className="section-padding relative z-10 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4 opacity-70">
            <Images className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
            <span className="text-[#bca374] text-sm font-medium tracking-widest uppercase">Bộ Sưu Tập</span>
            <Images className="w-5 h-5 text-[#bca374]" strokeWidth={1.5} />
          </div>
          <h2 className="section-title mb-4">
            <span className="text-[#bca374] font-script text-5xl">Dòng Thời Gian</span>
          </h2>
          <p className="text-[#666666] max-w-lg mx-auto font-handwriting text-xl">
            Hành trình đại học qua những khung hình
          </p>
        </motion.div>

        {photos.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Chưa có hình ảnh nào trong bộ sưu tập.</p>
          </div>
        )}

        {/* Timeline View */}
        <div className="space-y-16">
          {timelineGroups.map(({ key, displayName, groupPhotos }) => (
            <div key={key} className="relative">
              {/* Cột mốc thời gian */}
              <div className="sticky top-20 z-20 flex justify-center mb-8 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-[#bca374]/30">
                  <span className="font-serif text-[#bca374] font-bold text-lg">{displayName}</span>
                </div>
              </div>

              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {groupPhotos.map((photo) => {
                  // Find global index for lightbox
                  const globalIndex = photos.findIndex(p => p.id === photo.id);
                  return (
                    <GalleryCard
                      key={photo.id}
                      image={photo}
                      index={globalIndex}
                      onClick={() => openLightbox(globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll trigger */}
        <div ref={ref} className="w-full py-8 flex justify-center mt-8">
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-[#bca374]/30 border-t-[#bca374] rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500 font-medium tracking-wide">Đang tải thêm kỷ niệm...</span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          onLike={toggleLike}
          onAddComment={addComment}
          getComments={getComments}
        />
      )}
    </section>
  );
}
