import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  timeline_date: string; // YYYY-MM-DD
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

export interface PhotoComment {
  id: string;
  photo_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const PAGE_SIZE = 50;

export function useGallery(userIdentifier: string) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchPhotos = useCallback(async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return;
    setLoading(true);

    try {
      const currentPage = isInitial ? 0 : page;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // We need to fetch photos, their likes count, and whether the current user liked them.
      // Since Supabase doesn't support complex left joins with counts easily in a single query from JS without RPC,
      // we'll fetch photos first, then fetch likes for these photos.
      // Actually, Supabase supports fetching relations if foreign keys are set up.
      // But a simpler approach without RPC is to just fetch the photos, then fetch counts via another query or a view.
      // Let's assume we have a view or we do it via multiple queries if needed.
      // For simplicity, we'll fetch photos and just count likes by fetching them.
      
      const { data: photosData, error: photosError } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('timeline_date', { ascending: false })
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(from, to);

      if (photosError) throw photosError;

      if (!photosData || photosData.length === 0) {
        setHasMore(false);
        if (isInitial) setPhotos([]);
        return;
      }

      if (photosData.length < PAGE_SIZE) {
        setHasMore(false);
      }

      const photoIds = photosData.map(p => p.id);

      // Fetch likes count and user liked status
      const { data: likesData, error: likesError } = await supabase
        .from('photo_likes')
        .select('photo_id, user_identifier')
        .in('photo_id', photoIds);

      // Fetch comments count
      const { data: commentsData, error: commentsError } = await supabase
        .from('photo_comments')
        .select('photo_id')
        .in('photo_id', photoIds);

      const processedPhotos: GalleryPhoto[] = photosData.map(photo => {
        const photoLikes = likesData ? likesData.filter(l => l.photo_id === photo.id) : [];
        const photoComments = commentsData ? commentsData.filter(c => c.photo_id === photo.id) : [];
        
        return {
          ...photo,
          likes_count: photoLikes.length,
          user_has_liked: photoLikes.some(l => l.user_identifier === userIdentifier),
          comments_count: photoComments.length,
        };
      });

      setPhotos(prev => isInitial ? processedPhotos : [...prev, ...processedPhotos]);
      setPage(currentPage + 1);

    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, userIdentifier]);

  // Initial fetch
  useEffect(() => {
    fetchPhotos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLike = async (photoId: string) => {
    // Optimistic update
    setPhotos(prev => prev.map(p => {
      if (p.id === photoId) {
        const isLiked = p.user_has_liked;
        return {
          ...p,
          user_has_liked: !isLiked,
          likes_count: isLiked ? (p.likes_count || 0) - 1 : (p.likes_count || 0) + 1
        };
      }
      return p;
    }));

    try {
      const { data: existingLike } = await supabase
        .from('photo_likes')
        .select('*')
        .eq('photo_id', photoId)
        .eq('user_identifier', userIdentifier)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('photo_likes')
          .delete()
          .eq('photo_id', photoId)
          .eq('user_identifier', userIdentifier);
      } else {
        // Like
        await supabase
          .from('photo_likes')
          .insert([{ photo_id: photoId, user_identifier: userIdentifier }]);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Ideally revert optimistic update here, but omitted for simplicity
    }
  };

  const addComment = async (photoId: string, authorName: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('photo_comments')
        .insert([{ photo_id: photoId, author_name: authorName, content: content }])
        .select()
        .single();

      if (error) throw error;

      // Update comment count
      setPhotos(prev => prev.map(p => {
        if (p.id === photoId) {
          return { ...p, comments_count: (p.comments_count || 0) + 1 };
        }
        return p;
      }));

      return data as PhotoComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const getComments = async (photoId: string) => {
    try {
      const { data, error } = await supabase
        .from('photo_comments')
        .select('*')
        .eq('photo_id', photoId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data as PhotoComment[];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  };

  return {
    photos,
    loading,
    hasMore,
    fetchPhotos,
    toggleLike,
    addComment,
    getComments,
    setPhotos // Expose for admin deletions
  };
}
