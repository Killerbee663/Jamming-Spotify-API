import { useAppContext } from "../context/AppContext";
import Tracklist from "./Tracklist";
import { FaSave, FaSpotify, FaMusic } from "react-icons/fa";

export default function Playlist() {
  const {
    playlist,
    playlistName,
    setPlaylistName,
    savePlaylist,
    isSaving,
    saveMessage,
  } = useAppContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FaMusic className="mt-1 mr-2 text-green-500" />
          {!playlistName ? "Your Playlist" : playlistName}
        </h2>
        <div className="text-sm text-gray-400">
          {playlist.length} {playlist.length <= 1 ? "track" : "tracks"}
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="playlist-name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Playlist Name
        </label>
        <input
          id="playlist-name"
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="bg-gray-700 border-none text-white p-3 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          placeholder="Enter a name for your playlist"
          required
        />
      </div>

      <div className="mb-6 max-h-96 overflow-y-auto custom-scrollbar">
        {playlist.length > 0 ? (
          <Tracklist
            tracks={playlist}
            isPlaylist={true}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-md">
            <FaMusic className="text-4xl text-gray-600 mb-3" />
            <p className="text-gray-400 text-center">
              Your playlist is empty. Add tracks from the search results.
            </p>
          </div>
        )}
      </div>

      {saveMessage.text && (
        <div
          className={`p-3 mb-4 rounded-md text-sm flex items-center ${
            saveMessage.type === "success"
              ? "bg-green-800 bg-opacity-50 text-green-300 border border-green-700"
              : "bg-red-800 bg-opacity-50 text-red-300 border border-red-700"
          }`}
        >
          {saveMessage.type === "success" ? (
            <FaSpotify className="mr-2" />
          ) : null}
          {saveMessage.text}
        </div>
      )}

      <button
        onClick={savePlaylist}
        disabled={isSaving || playlist.length === 0}
        className={`
          w-full p-3 rounded-md font-semibold transition-all duration-200
          flex items-center justify-center space-x-2
          ${
            playlist.length === 0
              ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
              : "bg-green-500 text-white hover:bg-green-600 transform hover:scale-[1.02]"
          }
        `}
      >
        <FaSave className={isSaving ? "animate-pulse" : ""} />
        <span>{isSaving ? "Saving to Spotify..." : "Save to Spotify"}</span>
      </button>
    </div>
  );
}
