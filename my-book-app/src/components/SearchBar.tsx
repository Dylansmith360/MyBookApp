/* 
   SearchBar Component:
   - Provides a text input for users to search books.
   - Uses debounce to minimize API calls.
*/

import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (searchQuery: string) => void;
  initialQuery?: string;
}

function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500); // Wait 300ms before searching

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (debouncedQuery !== initialQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]); // Remove onSearch from dependencies

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books..."
        className="p-2 border rounded flex-grow"
      />
    </form>
  );
}

export default SearchBar;