
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css"; 

const SearchBar = () => {

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search here..."
        className="search-input"
      />
      <button className="search-button">
        <FaSearch className="search-icon" />
      </button>
    </div>
  );
};

export default SearchBar;
