import Track from "./Track";

export default function Tracklist({ tracks, isPlaylist = false }) {
  return (
    <div className="mt-2">
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          isPlaylist={isPlaylist}
        />
      ))}
    </div>
  );
}
