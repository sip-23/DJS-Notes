import { useState, useEffect } from "react";
import { genres } from "../../../data.js";

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
    /** @type {[Object|null, Function]} podcastData - State to store currently selected podcast */
    const [podcastData, setPodcastData] = useState(null);

    /** @type {[Array<string>, Function]} podcastGenres - State to store genre titles of selected podcast */
    const [podcastGenres, setPodcastGenres] = useState([]);

    // 2. Then I set up a Helper Function: Find podcast by ID.
    // Searches allPodcasts to match the clicked podcast.
    /**
     * Finds a podcast object from allPodcasts by its ID
     * 
     * @param {number|string} id - The ID of the podcast to find
     * @returns {Object|undefined} The podcast object if found, otherwise undefined
     */
    const getPodcastById = (id) => {
        return allPodcasts.find(podcast => podcast.id === id);
    };

    // 3. Then I set up another Helper function: To Get genre names from podcast.
    // - Here, I Cross-reference podcast.genres (array of IDs) with the global genres list.
    // - This then Maps IDs → genre titles.
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
    useEffect(() => {
        if (isOpen && podcastId) {
        const podcast = getPodcastById(podcastId);
        if (podcast) {
            setPodcastData(podcast);
            setPodcastGenres(getGenresByPodcast(podcast));
        }
        }
    }, [isOpen, podcastId]);

    // 6. Backdrop click closes modal
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

    useEffect(() => {
        if (!isOpen) {
            setPodcastData(null);
            setPodcastGenres([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !podcastData) return null; // Render nothing if closed or no podcast

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-[#282828] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
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
                        
                        {/* Genres */}
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

                        {/* Metadata */}
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