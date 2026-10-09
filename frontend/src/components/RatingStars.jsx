import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, reviews, size = 14, small = false }) {
  const rounded = Math.round(rating);
  return (
    <div className={`rating ${small ? 'rating-small' : ''}`} aria-label={`${rating} out of 5 stars`}>
      <span className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rounded ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        ))}
      </span>
      <strong>{Number(rating).toFixed(1)}</strong>
      {reviews !== undefined && reviews !== null && (
        <span className="review-count">({reviews.toLocaleString()})</span>
      )}
    </div>
  );
}
