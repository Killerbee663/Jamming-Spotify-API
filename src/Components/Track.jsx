import { useAppContext } from "../context/AppContext";
import { FaPlus, FaMinus, FaMusic } from 'react-icons/fa';

export default function Track({ track, isPlaylist }) {
  const { addTrack, removeTrack } = useAppContext();

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center p-4 hover:bg-gray-700 bg-opacity-50 transition-colors rounded-md mb-2 group">
      <div className="w-12 h-12 mr-4 flex-shrink-0">
        {track.albumArt ? (
          <img 
            src={track.albumArt} 
            alt={track.album} 
            className="w-full h-full object-cover rounded shadow" 
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded">
            <FaMusic className="text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-white truncate">{track.name}</h3>
        <p className="text-gray-400 text-sm truncate">
          {track.artist} • {track.album}
        </p>
      </div>
      
      {track.duration && (
        <div className="text-gray-400 text-sm mr-4 hidden md:block">
          {formatDuration(track.duration)}
        </div>
      )}
      
      {isPlaylist ? (
        <button
          onClick={() => removeTrack(track)}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all transform group-hover:scale-105"
          aria-label="Remove from playlist"
        >
          <FaMinus />
        </button>
      ) : (
        <button
          onClick={() => addTrack(track)}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all transform group-hover:scale-105"
          aria-label="Add to playlist"
        >
          <FaPlus />
        </button>
      )}
    </div>
  );
}