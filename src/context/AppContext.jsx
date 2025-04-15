import { createContext, useContext, useState } from "react";
import SpotifyAPI from "../utilities/SpotifyAPI";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

  const addTrack = (track) => {
    if (!playlist.some((t) => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylist(playlist.filter((t) => t.id !== track.id));
  };

  const savePlaylist = async () => {
    if (!playlistName.trim()) {
      setSaveMessage({ 
        text: "Please enter a playlist name", 
        type: "error" 
      });
      setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
      return;
    }

    const trackURIs = playlist.map((track) => track.uri);
    if (!trackURIs.length) {
      setSaveMessage({ 
        text: "Please add at least one track to your playlist", 
        type: "error" 
      });
      setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
      return;
    }

    setIsSaving(true);
    try {
      const success = await SpotifyAPI.savePlaylist(playlistName, trackURIs);
      
      if (success) {
        setPlaylist([]);
        setPlaylistName("");
        setSaveMessage({ 
          text: "Playlist successfully saved to Spotify!", 
          type: "success" 
        });
      } else {
        setSaveMessage({ 
          text: "Failed to save playlist. Please try again.", 
          type: "error" 
        });
      }
    } catch (error) {
      console.error("Error saving playlist:", error);
      setSaveMessage({ 
        text: "An error occurred while saving the playlist", 
        type: "error" 
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <AppContext.Provider
      value={{
        searchResults,
        setSearchResults,
        playlist,
        setPlaylist,
        playlistName,
        setPlaylistName,
        addTrack,
        removeTrack,
        savePlaylist,
        isSaving,
        saveMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}