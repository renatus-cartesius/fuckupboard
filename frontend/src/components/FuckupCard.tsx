import React, { useState, useEffect } from 'react';
import { Fuckup } from '../types/Fuckup';
import { likeService } from '../services/likeService';
import './FuckupCard.css';

interface FuckupCardProps {
  fuckup: Fuckup;
  onLike: (id: string) => void;
  onUnlike: (id: string) => void;
}

const FuckupCard: React.FC<FuckupCardProps> = ({ fuckup, onLike, onUnlike }) => {
  const isLiked = likeService.isLiked(fuckup.id);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  // Track likes changes to show animation
  useEffect(() => {
    const currentLikes = fuckup.likes;
    const timer = setTimeout(() => {
      setShowLikeAnimation(false);
    }, 600); // Match animation duration

    return () => clearTimeout(timer);
  }, [fuckup.likes]);

  const handleToggleLike = () => {
    if (isLiked) {
      onUnlike(fuckup.id);
    } else {
      onLike(fuckup.id);
      setShowLikeAnimation(true);
    }
  };

  return (
    <div className={`fuckup-card ${showLikeAnimation ? 'liked-recently' : ''}`}>
      <div className="fuckup-content">
        <p className="fuckup-description">{fuckup.desc}</p>
        <div className="fuckup-footer">
          <span className="fuckup-user">— {fuckup.user}</span>
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleToggleLike}
            aria-label={isLiked ? "Unlike this fuckup" : "Like this fuckup"}
          >
            {isLiked ? '❤️' : '🤍'} {fuckup.likes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuckupCard; 