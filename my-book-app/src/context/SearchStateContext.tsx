import React, { createContext, useContext, useState, useCallback } from 'react';

interface SearchState {
  query: string;
  books: any[];
}

interface SearchContextType {
  searchState: SearchState;
  setSearchState: (state: SearchState) => void;
  clearSearchState: () => void;
}

const SearchStateContext = createContext<SearchContextType | undefined>(undefined);

export const SearchStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    books: []
  });

  const setSearchStateCallback = useCallback((newState: SearchState) => {
    setSearchState(newState);
  }, []);

  const clearSearchState = useCallback(() => {
    setSearchState({ query: '', books: [] });
  }, []);

  return (
    <SearchStateContext.Provider 
      value={{ 
        searchState, 
        setSearchState: setSearchStateCallback, 
        clearSearchState 
      }}
    >
      {children}
    </SearchStateContext.Provider>
  );
};

export const useSearchState = () => {
  const context = useContext(SearchStateContext);
  if (!context) {
    throw new Error('useSearchState must be used within a SearchStateProvider');
  }
  return context;
};
