import { useState, useEffect } from 'react';
import api from '../api/axio';

export default function useLikeState(posts) {
  const [likeStates, setLikeStates] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      const newStates = {};
      await Promise.all(posts.map(async (post, idx) => {
        const id = post.id || idx;
        let isLiked = false;
        try {
          const res = await api.get('/api/like', { params: { articleId: post.id } });
          // 응답 구조: { code: 1, message: null, data: { liked: true } }
          isLiked = !!(res.data.data && res.data.data.liked);
        } catch {}
        newStates[id] = {
          isLiked,
          likeCount: post.like || 0,
          anim: false,
        };
      }));
      if (isMounted) setLikeStates(newStates);
    };
    if (posts.length > 0) fetchAll();
    return () => { isMounted = false; };
  }, [posts]);

  const toggleLike = async (id, articleId) => {
    setLikeStates(prev => {
      const prevState = prev[id];
      if (!prevState) return prev;
      const isLiked = !prevState.isLiked;
      const likeCount = prevState.likeCount + (isLiked ? 1 : -1);
      return {
        ...prev,
        [id]: { ...prevState, isLiked, likeCount, anim: true }
      };
    });

    try {
      if (!likeStates[id]?.isLiked) {
        await api.post('/api/like', null, { params: { articleId } });
      } else {
        await api.delete('/api/dislike', { params: { articleId } });
      }
    } catch (e) {
      if (e.response?.status === 401) window.location.href = '/join';
    }

    setTimeout(() => {
      setLikeStates(prev => {
        if (!prev[id]) return prev;
        return { ...prev, [id]: { ...prev[id], anim: false } };
      });
    }, 350);
  };

  return [likeStates, toggleLike];
}
