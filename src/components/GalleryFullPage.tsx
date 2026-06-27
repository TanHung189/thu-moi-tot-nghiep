// GalleryFullPage.tsx - Trang xem toàn bộ bộ sưu tập dạng 3 cột masonry (kiểu Locket)
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, MessageCircle, Send, X,
  ChevronLeft, ChevronRight, Images, Film, Link as LinkIcon
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useGallery, type GalleryPhoto, type PhotoComment } from '../hooks/useGallery';
import { getEmbedUrl } from './AdminGalleryManager';

// ── Tạo user identifier ───────────────────────────────────────────────────────
const getUserIdentifier = () => {
  let uid = localStorage.getItem('gallery_user_uid');
  if (!uid) {
    uid = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('gallery_user_uid', uid);
  }
  return uid;
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  images, currentIndex, onClose, onPrev, onNext, onLike, onAddComment, getComments
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
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    let isMounted = true;
    setLoadingComments(true);
    getComments(currentPhoto.id).then((data) => {
      if (isMounted) { setComments(data); setLoadingComments(false); }
    });
    return () => { isMounted = false; document.body.style.overflow = originalStyle; };
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

  const renderMedia = () => {
    if (currentPhoto.media_type === 'video') {
      return (
        <video
          src={currentPhoto.image_url}
          className="max-w-full max-h-full object-contain drop-shadow-lg"
          controls autoPlay loop playsInline
        />
      );
    }
    if (currentPhoto.media_type === 'video_url') {
      const { embedUrl, type } = getEmbedUrl(currentPhoto.image_url);
      return type === 'direct'
        ? <video src={embedUrl} controls autoPlay loop playsInline className="max-w-full max-h-full object-contain" />
        : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentPhoto.caption || 'Video'}
          />
        );
    }
    return (
      <img
        src={currentPhoto.image_url}
        alt={currentPhoto.caption || 'Kỷ niệm'}
        className="max-w-full max-h-full object-contain drop-shadow-lg"
      />
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        aria-modal="true"
      >
        <div className="flex flex-col lg:flex-row w-full max-w-6xl h-full max-h-[90vh] mx-4 bg-white rounded-xl overflow-hidden shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-[#f4f4f4]/80 backdrop-blur-md rounded-full p-2 text-[#1a1a1a] hover:bg-[#bca374] hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Media */}
          <div className="relative bg-black/5 flex items-center justify-center p-2 lg:p-8 h-[45vh] shrink-0 lg:h-auto lg:flex-1">
            {renderMedia()}
            <button onClick={onPrev} className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 lg:p-3 hover:bg-[#bca374] hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={1.5} />
            </button>
            <button onClick={onNext} className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 lg:p-3 hover:bg-[#bca374] hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* Sidebar tương tác */}
          <div className="flex-1 lg:w-[400px] flex flex-col bg-white border-l border-gray-100 min-h-0">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="font-semibold text-gray-800">
                {currentPhoto.timeline_date
                  ? format(parseISO(currentPhoto.timeline_date), 'dd MMMM, yyyy', { locale: vi })
                  : 'Kỷ niệm'}
              </div>
              <button
                onClick={() => onLike(currentPhoto.id)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${currentPhoto.user_has_liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-sm font-medium">{currentPhoto.likes_count || 0}</span>
              </button>
            </div>

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
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#bca374] disabled:opacity-50 transition-colors"
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

// ── Card ảnh/video 3 cột ──────────────────────────────────────────────────────
function PhotoCard({ photo, index, onClick }: { photo: GalleryPhoto; index: number; onClick: () => void }) {
  const isVideo = photo.media_type === 'video' || photo.media_type === 'video_url';

  const renderThumbnail = () => {
    if (photo.media_type === 'video') {
      return (
        <video
          src={photo.image_url}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          muted preload="metadata" playsInline
          onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
          onMouseLeave={e => {
            const v = e.currentTarget as HTMLVideoElement;
            v.pause(); v.currentTime = 0;
          }}
        />
      );
    }
    if (photo.media_type === 'video_url') {
      const ytId = photo.image_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([-\w]{11})/)?.[1];
      const { embedUrl } = getEmbedUrl(photo.image_url);
      return ytId ? (
        <img
          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
          alt={photo.caption || 'Video'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <iframe src={embedUrl} className="w-full h-full pointer-events-none" title={photo.caption || 'Video'} />
      );
    }
    return (
      <img
        src={photo.image_url}
        alt={photo.caption || 'Kỷ niệm'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 12) * 0.04 }}
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="w-full overflow-hidden">
        {renderThumbnail()}
      </div>

      {/* Badge video */}
      {isVideo && (
        <div className="absolute top-2 left-2 z-10">
          {photo.media_type === 'video_url' ? (
            <span className="flex items-center gap-1 bg-purple-600/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
              <LinkIcon className="w-3 h-3" />
              Video
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
              <Film className="w-3 h-3" /> Video
            </span>
          )}
        </div>
      )}

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-end opacity-0 group-hover:opacity-100">
        <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-3 text-white text-xs font-medium">
            <span className="flex items-center gap-1">
              <Heart className={`w-3.5 h-3.5 ${photo.user_has_liked ? 'fill-red-400 text-red-400' : 'fill-white'}`} />
              {photo.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              {photo.comments_count || 0}
            </span>
            {photo.caption && (
              <span className="truncate flex-1 text-white/80">{photo.caption}</span>
            )}
          </div>
        </div>
      </div>

      {/* Play icon for video */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <Film className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main GalleryFullPage ──────────────────────────────────────────────────────
export default function GalleryFullPage() {
  const userIdentifier = useMemo(() => getUserIdentifier(), []);
  const { photos, loading, hasMore, fetchPhotos, toggleLike, addComment, getComments } = useGallery(userIdentifier);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Khóa scroll trang nền khi mở lightbox
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Infinite scroll với IntersectionObserver
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      fetchPhotos();
    }
  }, [hasMore, loading, fetchPhotos]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '400px',
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Chia photos thành 3 cột (đổ từ trên xuống)
  const columns = useMemo(() => {
    const col0: GalleryPhoto[] = [];
    const col1: GalleryPhoto[] = [];
    const col2: GalleryPhoto[] = [];
    photos.forEach((p, i) => {
      if (i % 3 === 0) col0.push(p);
      else if (i % 3 === 1) col1.push(p);
      else col2.push(p);
    });
    return [col0, col1, col2];
  }, [photos]);

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

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Header sticky */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#bca374]/20 shadow-sm">
        <div className="max-w-5xl mx-auto relative px-4 py-3 flex items-center justify-center min-h-[60px]">
          <button
            onClick={() => {
              window.location.hash = '';
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }}
            className="absolute left-3 sm:left-4 flex items-center gap-1.5 px-3 py-2 rounded-full text-[#bca374] hover:bg-[#bca374]/10 border border-[#bca374]/30 hover:border-[#bca374] transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <div className="text-center px-12 sm:px-0">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <Images className="w-4 h-4 text-[#bca374]" strokeWidth={1.5} />
              <h1 className="font-serif text-[#bca374] font-bold text-base sm:text-lg tracking-wide truncate">Bộ Sưu Tập Kỷ Niệm</h1>
              <Images className="w-4 h-4 text-[#bca374]" strokeWidth={1.5} />
            </div>
            {photos.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">{photos.length}{hasMore ? '+' : ''} kỷ niệm</p>
            )}
          </div>
        </div>
      </header>

      {/* Grid 3 cột dọc theo kiểu Locket */}
      <main className="max-w-5xl mx-auto px-3 py-4">
        {photos.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <Images className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-base font-medium">Chưa có hình ảnh nào</p>
            <p className="text-sm mt-1">Hãy tải lên những kỷ niệm đẹp!</p>
          </div>
        )}

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1 sm:gap-2">
                {col.map((photo) => {
                  const globalIndex = photos.findIndex(p => p.id === photo.id);
                  return (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      index={globalIndex}
                      onClick={() => openLightbox(globalIndex)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="w-full flex justify-center py-8">
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-3 border-[#bca374]/30 border-t-[#bca374] rounded-full animate-spin" />
              <span className="text-xs text-gray-400 font-medium">Đang tải thêm...</span>
            </div>
          )}
          {!hasMore && photos.length > 0 && (
            <div className="text-center">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 px-2">✦ Đã hiển thị tất cả {photos.length} kỷ niệm ✦</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </div>
          )}
        </div>
      </main>

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
    </div>
  );
}
