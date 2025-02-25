import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import useDebounce from "../hooks/useDebounce";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // When the debounced query changes, reset pagination and clear books
    setStartIndex(0);
    setBooks([]);
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!debouncedQuery.trim()) {
        setBooks([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5075/api/books?query=${encodeURIComponent(debouncedQuery)}&page=${startIndex + 1}&pageSize=10`
        );

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        const formattedBooks = data.items?.map((item: any) => {
          const { imageLinks } = item.volumeInfo;
          return {
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            imageLinks: imageLinks
              ? {
                  ...imageLinks,
                  thumbnail: imageLinks.thumbnail?.replace("http://", "https://"),
                  smallThumbnail: imageLinks.smallThumbnail?.replace("http://", "https://"),
                }
              : null,
          };
        }) || [];

        setBooks((prev) => {
          const existingIds = new Set(prev.map(book => book.id));
          const newBooks = formattedBooks.filter((book: { id: string }) => !existingIds.has(book.id));
          return startIndex === 0 ? formattedBooks : [...prev, ...newBooks];
        });

        setHasMore(formattedBooks.length === 10);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedQuery, startIndex]);

  useEffect(() => {
    if (!bottomRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setStartIndex((prev) => prev + 10);
        }
      },
      { threshold: 1 }
    );
    observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hasMore, loading]);

  return (
    <div className="pt-5 px-6"> 
      {/* Header Section */}
      <SearchBar onSearch={setQuery} initialQuery={query} />

      {/* Loading / Error Messages */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {loading && <p className="text-gray-400 mt-4 text-center">Loading books...</p>}

      {/* Book List */}
      {debouncedQuery && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/books/${book.id}`)}
            />
          ))}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default HomePage;