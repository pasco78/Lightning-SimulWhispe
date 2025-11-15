'use client';

import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

interface FeedbackFormProps {
  onClose: () => void;
  onSubmit: (feedback: { rating: number; comment: string }) => void;
}

export default function FeedbackForm({ onClose, onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    onSubmit({ rating, comment });
    setSubmitted(true);

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="feedback-form-overlay">
      <div className="feedback-form">
        <div className="feedback-header">
          <h3>Translation Quality Feedback</h3>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="feedback-success">
            <p>Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>How would you rate the translation quality?</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`star ${rating >= star ? 'active' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Additional comments (optional):</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about your experience..."
                rows={4}
                maxLength={500}
              />
              <span className="char-count">{comment.length}/500</span>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="button secondary">
                Cancel
              </button>
              <button type="submit" className="button primary">
                <Send size={16} />
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
