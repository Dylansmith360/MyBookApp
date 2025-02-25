/* 
   ReviewForm Component:
   - Lets users submit their review alongside a star rating.
   - Fields include Name, review comment (with character limit), and interactive star rating.
   - Client-side limits do not replace secure server-side validation.
*/

import { useState, useEffect } from "react";
import StarRating from "./StarRating";

// Props for the ReviewForm component
interface ReviewFormProps {
  onSubmit: (reviewer: string, comment: string, rating: number) => void;
}

// Validation errors interface
interface ValidationErrors {
  reviewer?: string;
  comment?: string;
  rating?: string;
}

// Component for the review form
const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [reviewer, setReviewer] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  // Validate the form fields
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!reviewer.trim()) {
      newErrors.reviewer = "Name is required";
    } else if (reviewer.length < 2) {
      newErrors.reviewer = "Name must be at least 2 characters";
    } else if (reviewer.length > 30) {
      newErrors.reviewer = "Name must be less than 30 characters";
    }

    if (!comment.trim()) {
      newErrors.comment = "Review comment is required";
    } else if (comment.length < 10) {
      newErrors.comment = "Review must be at least 10 characters";
    } else if (comment.length > 500) {
      newErrors.comment = "Review must be less than 500 characters";
    }

    if (rating < 1 || rating > 10) {
      newErrors.rating = "Rating must be between 1 and 10";
    }

    return newErrors;
  };

  useEffect(() => {
    if (isDirty) {
      setErrors(validateForm());
    }
  }, [reviewer, comment, rating, isDirty]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDirty(true);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(reviewer.trim(), comment.trim(), rating);
      // Reset form
      setReviewer("");
      setComment("");
      setRating(5);
      setIsDirty(false);
    } else {
      setErrors(validationErrors);
    }
  };

  const isValid = Object.keys(validateForm()).length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="reviewer-name" className="block text-gray-200 mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="reviewer-name"
          type="text"
          value={reviewer}
          onChange={(e) => {
            setReviewer(e.target.value);
            setIsDirty(true);
          }}
          className={`w-full p-2 bg-gray-800 border rounded ${
            errors.reviewer ? 'border-red-500' : 'border-gray-600'
          }`}
          aria-invalid={!!errors.reviewer}
        />
        {errors.reviewer && (
          <p className="text-red-500 text-sm mt-1" role="alert">{errors.reviewer}</p>
        )}
      </div>

      <div>
        <label htmlFor="review-comment" className="block text-gray-200 mb-1">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setIsDirty(true);
          }}
          className={`w-full p-2 bg-gray-800 border rounded ${
            errors.comment ? 'border-red-500' : 'border-gray-600'
          }`}
          rows={4}
          aria-invalid={!!errors.comment}
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1" role="alert">{errors.comment}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          {comment.length}/500 characters
        </p>
      </div>

      {/* New flex container for rating and submit button */}
      <div className="flex items-center justify-between space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Rating <span className="text-red-500">*</span>
          </label>
          <StarRating rating={rating} onChange={(r) => {
            setRating(r);
            setIsDirty(true);
          }} interactive />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1" role="alert">{errors.rating}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!isValid && isDirty}
          className={`px-4 py-2 rounded text-white ${
            !isValid && isDirty
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;