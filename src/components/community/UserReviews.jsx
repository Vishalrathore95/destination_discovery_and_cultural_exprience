import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { getReviews, addReviewToDb } from '../../services/firestoreService';
import { moderateContent } from '../../services/geminiService';
import { MessageSquare, Star, Send, ShieldAlert, Sparkles } from 'lucide-react';

export const UserReviews = () => {
  const { destinationGuide } = useTrip();
  const user = null; // No auth required - guest mode
  
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [moderationFeedback, setModerationFeedback] = useState(null);

  const destination = destinationGuide?.queryDestination || '';

  // Load reviews for destination
  useEffect(() => {
    if (destination) {
      setLoadingReviews(true);
      getReviews(destination)
        .then(setReviews)
        .catch(err => console.error(err))
        .finally(() => setLoadingReviews(false));
    }
  }, [destination]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !destination) return;

    setSubmitting(true);
    setModerationFeedback(null);

    try {
      // Step 1: Run AI Sensitivity Moderation
      const modResult = await moderateContent(newComment);

      if (modResult && modResult.isSafe === false) {
        setModerationFeedback({
          type: 'danger',
          text: modResult.summary || 'Our AI found that this review may contain insensitive language or cultural generalizations. Please revise to focus on respectful sharing.'
        });
        setSubmitting(false);
        return;
      }

      // Step 2: Add review to DB
      const reviewPayload = {
        destination,
        comment: newComment,
        rating,
        userId: user ? user.uid : 'guest',
        userName: user ? (user.displayName || user.email.split('@')[0]) : 'Anonymous Explorer',
        aiSummary: modResult ? modResult.summary : 'Verified local review'
      };

      const newReview = await addReviewToDb(reviewPayload);
      setReviews(prev => [newReview, ...prev]);
      setNewComment('');
      setRating(5);
      setModerationFeedback({
        type: 'success',
        text: 'Review approved and published!'
      });
    } catch (err) {
      console.error(err);
      setModerationFeedback({
        type: 'danger',
        text: 'Error processing review.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!destinationGuide) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <MessageSquare className="text-indigo-650 dark:text-indigo-400" />
          <span>Explorer Reviews & Exchange</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Read reviews from other explorers. All submissions are moderated by AI to maintain respect and accuracy.
        </p>

        {/* Input Form */}
        <form onSubmit={handleReviewSubmit} className="space-y-4 mb-8 bg-slate-50 dark:bg-slate-950/20 p-4 border rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Share your experiences</span>
            
            {/* Star selector */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="focus:outline-none text-amber-500 hover:scale-110 transition-transform"
                >
                  <Star size={16} fill={rating >= n ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Describe what you learned, entry/guide tips, or restaurant suggestions..."
              className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-850 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {moderationFeedback && (
            <div
              className={`p-2.5 rounded text-xs flex items-start space-x-2 ${
                moderationFeedback.type === 'success'
                  ? 'bg-green-55/20 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900'
                  : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900'
              }`}
              role="alert"
            >
              {moderationFeedback.type === 'danger' && <ShieldAlert size={16} className="shrink-0 mt-0.5" />}
              <span>{moderationFeedback.text}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  <span>AI moderating comments...</span>
                </>
              ) : (
                <>
                  <Send size={12} />
                  <span>Post Review</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Reviews List */}
        {loadingReviews ? (
          <div className="text-center py-6 text-slate-500">Loading reviews...</div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 border rounded-lg bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.userName}</span>
                    <span className="text-[10px] text-slate-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} fill={rev.rating >= star ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                
                <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-sans">{rev.comment}</p>
                
                {rev.aiSummary && (
                  <div className="mt-3 flex items-start space-x-1.5 p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded border border-indigo-100 dark:border-indigo-900/60 text-[10px]">
                    <Sparkles size={12} className="text-indigo-650 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-slate-550 dark:text-slate-400 italic leading-relaxed">
                      AI Moderation Summary: {rev.aiSummary}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-xs text-slate-450 border border-dashed rounded-lg">
            No reviews posted for this destination yet. Be the first to share!
          </p>
        )}
      </div>
    </div>
  );
};

export default UserReviews;
