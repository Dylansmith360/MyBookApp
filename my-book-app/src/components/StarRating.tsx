/* 
   StarRating Component:
   - Displays a star rating with interactive or static stars.
*/

import { useState } from "react";

// Props for the StarRating component
interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
}

// Component to display star rating
const StarRating = ({ rating, onChange, interactive = true }: StarRatingProps) => {
  // Local state for hover and selection
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [tempRating, setTempRating] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      setSelectedRating(index + 1);
      setTempRating(null);
      onChange(index + 1);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (interactive) {
      setHovered(star);
      setTempRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHovered(null);
      if (!selectedRating) setTempRating(tempRating);
    }
  };

  return (
    <div 
      className="flex space-x-0.5" 
      role="radiogroup" 
      aria-label="Rating"
      aria-required="true"
    >
      {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          className={`cursor-pointer text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-0.5 ${
            (hovered ?? selectedRating ?? tempRating ?? rating) >= star ? "text-yellow-400" : "text-gray-600"
          }`}
          onMouseEnter={() => interactive && handleMouseEnter(star)}
          onMouseLeave={() => interactive && handleMouseLeave()}
          onClick={() => interactive && handleClick(star - 1)}
          onKeyDown={(e) => e.key === 'Enter' && interactive && handleClick(star - 1)}
          role="radio"
          aria-checked={(selectedRating ?? rating) === star}
          aria-label={`Rate ${star} out of 10`}
          tabIndex={interactive ? 0 : -1}
        >
          <span aria-hidden="true">★</span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;