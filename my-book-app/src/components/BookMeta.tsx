/* 
   BookMeta Component:
   - Displays metadata about a book such as title, authors, publisher, and additional details.
*/

// Props for the BookMeta component
interface BookMetaProps {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  infoLink?: string;
  isbn?: string;
  illustrator?: string;
  awards?: string[];
  nominations?: string[];
  characters?: string[];
  genres?: string[];
}

// Component to display book metadata
const BookMeta = ({
  title,
  authors,
  publisher,
  publishedDate,
  pageCount,
  categories,
  averageRating,
  language,
  isbn,
  illustrator,
  awards,
  nominations,
  characters,
  genres,
}: BookMetaProps) => {
  // Process categories to get main categories and remove duplicates
  const processCategories = (categories: string[]): string[] => {
    const mainCategories = categories
      .map(category => category.split('/')[0].trim())
      .filter((value, index, self) => self.indexOf(value) === index);
    return mainCategories;
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-100">{title}</h1>
      <p className="text-gray-400 mt-2">{authors?.join(", ") || "Unknown Author"}</p>

      <div className="mt-4 text-gray-300 space-y-2">
        {publisher && (
          <p>
            <span className="font-semibold">Publisher:</span> {publisher}
          </p>
        )}
        {publishedDate && (
          <p>
            <span className="font-semibold">Published Date:</span> {publishedDate}
          </p>
        )}
        {pageCount && (
          <p>
            <span className="font-semibold">Page Count:</span> {pageCount}
          </p>
        )}
        {categories && categories.length > 0 && (
          <p>
            <span className="font-semibold">Categories:</span>{" "}
            {processCategories(categories).join(", ")}
          </p>
        )}
        {genres && genres.length > 0 && (
          <p>
            <span className="font-semibold">Genres:</span>{" "}
            {genres.join(", ")}
          </p>
        )}
        {averageRating != null && (
          <p>
            <span className="font-semibold">Average Rating:</span>{" "}
            {(averageRating % 1 === 0 ? averageRating.toFixed(0) : averageRating.toFixed(1))} / 10
          </p>
        )}
        {language && (
          <p>
            <span className="font-semibold">Language:</span> {language.toUpperCase()}
          </p>
        )}
      </div>

      {(isbn || illustrator || (awards && awards.length > 0) || (nominations && nominations.length > 0) || (characters && characters.length > 0)) && (
        <div className="mt-4 text-gray-300 space-y-2">
          {isbn && <p><span className="font-semibold">ISBN:</span> {isbn}</p>}
          {illustrator && <p><span className="font-semibold">Illustrator:</span> {illustrator}</p>}
          {awards && awards.length > 0 && (
            <p><span className="font-semibold">Awards:</span> {awards.join(", ")}</p>
          )}
          {nominations && nominations.length > 0 && (
            <p><span className="font-semibold">Nominations:</span> {nominations.join(", ")}</p>
          )}
          {characters && characters.length > 0 && (
            <p><span className="font-semibold">Characters:</span> {characters.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookMeta;