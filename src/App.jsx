import { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import SearchBar from "./Components/SearchBar";
import SearchResults from "./Components/SearchResults";
import Playlist from "./Components/Playlist";
import AuthButton from "./Components/AuthButton";
import UserProfile from "./Components/UserProfile";
import SpotifyAPI from "./utilities/SpotifyAPI";
import { FaMusic, FaHeart, FaSpotify } from "react-icons/fa";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = SpotifyAPI.isAuthenticated();
      setIsAuthenticated(auth);
      setIsLoading(false);

      SpotifyAPI.getAccessToken();
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-spin text-green-500 text-4xl">
          <FaSpotify />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthButton />;
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <header className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaMusic className="text-green-500 text-3xl" />
            <h1 className="text-2xl  font-bold text-white">Jammming</h1>
          </div>
          <UserProfile />
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <SearchBar />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <SearchResults />
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <Playlist />
            </div>
          </div>
        </main>

        <footer className="mt-12 py-6 px-6 text-center text-gray-400 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <FaHeart className="text-green-500" />
            <span>Made with Spotify</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Jammming - Create and save your perfect
            playlists
          </p>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
