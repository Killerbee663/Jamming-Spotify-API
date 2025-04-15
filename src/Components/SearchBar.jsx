import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import SpotifyAPI from "../utilities/SpotifyAPI";
import { FaSearch, FaSpinner } from "react-icons/fa";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { setSearchResults } = useAppContext();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 800);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

  const performSearch = async (term) => {
    if (!term.trim()) return;

    setIsSearching(true);
    try {
      const results = await SpotifyAPI.search(term);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length === 0) {
      setSearchResults([]);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isSearching ? (
            <FaSpinner className="text-green-500 animate-spin" />
          ) : (
            <FaSearch className="text-gray-400" />
          )}
        </div>
        <input
          type="text"
          placeholder="Search for songs, artists, or albums..."
          className="bg-gray-800 text-white border-none pl-10 pr-4 py-3 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      {isSearching && (
        <div className="absolute right-3 top-3 text-xs text-gray-400">
          Searching...
        </div>
      )}
    </div>
  );
}
