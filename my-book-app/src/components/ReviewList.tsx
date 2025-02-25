import React from "react";
import TruncatedText from "./TruncatedText";
import StarRating from "./StarRating";

// Review interface
interface Review {
  id: number;
  bookId: string;
  reviewer: string;
  comment: string;
  rating: number;
}

// Props for the ReviewList component
interface ReviewListProps {
  reviews: Review[];
}

// Component to display a list of reviews
const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-center text-gray-400">No reviews available.</p>;
  }

  return (
    <div className="mt-6 bg-gray-800 border-t border-gray-600 p-2" aria-label="User Reviews">
      <h2 className="text-sm font-bold text-gray-100 mb-2">User Reviews</h2>
      <ul className="space-y-1" role="list">
        {reviews.map((review) => (
          <li key={review.id} className="p-1 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-100">{review.reviewer}</span>
              <div className="flex items-center space-x-1">
                <div className="transform scale-75" aria-hidden="true">
                  <StarRating rating={review.rating} interactive={false} />
                </div>
                <span className="text-gray-300 text-xs">{review.rating}/10</span>
              </div>
            </div>
            <p className="text-gray-300 text-xs mt-1">
              <TruncatedText text={review.comment} limit={60} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;