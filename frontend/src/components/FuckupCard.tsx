import React from 'react';
import { Fuckup } from '../types/Fuckup';
import { likeService } from '../services/likeService';
import './FuckupCard.css';

interface FuckupCardProps {
  fuckup: Fuckup;
  onLike: (id: string) => void;
}

const FuckupCard: React.FC<FuckupCardProps> = ({ fuckup, onLike }) => {
  const isLiked = likeService.isLiked(fuckup.id);

  const handleLike = () => {
    if (!isLiked) {
      onLike(fuckup.id);
    }
  };

  return (
    <div className="fuckup-card">
      <div className="fuckup-content">
        <p className="fuckup-description">{fuckup.desc}</p>
        <div className="fuckup-footer">
          <span className="fuckup-user">— {fuckup.user}</span>
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={isLiked}
            aria-label={isLiked ? "Already liked this fuckup" : "Like this fuckup"}
          >
            {isLiked ? '❤️' : '🤍'} {fuckup.likes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuckupCard; 