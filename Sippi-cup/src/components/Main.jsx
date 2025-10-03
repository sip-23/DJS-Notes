// 1. Import dependencies:
// - useState from React: is a React Hook for local component state.
// - useMemo is a Hook that memoizes (caches) expensive computations until dependencies change.
import { useState, useMemo } from "react";
// useState for state management.
// useMemo for performance optimization

// 2. Then I Import child components (custom JSX tags).
// - They are just React functions that return JSX. and Each will receive props (custom attributes).
// - These are React components are defined in other files.
// - These components are organization with ../ - This means going up one directory level
import PodcastGrid from "../views/renderGrid";   // PodcastGrid to render podcasts in a grid.
import PodcastModal from "./PodcastsModal";   // for showing detailed podcast info.
import LoadingSpinner from "../utilities/loadingSpinner";   // LoadingSpinner to indicate data loading.
import ErrorDisplay from "../utilities/loadingError";   // ErrorDisplay to show fetch errors.
import useFetchPodcasts from "../utilities/fetchPodcasts";  // useFetchPodcasts, a custom hook for fetching podcast data.
import GenreFilter from "../utilities/genreFilter";
import Sorter from "../utilities/podcastSorter";
import Pagination from "../utilities/pagination";

/**
 * Home Component
 * 
 * Main landing page of the podcast app.
 * @component
 */

// 3. I then jump straight in and Define the Home component (which is main page of the app) which is a functional component, using the arrow function.
const Home = () => {
    // 4. Then I Store the podcasts API endpoint in Local state with a default value = API URL.
    // Here is where we preform Array destructuring: [state, setState].  
    // - The useState hook: Creates a getter state variable podcastsUrl with fixed API endpoint. 
    // --- Using useState makes it reactive, though here it won’t change - no setter needed since URL is constant
    // ------- Hence we only define the variable In this instance we only use the Array destructuring: [podcastsUrl] - only getting the value - to be used by the fetch hook.
    const [podcastsUrl] = useState("https://podcast-api.netlify.app/shows");
  
    // 5. Then I define the Fetch all podcasts Custom hook.
    // I first Initialise my Object destructuring: Where my custom hook "useFetchPodcasts" Extract and returns 3 properties
    // Essentially, my custom hook takes the API URL as an argument and Extracts 3 properties from hook return value
    // - allPodcasts: Alias data - This is an array of podcast data.
    // - isLoading: boolean, true while fetching.
    // - error: error message if fetch fails.
    const { 
        data: allPodcasts, 
        isLoading, 
        error 

    } = useFetchPodcasts(podcastsUrl);

    // 6. I then Define my Multiple state variables for Filtering, Sorting, Search, Pagination States
    // - Each state is managed separately
    const [selectedGenre, setSelectedGenre] = useState('all'); // Dropdown filter with Initial value 'all' (no filter applied)
    const [sortCriteria, setSortCriteria] = useState('recent'); // This allows for how to order results. Initial value is 'recent' (default sorting)
    const [searchTerm, setSearchTerm] = useState(''); // with a default value of an empty string. This allows for input text.
    const [currentPage, setCurrentPage] = useState(1);  // This allows for current pagination index with an Initial value 1 (first page)
    const [postsPerPage, setPostPerPage] = useState(8);  // The numerical value of 8 is set as results per page, allowing for small chunks.

    // 7. Then I Define the state variables for the podcast modal:
    // - selectedPodcastId: which podcast is currently selected (default value: null if none).
    // - isModalOpen: boolean controlling modal visibility.
    const [selectedPodcastId, setSelectedPodcastId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 8. I then defined my function to Filter, seach and sort podcasts
    // - Here I used the useMemo hook: This helps Memorize expensive computation, only recalculates when the dependencies change
    // --- Dependencies: allPodcasts, selectedGenre, sortCriteria, searchTerm.
    const filteredAndSortedPodcasts = useMemo(() => {
        // Then I applied an early return.
        if (!allPodcasts || allPodcasts.length === 0) return []; // 9. If no data, return empty list.

        // 10. I start by Defining variable for Podcasts to be processed
        let processedPodcasts = allPodcasts;

        // 11. Then for the Search feature.
        if (searchTerm) {  // I create a conditional stating: If SearchTerm dependency is present
            // 15. Then I take all processed podcast Array and apply the filter() function.
            // The .filter() method: is applied on an array of objects, which Creates new array with podcasts objects matching search criteria
            processedPodcasts = processedPodcasts.filter(podcast => 
                podcast.title && podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
                // 12. This all starts inside right, 
                // The .toLowerCase() method is applied to padcast title Sting: Which Makes search string lower case and case-insensitive
                // 13. Then that transformed string is taken and .includes() is applied to it: this Checks if title contains search term (partial match)
                // 14. But before calling the methods on to the extracted string, I performed chaining using podcast.title &&, which ensures title exists.
            );
        }
        // And then then using .includes, matches or checks the Serach term being passed is included.

        // 16. Then I add filter condition 
        // where it Only applies if genre is not 'all'
        if (selectedGenre !== 'all') {
            // 19. Then I take all processed podcast Array of objects and apply the .filter() method
            // which Creates new array with podcasts objects matching search criteria
            processedPodcasts = processedPodcasts.filter(podcast => 
                podcast.genres && podcast.genres.includes(parseInt(selectedGenre))
                // 17. From the inside, I applied the .includes() method on the Array of Podcast objects: this Checks if podcast's genres array contains selected genre ID
                // 18. The parseInt() method, Converts string from select input to number for comparison
                // - Now from an array with ['1', '4'], I now get and array [1,4] Where the filter can now be applied.
            );
        }

        // 20. Then for the Sort feature, I took the processed podcasts Array of objects and applied the Spread operator [...] creating a shallow copy and avoid mutating original array of objects. 
        const sortedPodcasts = [...processedPodcasts];

        // 21. Using the switch statement, I am able to handles different sorting criteria or logic.
        // allowing me to Handle alphabetical, chronological, and sort by number of seasons.
        switch (sortCriteria) {
            case 'title-az':
                // 22. Then I applied the .localeCompare() method on the extracted title string Allowing Alphabetical comparison that handles special characters properly
                // 23. moving outside, I then applied .sort() method on the copied Array of podcasts object and Sorts array in place based from the extracted title string
                sortedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-za':
                // 24. adding Reverse alphabetical order just by Swaping the positions a and b parameters to sort Z-A
                // 25. Again, I applied .localeCompare() method on the extracted title string Allowing Alphabetical comparison that handles special characters
                // 26. Then the .sort() method on the copied Array of podcasts object and Sorts array in place based from the extracted title string
                sortedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'recent': // 27. for Date sorting
                // 28. I used new Date() key words which convert the global date string from the rendered Array of objects to a JavaScript Date object.
                // 29. For me to now get to a comparable value beteen the dates, I had to use Date arithmetic: 
                // - Basicaly me Subtracting dates from each other returns milliseconds differences
                // 30. Using the .sort() method taking into account the calculated millisecs, 
                // - the copied Array of podcasts object is Sorted in place based from the extracted numerical value where b - a gives descending order (newest first)
                sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                break;
            case 'oldest':
                // - And a - b gives ascending order (oldest first)
                sortedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
                break;
            case 'seasons':
                sortedPodcasts.sort((a, b) => {
                    // 31. Here, I then Handle podcasts with no seasons property using Nullish coalescing.
                    // 32.This a.seasons || 0 provides fallback if seasons is undefined
                    const seasonsA = a.seasons || 0;
                    const seasonsB = b.seasons || 0;
                    return seasonsB - seasonsA; // 33. Again, Arithmetic, I am able to do Numeric sorting in Descending order (most seasons first)
                });
                break;
            default:
                // 34. lastly, I was able to Default to recent sorting
                sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        }

        return sortedPodcasts; // 35. Then I return the new sorted Podcasts to be rendered
        // 36. I then also return a Dependency array which useMemo keeps track of and recalculates when any of these values change
        // - In terms of Performance: it Prevents unnecessary re-renders and computations
    }, [allPodcasts, selectedGenre, sortCriteria, searchTerm]); // Memoized return value.

    // 37. For my Pagination feature, I first define my paginationData function using the useMemo hook.
    // - This is a arrow function
    // Using slice method in js, which cuts array using starting index and last index
    const paginationData = useMemo(() => {
        const totalPodcasts = filteredAndSortedPodcasts.length; // 38. Then I define the totalPodcasts using the length method. This counts the length of the object
        const totalPages = Math.ceil(totalPodcasts / postsPerPage); // 39. Using the Math Object / library, I apply the .ceiling method, which Rounds up to ensure partial pages are counted, I define Count of total pages.

        // 40. This Boundary check conditional helps Reset to first page if the user is out of range
        // - If current page exceeds total pages (after filtering), reset to page 1
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1); // I used the setter State update in useMemo: Generally avoided, but necessary here for data consistency
        }

        // 41. To also get the range to display at the bottom, 
        // 42. I also calculated padcast indexes.
        // - Pagination indices:
        // --- Where I calculate the firstIndex: (currentPage - 1) * postsPerPage
        // --- Then I calculate the lastIndex: currentPage * postsPerPage
        const lastPodcastIndex = currentPage * postsPerPage;
        const fistPodcastIndex = lastPodcastIndex - postsPerPage;

        // 43. To show the current range of cards and hiding unwanted cards, I used .slice(start, end) method which returns Extracts portion of array for current page
        // The .slice() method is applied on an Array produced by filteredAndSortedPodcasts function and Extracts.
        const currentCards = filteredAndSortedPodcasts.slice(fistPodcastIndex, lastPodcastIndex);

        return {
            currentCards,
            totalPages,
            currentPage: Math.min(currentPage, totalPages || 1),
            totalPodcasts
        };
    }, [filteredAndSortedPodcasts, currentPage, postsPerPage]); // 20. Memoized return object with current page’s data.

    // State for error display
    // const [isErrorVisible, setIsErrorVisible] = useState(true);

    // 21. Below, I then start to Called when user clicks a podcast card.
    const handlePodcastSelect = (podcast) => {
        setSelectedPodcastId(podcast.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPodcastId(null);
    };

    // 22. Close modal + reset selection.
    // 23. Other handlers update search/filter/sort/page state.

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        setCurrentPage(1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleSortChange = (criteria) => {
        setSortCriteria(criteria);
        setCurrentPage(1); // Page reset: When filter changes, reset to page 1 to avoid empty pages
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);  
        // Automatcally move to the top to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll behavior: Smooth scroll to top when page changes for better UX
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };


    // const handleDismissError = () => {
    //     setIsErrorVisible(false);
    // };

    // 28. Then I applied Conditional rendering: Show loading state while data is fetching
    if (isLoading) {
        return <LoadingSpinner />; // I do a Early return while loading.
    }
    
    
    return ( 
        // Fragment: <> </> wraps multiple elements without adding extra DOM nodes
        <> 
            {/* Header - Component prop: Passes handleSearch function to Header component */} 
            <Header onSearch={handleSearch} /> 
            
            <div className="text-white px-12 py-6 flex w-full gap-5"> 
                {/* Error Display */} 
                {error && ( 
                    <ErrorDisplay 
                        message={`Failed to load podcasts: ${error}`} 
                    />
                )}
                
                {/* Podcast Modal 
                    - Props passed:
                        - podcastId: Which podcast to display
                        - isOpen: Controls modal visibility
                        - onClose: Function to call when modal should close
                        - allPodcasts: Data source to find podcast details
                */} 
                <PodcastModal 
                    podcastId={selectedPodcastId} 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    allPodcasts={allPodcasts} 
                />

                <div className="w-full flex flex-col gap-8"> 
                    {/* Render error or grid for all podcasts */} 
                    {allPodcasts && allPodcasts.length > 0 ? (
                        <div>
                            <h2 className="font-bold text-2xl mb-2">
                                {searchTerm ? `Search Results for "${searchTerm}"` : 'Podcasts'}
                                    {filteredAndSortedPodcasts.length !== allPodcasts.length && (
                                        <span className="text-gray-400 text-lg ml-2">
                                            ({filteredAndSortedPodcasts.length} of {allPodcasts.length})
                                        </span>
                                    )}
                            </h2>
                            
                            {/* Drop down filters and sorter */} 
                            <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-start md:gap-3 md:mb-12"> 
                                <GenreFilter onGenreChange={handleGenreChange} /> 
                                <Sorter onSortChange={handleSortChange} /> 
                            </div> 
                            
                            {/* Handling empty results */} 
                            {searchTerm && filteredAndSortedPodcasts.length === 0 && ( 
                                <div className="text-center py-8"> 
                                    <p className="text-gray-400 text-lg"> 
                                        No podcasts found matching "<span className="text-white">{searchTerm}</span>" 
                                    </p> 
                                    <button onClick={() => setSearchTerm('')} className="mt-2 text-[#9A7B4F] hover:text-[#b3b3b3] transition-colors" > 
                                        Clear search 
                                    </button> 
                                </div> 
                            )} 
                            
                            {/* Grid
                                - Props:
                                - podcasts: Only current page's podcasts
                                - onPodcastSelect: Click handler for podcast selection
                            */}
                            <PodcastGrid 
                                podcasts={paginationData.currentCards} 
                                onPodcastSelect={handlePodcastSelect} 
                            /> 
                                    
                            {/* Pagination Component 
                                - Conditional rendering: Only show pagination if multiple pages exist
                                - Pagination props: All data needed for pagination component to render correctly
                            */} 
                            {paginationData.totalPages > 1 && ( 
                                <Pagination 
                                    currentPage={paginationData.currentPage} 
                                    totalPages={paginationData.totalPages} 
                                    totalPosts={paginationData.totalPodcasts} 
                                    postsPerPage={postsPerPage} 
                                    onPageChange={handlePageChange} 
                                /> )} 
                        </div>
                    ) : ( 
                        <p className="text-gray-400">No podcasts found</p>
                    )} 
                </div> 
            </div> 
        </> 
    ); 
}; 

export default Home;