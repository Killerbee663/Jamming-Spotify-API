import { useAppContext } from "../context/AppContext";
import Tracklist from "./Tracklist";

export default function SearchResults() {
    const { searchResults } = useAppContext()
    return (
        <div>
            <h2 className="text-xl font-bold">Search Results</h2>
            <Tracklist tracks={searchResults} />
        </div>
    )
}