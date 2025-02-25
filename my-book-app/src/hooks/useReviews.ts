import { useState, useEffect } from "react";

interface Review {
  id: number;
  bookId: string;
  reviewer: string;
  comment: string;
  rating: number;
}

export function useReviews(bookId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!bookId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5075/api/reviews/${bookId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews.");

      const reviewData = await response.json();
      setReviews(reviewData);
    } catch (err) {
      setError("Error loading reviews.");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (reviewer: string, comment: string, rating: number) => {
    if (!bookId) return;

    try {
      const response = await fetch("http://localhost:5075/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, reviewer, comment, rating }),
      });

      if (response.ok) {
        const addedReview = await response.json();
        setReviews((prev) => [...prev, addedReview]); // Update state
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  return { reviews, loading, error, fetchReviews, submitReview };
}