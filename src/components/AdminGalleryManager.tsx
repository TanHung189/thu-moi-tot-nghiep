import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useGallery, type GalleryPhoto } from '../hooks/useGallery';
import { format, parseISO } from 'date-fns';
import { Upload, Trash2, X, CheckCircle, AlertCircle, Edit2 } from 'lucide-react';
import EXIF from 'exif-js';

const extractDateFromImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    try {
      EXIF.getData(file as any, function(this: any) {
        const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
        if (dateTimeOriginal) {
          // EXIF dates look like "YYYY:MM:DD HH:MM:SS"
          const parts = dateTimeOriginal.split(' ')[0].split(':');
          if (parts.length === 3) {
            resolve(`${parts[0]}-${parts[1]}-${parts[2]}`);
            return;
          }
        }
        
        // Fallback 1: Date from file last modified (if available)
        if (file.lastModified) {
           const d = new Date(file.lastModified);
           resolve(d.toISOString().split('T')[0]);
           return;
        }

        // Fallback 2: Today
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

export default function AdminGalleryManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const { photos, fetchPhotos, setPhotos } = useGallery('admin'); // Re-use hook for fetching
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ total: number, current: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Edit Modal
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    setIsUploading(true);
    setUploadProgress({ total: files.length, current: 0 });

    const newPhotos: GalleryPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // 1. Upload to Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        // 3. Extract original date from EXIF or file metadata
        const photoDate = await extractDateFromImage(file);

        // 4. Save to Database
        const { data: dbData, error: dbError } = await supabase
          .from('gallery_photos')
          .insert([{ 
            image_url: publicUrl, 
            caption: '', 
            timeline_date: photoDate 
          }])
          .select()
          .single();

        if (dbError) throw dbError;
        
        if (dbData) {
          newPhotos.push(dbData as GalleryPhoto);
        }

      } catch (err) {
        console.error('Lỗi khi upload file', file.name, err);
      } finally {
        setUploadProgress(prev => prev ? { ...prev, current: prev.current + 1 } : null);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Update state to show new photos immediately at the top
    if (newPhotos.length > 0) {
      setPhotos(prev => [...newPhotos, ...prev]);
    }
    alert(`Đã upload thành công ${newPhotos.length}/${files.length} ảnh!`);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này không?')) return;

    try {
      // 1. Delete from Storage (Optional, but good practice)
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName]);
      }

      // 2. Delete from Database
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
      if (error) throw error;

      // 3. Update UI
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa', err);
      alert('Không thể xóa ảnh. Vui lòng thử lại.');
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle className="text-green-500 w-5 h-5" />
            Quản Lý Bộ Sưu Tập Kỷ Niệm
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">Tổng: {photos.length} ảnh</span>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-[#1a1a1a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-70"
            >
              <Upload className="w-4 h-4" />
              Upload Ảnh
            </button>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </header>

      {/* Upload Progress */}
      {isUploading && uploadProgress && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-medium">Đang tải lên {uploadProgress.current} / {uploadProgress.total} ảnh...</p>
          </div>
        </div>
      )}

      {/* Grid danh sách ảnh */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group shadow-sm hover:shadow-md transition-shadow relative">
              <div className="aspect-square bg-gray-100 relative">
                <img src={photo.image_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                
                {/* Overlay actions */}
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
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
          ))}
        </div>
        
        {/* Load more button */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => fetchPhotos()}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Tải thêm ảnh cũ hơn
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Chỉnh sửa thông tin ảnh</h3>
              <button onClick={() => setEditingPhoto(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <img src={editingPhoto.image_url} className="h-32 object-contain rounded border border-gray-200" alt="" />
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
                  placeholder="Nhập ghi chú cho ảnh..."
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
