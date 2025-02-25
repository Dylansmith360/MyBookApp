import React from "react";
import TruncatedText from "./TruncatedText";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

export interface Review {
  id: number;
  bookId: string;
  reviewer: string;
  comment: string;
  rating: number;
}

interface ReviewModalProps {
  reviews: Review[];
  onClose: () => void;
  onSubmitReview: (reviewer: string, comment: string, rating: number) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ reviews, onClose, onSubmitReview }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div 
      className={`
        fixed inset-0 z-50 
        flex items-center justify-center 
        transition-all duration-200
        ${mounted ? 'bg-black/50 backdrop-blur-[2px]' : 'bg-black/0'}
      `} 
      role="dialog" 
      aria-modal="true" 
      aria-label="User Reviews"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`
          bg-gray-900 rounded-lg p-6 
          max-w-3xl w-full h-[80vh] 
          flex flex-col relative
          transform transition-all duration-200
          ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-100">Reviews</h2>
          <button onClick={onClose} aria-label="Close reviews modal" className="text-gray-200 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Existing reviews section */}
          <section className="flex flex-col min-h-0">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Existing Reviews</h3>
            <div className="overflow-y-auto flex-1 pr-2 space-y-3">
              {reviews.length ? (
                reviews.map((review) => (
                  <div key={review.id} className="p-3 border border-gray-600 rounded bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-100">{review.reviewer}</span>
                      <div className="flex items-center space-x-1">
                        <div className="transform scale-75" aria-hidden="true">
                          <StarRating rating={review.rating} interactive={false} />
                        </div>
                        <span className="text-gray-300 text-xs">{review.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      <TruncatedText text={review.comment} limit={150} />
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No reviews yet.</p>
              )}
            </div>
          </section>

          {/* Submit review section */}
          <section className="flex flex-col min-h-0">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Submit a Review</h3>
            <div className="overflow-y-auto flex-1 pr-2">
              <div className="p-3 border border-gray-600 rounded bg-gray-800">
                <ReviewForm onSubmit={onSubmitReview} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
