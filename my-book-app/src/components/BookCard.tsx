/* 
   BookCard Component:
   - Displays a book's cover, title, and authors.
   - Clickable to navigate to book details.
*/

interface Book {
  id: string;
  title: string;
  authors?: string[];
  imageLinks?: { thumbnail: string };
}

interface BookCardProps {
  book: Book;
  onClick: () => void; // Called when the card is clicked
}

function BookCard({ book, onClick }: BookCardProps) {
  const authorText = book.authors?.join(", ") || "Unknown Author";
  
  return (
    <article
      className="p-4 border border-gray-600 rounded hover:shadow-lg transition focus-within:ring-2 focus-within:ring-blue-500 bg-gray-800"
      role="article"
    >
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded p-2"
        aria-label={`View details for ${book.title} by ${authorText}`}
      >
        {book.imageLinks?.thumbnail && (
          <img 
            src={book.imageLinks.thumbnail} 
            alt={`Cover of ${book.title}`} 
            className="w-full h-40 object-cover mb-2 rounded"
            loading="lazy"
          />
        )}
        <h3 className="text-lg font-semibold text-gray-100">{book.title}</h3>
        <p className="text-gray-300">{authorText}</p>
      </button>
    </article>
  );
}

export default BookCard;