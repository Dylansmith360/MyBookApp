import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookDescription from "../components/BookDescription";
import BookMeta from "../components/BookMeta";
import ReviewModal, { Review } from "../components/ReviewModal";

interface BookDetails {
  title: string;
  authors?: string[];
  imageLinks?: { thumbnail: string; medium?: string; large?: string };
  description?: string;
  pageCount?: number;        // total pages
  averageRating?: number;    // user rating
  infoLink?: string;         // hyperlink for more info
  publisher?: string;
  publishedDate?: string;
  categories?: string[];
  ratingsCount?: number;
  language?: string;
  previewLink?: string;
  isbn?: string;
  illustrator?: string;
  awards?: string[];
  nominations?: string[];
  characters?: string[];
  genres?: string[];
}

const extractGenres = (categories: string[] = []): string[] => {
  // Common genre mappings
  const genreMap: { [key: string]: string } = {
    'Fantasy & Magic': 'Fantasy',
    'Fantasy / General': 'Fantasy',
    'Fantasy / Contemporary': 'Fantasy',
    'Fantasy / Wizards & Witches': 'Fantasy',
    'Action & Adventure': 'Adventure',
    'School & Education': "Children's literature",
    'Juvenile Fiction': "Children's literature",
    'Young Adult Fiction': 'Young Adult',
  };

  const genres = new Set<string>();
  
  categories.forEach(category => {
    const parts = category.split('/').map(part => part.trim());
    
    // Check each part of the category path
    parts.forEach(part => {
      // Check if we have a direct mapping
      if (genreMap[part]) {
        genres.add(genreMap[part]);
      }
      // Check if we have a mapping for combined parts
      parts.forEach((otherPart) => {
        const combined = `${part} / ${otherPart}`;
        if (genreMap[combined]) {
          genres.add(genreMap[combined]);
        }
      });
    });
  });

  return Array.from(genres);
};

function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const bookResponse = await fetch(`http://localhost:5075/api/books/${bookId}`);
        if (!bookResponse.ok) {
          throw new Error(`Failed to fetch book details (${bookResponse.status})`);
        }
        
        const bookData = await bookResponse.json();
        
        if (!bookData || !bookData.volumeInfo) {
          throw new Error("Invalid book data received");
        }

        const volumeInfo = bookData.volumeInfo;
        const imageLinks = volumeInfo.imageLinks
          ? {
              ...volumeInfo.imageLinks,
              thumbnail: volumeInfo.imageLinks.thumbnail?.replace("http://", "https://"),
              medium: volumeInfo.imageLinks.medium?.replace("http://", "https://"),
              large: volumeInfo.imageLinks.large?.replace("http://", "https://"),
            }
          : null;

        // Transform infoLink if it points to play.google.com
        let infoLink: string | undefined = undefined;
        if (volumeInfo.infoLink) {
          if (volumeInfo.infoLink.includes("play.google.com")) {
            const url = new URL(volumeInfo.infoLink);
            const idParam = url.searchParams.get("id");
            if (idParam) {
              infoLink = `https://www.google.com/books/edition/_/${idParam}?hl=en`;
            } else {
              infoLink = volumeInfo.infoLink;
            }
          } else {
            infoLink = volumeInfo.infoLink;
          }
        }

        // Extract genres using the new function
        const genres = extractGenres(volumeInfo.categories);

        setBook({
          title: volumeInfo.title,
          authors: volumeInfo.authors,
          imageLinks: imageLinks,
          description: volumeInfo.description,
          pageCount: volumeInfo.pageCount,
          averageRating: volumeInfo.averageRating,
          infoLink,  // meta data with transformed URL
          publisher: volumeInfo.publisher,
          publishedDate: volumeInfo.publishedDate,
          categories: volumeInfo.categories,
          ratingsCount: volumeInfo.ratingsCount,
          language: volumeInfo.language,
          previewLink: volumeInfo.previewLink,
          isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier,
          illustrator: volumeInfo.illustrator,
          awards: volumeInfo.awards,
          nominations: volumeInfo.nominations,
          characters: volumeInfo.characters,
          genres: genres, 
        });
        const reviewResponse = await fetch(`http://localhost:5075/api/reviews/${bookId}`);
        const reviewData = await reviewResponse.json();
        setReviews(reviewData);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleReviewSubmit = async (reviewer: string, comment: string, rating: number) => {
    try {
      const response = await fetch("http://localhost:5075/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, reviewer, comment, rating }),
      });
      if (response.ok) {
        const addedReview = await response.json();
        setReviews([...reviews, addedReview]);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleOpenReviews = () => setShowReviews(true);
  const handleCloseReviews = () => setShowReviews(false);

  // Handle back to search navigation using history
  const handleBackToSearch = () => {
    navigate(-1);
  };

  // Compute average rating from reviews if available
  const computedAverage =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : undefined;

  if (loading) return <p className="text-center text-gray-300">Loading book details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!book) return <p className="text-center text-gray-300">No book details available.</p>;

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-6 py-10">
      <div className="w-full max-w-7xl mb-6">
        <button onClick={handleBackToSearch} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-md inline-block">
          ← Back to Search
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-10">
        <div className="flex justify-center lg:justify-start">
          {book.imageLinks?.thumbnail && (
            <img src={book.imageLinks.thumbnail} alt={book.title} className="w-72 lg:w-96 rounded-lg shadow-lg object-contain" />
          )}
        </div>

        <div className="flex flex-col flex-grow w-full">
          {/* Use BookMeta to render title, authors, and additional metadata */}
          <BookMeta
            title={book.title}
            authors={book.authors}
            pageCount={book.pageCount}
            averageRating={computedAverage}
            infoLink={book.infoLink}
            publisher={book.publisher}
            publishedDate={book.publishedDate}
            categories={book.categories}
            ratingsCount={book.ratingsCount}
            language={book.language}
            isbn={book.isbn}
            illustrator={book.illustrator}
            awards={book.awards}
            nominations={book.nominations}
            characters={book.characters}
            genres={book.genres}
          />
          {/* Render description using safe HTML formatting */}
          {book.description ? (
            <BookDescription description={book.description} />
          ) : (
            <p className="mt-4 text-gray-300">No description available.</p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleOpenReviews}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded focus:ring-2 focus:ring-blue-500 text-white"
              aria-label="Open reviews"
            >
              Reviews
            </button>
            {book.infoLink && (
              <a
                href={book.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                More Info
              </a>
            )}
          </div>

          {showReviews && (
            <ReviewModal
              reviews={reviews}
              onClose={handleCloseReviews}
              onSubmitReview={handleReviewSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;