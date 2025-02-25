import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailsPage from "./pages/BookDetailsPage";
import Navbar from "./components/Navbar";
import { SearchStateProvider } from "./context/SearchStateContext";

function App() {
  return (
    <SearchStateProvider>
      <Router>
        <div className="bg-gray-900 min-h-screen w-full">
          <Navbar />
          <main id="main-content" className="pt-24 w-full" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books/:bookId" element={<BookDetailsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SearchStateProvider>
  );
}

export default App;