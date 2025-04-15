import React from "react";
import SpotifyAPI from "../utilities/SpotifyAPI";
import { FaSpotify } from "react-icons/fa";

export default function AuthButton() {
  const handleLogin = () => {
    SpotifyAPI.redirectToSpotifyAuth();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <FaSpotify className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to Jammming
        </h1>
        <p className="text-gray-300 max-w-md mx-auto">
          Create and save your perfect playlists by connecting with your Spotify
          account.
        </p>
      </div>

      <div className="bg-gray-800 opacity-[.95] rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">
          Connect with Spotify
        </h2>
        <p className="text-gray-300 mb-6">
          Sign in with your Spotify account to search tracks, create playlists,
          and save them to your library.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center"
        >
          <FaSpotify className="mr-2" />
          Connect with Spotify
        </button>
      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        You'll be redirected to Spotify to authorize this application
      </footer>
    </div>
  );
}
