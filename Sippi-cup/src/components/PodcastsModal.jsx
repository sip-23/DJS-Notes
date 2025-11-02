import { useState, useEffect } from "react";
import { genres } from "../../../data.js"; 
// React hooks:
// --- useState: local state container (React’s equivalent of internal mutable storage).
// --- useEffect: manages side effects like data fetching, DOM event handling, or state cleanup tied to lifecycle.
// genres: static data structure (probably an array of { id, title } objects). Used for lookup later.

/**
 * PodcastsModal component which shows the detailed information about a selected podcast in a modal overlay. 
 * It shows the podcast image, description, genres, seasons, and last updated date. 
 * 
 * @component 
 * 
 * @param {Object} props - Component props
 * @param {number|string} props.podcastId - The ID of the podcast that is selected by user
 * @param {boolean} props.isOpen - state control to check if the modal is open or closed
 * @param {Function} props.onClose - event listener of call back function
 * @param {Array<Object>} props.allPodcasts - Array of all podcasts data available
 * 
 * @returns {JSX.Element|null} The rendered modal or null if closed/no podcast
 */
const PodcastsModal = ({ podcastId, isOpen, onClose, allPodcasts }) => {
    // 1. Stores the currently selected podcast and its genres.
    // Declares a React Functional Component using arrow function syntax.
    // --- The destructuring { podcastId, isOpen, onClose, allPodcasts } extracts props directly for clean, declarative access.
    // --- Props are pure inputs — React re-renders when their references change (functional purity assumption).

    // 2. Two local state hooks declared at the top level
    /** @type {[Object|null, Function]} podcastData - State to store currently selected podcast */
    const [podcastData, setPodcastData] = useState(null);
    // Each call returns a tuple: [stateValue, stateSetter].
    // --- useState creates a persistent closure between renders — React preserves the value across re-renders.
    // --- The setters (setPodcastData, setPodcastGenres) enqueue a state update task in React’s internal queue and schedule a re-render.

    /** @type {[Array<string>, Function]} podcastGenres - State to store genre titles of selected podcast */
    const [podcastGenres, setPodcastGenres] = useState([]);

    // 3. Then I set up a Helper Function: Find podcast by ID.
    // Searches allPodcasts to match the clicked podcast.
    // Pure lookup function that filters from a parent-supplied data array.
    // Uses arrow function syntax for conciseness; implicitly closes over allPodcasts from parent scope (closure).
    /**
     * Finds a podcast object from allPodcasts by its ID
     * 
     * @param {number|string} id - The ID of the podcast to find
     * @returns {Object|undefined} The podcast object if found, otherwise undefined
     */
    const getPodcastById = (id) => {
        return allPodcasts.find(podcast => podcast.id === id);  // .find() returns the first element matching predicate; O(n) complexity.
    };

    // 4. Then I set up another Helper function: To Get genre names from podcast.
    // - Here, I Cross-reference podcast.genres (array of IDs) with the global genres list.
    // - This then Maps IDs → genre titles.
    // Two array transformations:
    // Filtering genres global array to match only IDs inside podcast.genres.
    // Mapping filtered list to titles.
    // Uses array chaining and pure functional transformation — no mutation.
    // Returns a derived array, suitable for React rendering (.map() in JSX).
    /**
     * Maps podcast genre IDs to genre titles
     * 
     * @param {Object} podcast - Podcast object with a genres array of IDs
     * @returns {Array<string>} Array of genre titles
     */
    const getGenresByPodcast = (podcast) => {
        if (!podcast.genres) return [];
            return genres
            .filter(genre => podcast.genres.includes(genre.id))
            .map(genre => genre.title);
        };

    // 4. I then created another Helper function to Format last updated date
    // Input validation + graceful fallback.
    // Uses JavaScript’s Date API to format in locale-aware style.
    // Avoids mutating the date — a pure deterministic function.
    // ------ Would be a good candidate for memoization (useMemo) if performance ever mattered for large data.
    /**
     * Formats a date string into a human-readable format
     * 
     * @param {string} dateString - Date string (ISO format)
     * @returns {string} Formatted date like "September 21, 2025" or "Unknown"
     */
    const getFormattedDate = (dateString) => {
        if (!dateString) return "Unknown";
        const updatedDate = new Date(dateString);
            return updatedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            });
        };


    // 5. Load podcast data upon clicking on card for modal to open
    // This Loads podcast data when modal opens.
    // --- This Runs every time isOpen or podcastId changes.
    // --- Ensures the modal loads fresh data when opening.
    // 6. useEffect runs after the component renders to synchronize state with props.
    // 7. Dependency array [isOpen, podcastId] ensures the effect only runs when:
    // --- Modal opens/closes (isOpen changes), or
    // --- A new podcast is selected (podcastId changes).
    // Purpose: Fetch and derive component-local state from parent data source (allPodcasts).
    // - Ensures the modal shows fresh content each time it opens.
    useEffect(() => {
        if (isOpen && podcastId) {
        const podcast = getPodcastById(podcastId);
        if (podcast) {
            setPodcastData(podcast);
            setPodcastGenres(getGenresByPodcast(podcast));
        }
        }
    }, [isOpen, podcastId]);

    // 8. Re-render flow:
    // - isOpen toggles true → triggers effect.
    // - Looks up podcast → updates podcastData and podcastGenres.
    // - State updates → re-render → UI populated.

    // 7. Backdrop click closes modal
    // Checks that the click event originates from the overlay div itself, not a child element — using strict equality on event.target vs event.currentTarget.
    // Avoids event bubbling closing the modal when interacting inside content.
    // A solid event propagation control pattern.
    /**
     * Handles clicks on the backdrop to close the modal
     * 
     * @param {React.MouseEvent<HTMLDivElement>} e - The click event
     */
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    // 8. Reset on Close
    // This is a cleanup effect for modal lifecycle.
    // When modal closes (isOpen === false), it resets local state to avoid stale data.
    // Dependency array [isOpen] ensures minimal recomputation.
    // Improves memory hygiene (especially if modal stays mounted while hidden).
    useEffect(() => {
        if (!isOpen) {
            setPodcastData(null);
            setPodcastGenres([]);
        }
    }, [isOpen]);

    // 9. Global Event Listener for “Escape”
    // Attaches a global event listener to window only when modal is open.
    // Cleanup function returned by useEffect runs before next effect or unmount → prevents listener leaks.
    // Dependency array [isOpen, onClose] ensures the effect only re-registers when open state or handler reference changes.
    // Common pattern for imperative side effects safely integrated into React’s functional lifecycle.
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // 10. Conditional Rendering Guard
    // Prevents unnecessary render of modal when not needed.
    // Returning null from a React component renders nothing to the DOM.
    // This maintains render purity — no hidden display toggling with CSS; instead, React doesn’t even instantiate DOM nodes.
    if (!isOpen || !podcastData) return null; // Render nothing if closed or no podcast

    return (
        // backdrop:
        // fixed inset-0: full-screen overlay.
        // bg-opacity-50: translucent background for modal dimming.
        // z-50: ensures it’s rendered above all other layers.
        // onClick: handles modal close logic.
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            {/* Inner modal container:
                - Tailwind utility classes create responsive, scrollable design.
                - The overflow-y-auto ensures scroll inside the modal instead of the background page. */}
            <div className="bg-[#282828] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header 
                    - Accessibility: uses aria-label for screen readers.
                    - Close button is declarative — triggers onClose() callback → parent toggles isOpen false.*/}
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">{podcastData.title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-white text-2xl hover:text-gray-400"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {/* Image */}
                    <img 
                        src={podcastData.image || "./src/assets/SippiCup_logo.png"} 
                        alt={podcastData.title} 
                        className="w-full lg:w-[40%] h-fit object-cover rounded-lg" 
                    />
                    
                    {/* Details */}
                    <div className="flex-1">
                        <p className="text-gray-300 mb-4">{podcastData.description}</p>
                        
                        {/* Genres 
                            - Iterates genre list using .map() → returns <span> chips.
                            - Fallback message when podcastGenres is empty.
                            - Uses index as key because list is stable, non-reordered.*/}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {podcastGenres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#F4F4F4] w-fit h-fit px-2 py-1 text-sm text-[#121212] rounded"
                                    >
                                        {genre}
                                    </span>
                                ))}
                                {podcastGenres.length === 0 && (
                                    <span className="text-gray-400">No genres listed</span>
                                )}
                            </div>
                        </div>

                        {/* Metadata 
                            - Lightweight two-column grid showing metadata.
                            - Uses computed value from the earlier helper function for date formatting.
                            - Graceful fallbacks for missing data.*/}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <div>
                                <span className="font-medium">Seasons:</span> {podcastData.seasons || 0}
                            </div>
                            <div>
                                <span className="font-medium">Last Updated:</span> {getFormattedDate(podcastData.updated)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PodcastsModal;