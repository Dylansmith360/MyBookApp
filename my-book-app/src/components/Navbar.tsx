import { Link } from "react-router-dom";
import { useSearchState } from '../context/SearchStateContext';

const Navbar = () => {
  const { clearSearchState } = useSearchState();
  
  const handleHomeClick = () => {
    clearSearchState();
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold" onClick={handleHomeClick}>
          MyBookApp
        </Link>
        <nav>
          <Link to="/" className="text-lg hover:text-gray-400" onClick={handleHomeClick}>Home</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;