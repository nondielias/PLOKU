import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, User, RefreshCw } from 'lucide-react';
import { ProductReview, UserAccount } from '../types';
import {
  fetchProductReviewsFromFirestore,
  addProductReviewToFirestore,
} from '../services/firebase-config';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  currentUser: UserAccount | null;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
  currentUser,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>(currentUser?.name || '');
  const [comment, setComment] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync user name if user logs in
  useEffect(() => {
    if (currentUser?.name && !userName) {
      setUserName(currentUser.name);
    }
  }, [currentUser]);

  // Load reviews on mount / productId change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchProductReviewsFromFirestore(productId).then((data) => {
      if (isMounted) {
        setReviews(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Please share a short comment about your experience with this gadget.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const newRev = await addProductReviewToFirestore(productId, {
        userId: currentUser?.id,
        userName: userName.trim() || (currentUser?.name || 'Verified Tech Enthusiast'),
        rating,
        comment: comment.trim(),
      });

      setReviews((prev) => [newRev, ...prev]);
      setComment('');
      setSuccessMessage('Your rating & review have been posted successfully!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Failed to post review:', err);
      setErrorMessage('Unable to post review right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 pt-5 border-t border-rose-100 dark:border-slate-800/90 text-slate-900 dark:text-slate-100">
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-300 font-heading flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
            <span>Customer Ratings & Reviews</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified impressions for <span className="font-medium text-slate-700 dark:text-slate-300">{productName}</span>
          </p>
        </div>

        {/* Average Rating Score */}
        <div className="flex items-center gap-2.5 bg-rose-50/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-rose-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(Number(averageRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="font-mono-numbers text-sm font-bold text-slate-950 dark:text-white">
            {averageRating}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Review Submission Form */}
      <form
        onSubmit={handleSubmitReview}
        className="p-4 sm:p-5 rounded-xl bg-rose-50/40 dark:bg-slate-900/70 border border-rose-200/80 dark:border-slate-800 space-y-4 shadow-xs dark:shadow-inner"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-900 dark:text-white">Leave your review</span>

          {/* Interactive Star Rating Picker */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      active
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                        : 'text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
            <span className="font-mono text-xs text-rose-600 dark:text-cyan-300 font-bold ml-1.5">
              {rating}/5
            </span>
          </div>
        </div>

        {/* User Name input */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Reviewer Name
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Alex Jensen"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Comment textarea */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Your Comment & Experience
          </label>
          <textarea
            rows={2}
            required
            placeholder="Share insights on sound fidelity, build quality, ergonomics, battery endurance, or workstation fit..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500 leading-relaxed"
          />
        </div>

        {/* Feedback Notices */}
        {errorMessage && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errorMessage}</p>
        )}
        {successMessage && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-rose-600/20 dark:shadow-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Post Review</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Reviews List Display */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Customer Feedback ({reviews.length})
        </h4>

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-rose-600 dark:text-cyan-400" />
            <span>Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-xs">
            No reviews posted for this gadget yet. Be the first to share your rating above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-xs">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 space-y-2 hover:bg-rose-50/20 dark:hover:bg-slate-900/80 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-950 dark:text-white text-xs font-heading">
                      {rev.userName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-800/60 font-mono">
                      Verified
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>

                {/* Stars display */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 ml-1">
                    {rev.rating}.0
                  </span>
                </div>

                {/* Comment body */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
