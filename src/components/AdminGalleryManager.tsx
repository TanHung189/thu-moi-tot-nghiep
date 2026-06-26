import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useGallery, type GalleryPhoto } from '../hooks/useGallery';
import { format, parseISO } from 'date-fns';
import { Upload, Trash2, X, CheckCircle, Edit2, Film, ImageIcon, CheckSquare, Square, MousePointer2, ArrowLeft } from 'lucide-react';
import EXIF from 'exif-js';
import imageCompression from 'browser-image-compression';

const extractDateFromImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    try {
      EXIF.getData(file as any, function(this: any) {
        const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
        if (dateTimeOriginal) {
          const parts = dateTimeOriginal.split(' ')[0].split(':');
          if (parts.length === 3) {
            resolve(`${parts[0]}-${parts[1]}-${parts[2]}`);
            return;
          }
        }
        if (file.lastModified) {
           const d = new Date(file.lastModified);
           resolve(d.toISOString().split('T')[0]);
           return;
        }
        resolve(new Date().toISOString().split('T')[0]);
      });
    } catch (e) {
      console.error("EXIF parsing error", e);
      if (file.lastModified) {
        const d = new Date(file.lastModified);
        resolve(d.toISOString().split('T')[0]);
      } else {
        resolve(new Date().toISOString().split('T')[0]);
      }
    }
  });
};

const isVideoFile = (file: File) => file.type.startsWith('video/');
const isVideoUrl = (url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext || '');
};

export default function AdminGalleryManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const { photos, fetchPhotos, setPhotos } = useGallery('admin');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ total: number, current: number, fileName?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Edit Modal
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');

  // ── Multi-select states ──────────────────────────────────────
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || '123456';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Mật khẩu không đúng!');
    }
  };

  // ── Toggle select mode ───────────────────────────────────────
  const toggleSelectMode = () => {
    setSelectMode(prev => !prev);
    setSelectedIds(new Set());
  };

  // ── Toggle single item ───────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Select / deselect all ────────────────────────────────────
  const selectAll = () => setSelectedIds(new Set(photos.map(p => p.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const isAllSelected = photos.length > 0 && selectedIds.size === photos.length;

  // ── Bulk delete ──────────────────────────────────────────────
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ${selectedIds.size} file đã chọn không? Hành động này không thể hoàn tác!`
    );
    if (!confirmed) return;

    setIsBulkDeleting(true);
    const toDelete = photos.filter(p => selectedIds.has(p.id));

    try {
      // Remove from storage
      const fileNames = toDelete
        .map(p => p.image_url.split('/').pop()?.split('?')[0])
        .filter(Boolean) as string[];
      if (fileNames.length > 0) {
        await supabase.storage.from('gallery').remove(fileNames);
      }

      // Remove from DB
      const ids = toDelete.map(p => p.id);
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .in('id', ids);
      if (error) throw error;

      setPhotos(prev => prev.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      setSelectMode(false);
    } catch (err) {
      console.error('Lỗi khi xóa hàng loạt', err);
      alert('Có lỗi khi xóa. Vui lòng thử lại.');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    setIsUploading(true);
    setUploadProgress({ total: files.length, current: 0 });

    const newPhotos: GalleryPhoto[] = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = isVideoFile(file);

      setUploadProgress({ total: files.length, current: i, fileName: file.name });

      try {
        let fileToUpload: File | Blob = file;
        let photoDate = new Date().toISOString().split('T')[0];

        if (isVideo) {
          if (file.lastModified) {
            photoDate = new Date(file.lastModified).toISOString().split('T')[0];
          }
          fileToUpload = file;
        } else {
          photoDate = await extractDateFromImage(file);

          try {
            const compressionPromise = imageCompression(file, {
              maxSizeMB: 0.4,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            });
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('compression_timeout')), 30000)
            );
            fileToUpload = await Promise.race([compressionPromise, timeoutPromise]);
          } catch (compressErr: any) {
            console.warn('Nén ảnh thất bại, dùng file gốc:', file.name, compressErr?.message);
            fileToUpload = file;
          }
        }

        const rawExt = file.name.split('.').pop() || '';
        const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || (isVideo ? 'mp4' : 'jpg');
        const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(safeFileName, fileToUpload, {
            contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(safeFileName);

        const { data: dbData, error: dbError } = await supabase
          .from('gallery_photos')
          .insert([{ 
            image_url: publicUrl, 
            caption: '', 
            timeline_date: photoDate,
            media_type: isVideo ? 'video' : 'image',
          }])
          .select()
          .single();

        if (dbError) throw dbError;
        
        if (dbData) {
          newPhotos.push(dbData as GalleryPhoto);
          successCount++;
        }

      } catch (err) {
        console.error('Lỗi khi upload file', file.name, err);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (newPhotos.length > 0) {
      setPhotos(prev => [...newPhotos, ...prev]);
    }
    alert(`Đã upload thành công ${successCount}/${files.length} file!`);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa file này không?')) return;

    try {
      const fileName = imageUrl.split('/').pop()?.split('?')[0];
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName]);
      }
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
      if (error) throw error;
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa', err);
      alert('Không thể xóa file. Vui lòng thử lại.');
    }
  };

  const openEditModal = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setEditCaption(photo.caption || '');
    setEditDate(photo.timeline_date || new Date().toISOString().split('T')[0]);
  };

  const handleSaveEdit = async () => {
    if (!editingPhoto) return;
    try {
      const { error } = await supabase
        .from('gallery_photos')
        .update({ caption: editCaption, timeline_date: editDate })
        .eq('id', editingPhoto.id);
      
      if (error) throw error;

      setPhotos(prev => prev.map(p => 
        p.id === editingPhoto.id ? { ...p, caption: editCaption, timeline_date: editDate } : p
      ));
      setEditingPhoto(null);
    } catch (err) {
      console.error('Lỗi lưu thông tin', err);
      alert('Lỗi lưu thông tin!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif text-[#bca374] font-bold">Quản Trị Bộ Sưu Tập</h2>
            <p className="text-gray-500 text-sm mt-2">Vui lòng nhập mật khẩu để tiếp tục</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Mật khẩu Admin"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-[#bca374] focus:ring-1 focus:ring-[#bca374]"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-[#bca374] text-white py-3 rounded-lg font-medium hover:bg-gold-600 transition-colors">
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  const imageCount = photos.filter(p => (p.media_type || 'image') === 'image').length;
  const videoCount = photos.filter(p => p.media_type === 'video').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Nút quay lại trang chủ */}
            <button
              onClick={() => { window.location.hash = ''; }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors text-sm font-medium"
              title="Quay lại trang thư mời"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Quản Lý Bộ Sưu Tập Kỷ Niệm
              </h1>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />{imageCount} ảnh</span>
                <span className="flex items-center gap-1"><Film className="w-3 h-3" />{videoCount} video</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Nút bật/tắt chế độ chọn nhiều */}
            <button
              onClick={toggleSelectMode}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all border ${
                selectMode
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              title={selectMode ? 'Tắt chế độ chọn nhiều' : 'Bật chế độ chọn nhiều'}
            >
              <MousePointer2 className="w-4 h-4" />
              {selectMode ? 'Đang chọn' : 'Chọn nhiều'}
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || selectMode}
              className="bg-[#1a1a1a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              Upload Ảnh / Video
            </button>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </header>

      {/* ── Multi-select Toolbar ──────────────────────────────── */}
      {selectMode && (
        <div className="sticky top-[73px] z-30 bg-blue-600 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
            {/* Checkbox chọn tất cả */}
            <button
              onClick={isAllSelected ? deselectAll : selectAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium"
            >
              {isAllSelected
                ? <CheckSquare className="w-4 h-4" />
                : <Square className="w-4 h-4" />
              }
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>

            {/* Đếm đã chọn */}
            <span className="text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg">
              {selectedIds.size > 0
                ? `Đã chọn ${selectedIds.size} file`
                : 'Chưa chọn file nào'}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Nút xóa hàng loạt */}
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.size === 0 || isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
            >
              {isBulkDeleting
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Trash2 className="w-4 h-4" />
              }
              {isBulkDeleting ? 'Đang xóa...' : `Xóa ${selectedIds.size > 0 ? `(${selectedIds.size})` : ''}`}
            </button>

            {/* Đóng chế độ chọn */}
            <button
              onClick={toggleSelectMode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && uploadProgress && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="flex-1">
              <p className="font-medium">
                Đang tải lên {uploadProgress.current + 1} / {uploadProgress.total} file...
              </p>
              {uploadProgress.fileName && (
                <p className="text-xs mt-0.5 text-blue-600 truncate">{uploadProgress.fileName}</p>
              )}
              <div className="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((uploadProgress.current) / uploadProgress.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid danh sách ảnh và video */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => {
            const isVideo = photo.media_type === 'video' || isVideoUrl(photo.image_url);
            const isSelected = selectedIds.has(photo.id);

            return (
              <div
                key={photo.id}
                onClick={() => selectMode && toggleSelect(photo.id)}
                className={`bg-white rounded-lg border overflow-hidden group shadow-sm hover:shadow-md transition-all relative
                  ${selectMode ? 'cursor-pointer' : ''}
                  ${isSelected
                    ? 'border-blue-500 ring-2 ring-blue-400 shadow-blue-100'
                    : 'border-gray-200'}
                `}
              >
                <div className="aspect-square bg-gray-100 relative">
                  {isVideo ? (
                    <>
                      <video
                        src={photo.image_url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onMouseEnter={e => !selectMode && (e.currentTarget as HTMLVideoElement).play()}
                        onMouseLeave={e => {
                          const v = e.currentTarget as HTMLVideoElement;
                          v.pause();
                          v.currentTime = 0;
                        }}
                      />
                      {/* Badge Video */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Film className="w-3 h-3" /> Video
                      </div>
                    </>
                  ) : (
                    <img src={photo.image_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                  )}

                  {/* ── Checkbox overlay (select mode) ── */}
                  {selectMode && (
                    <div className={`absolute inset-0 transition-all ${isSelected ? 'bg-blue-500/20' : 'bg-transparent group-hover:bg-black/10'}`}>
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white/80 border-gray-400 group-hover:border-blue-400'}`}
                      >
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overlay actions (normal mode) */}
                  {!selectMode && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => openEditModal(photo)}
                        className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 transition-transform"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(photo.id, photo.image_url)}
                        className="bg-white p-2 rounded-full text-red-600 hover:scale-110 transition-transform"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    {photo.timeline_date ? format(parseISO(photo.timeline_date), 'dd/MM/yyyy') : 'Trống'}
                  </p>
                  <p className="text-sm text-gray-800 line-clamp-2" title={photo.caption || ''}>
                    {photo.caption || <span className="text-gray-400 italic">Không có caption</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Load more button */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => fetchPhotos()}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Tải thêm ảnh / video cũ hơn
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Chỉnh sửa thông tin</h3>
              <button onClick={() => setEditingPhoto(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                {editingPhoto.media_type === 'video' || isVideoUrl(editingPhoto.image_url) ? (
                  <video src={editingPhoto.image_url} className="h-32 object-contain rounded border border-gray-200" controls muted />
                ) : (
                  <img src={editingPhoto.image_url} className="h-32 object-contain rounded border border-gray-200" alt="" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày diễn ra (Timeline)</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#bca374]"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption / Ghi chú</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#bca374] min-h-[100px] resize-y"
                  placeholder="Nhập ghi chú..."
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-[#bca374] text-white font-medium hover:bg-gold-600 rounded-lg transition-colors"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
