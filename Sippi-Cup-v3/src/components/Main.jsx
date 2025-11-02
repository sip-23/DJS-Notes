import { useState, useMemo } from "react"; 
import Header from "./Header";
import PodcastGrid from "../views/renderGrid";
import LoadingSpinner from "../utilities/loadingSpinner";
import ErrorDisplay from "../utilities/loadingError";
import { useFetchPodcasts } from "../utilities/fetchPodcasts";
import GenreFilter from "../utilities/genreFilter";
import Sorter from "../utilities/podcastSorter";
import Pagination from "../utilities/pagination";
import Sidebar from "./Sidebar";
import { useLayout } from "../layout/LayoutContext.jsx";
import HomeRenderRow from "../views/HomeRenderRow";

/**
 * Home Component
 * 
 * Main landing page of the podcast app.
 * @component
 */
const Home = () => {
    const [podcastsUrl] = useState("https://podcast-api.netlify.app");
    
    const { 
        isSidebarOpen, 
        isMobileSidebarOpen, 
        closeMobileSidebar 
    } = useLayout();
  
    // Fetch all podcasts
    const { 
        data: allPodcasts,
        isLoading, 
        error 
    } = useFetchPodcasts(podcastsUrl);

    // State for filtering, sorting and searching
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    // Filter, search and sort podcasts
    const filteredAndSortedPodcasts = useMemo(() => {
        if (!allPodcasts || allPodcasts.length === 0) return [];

        let processedPodcasts = allPodcasts;

        // Search
        if (searchTerm) {
            processedPodcasts = processedPodcasts.filter(podcast =>
                podcast.title && podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter
        if (selectedGenre !== 'all') {
            processedPodcasts = processedPodcasts.filter(podcast => 
                podcast.genres && podcast.genres.includes(parseInt(selectedGenre))
            );
        }

        // Sort
        const sortedPodcasts = [...processedPodcasts];

        switch (sortCriteria) {
            case 'title-az':
                sortedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-za':
                sortedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'recent':
                sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                break;
            case 'oldest':
                sortedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
                break;
            case 'seasons':
                sortedPodcasts.sort((a, b) => {
                    const seasonsA = a.seasons || 0;
                    const seasonsB = b.seasons || 0;
                    return seasonsB - seasonsA;
                });
                break;
            default:
                sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        }

        return sortedPodcasts;
    }, [allPodcasts, selectedGenre, sortCriteria, searchTerm]);

    // Pagination
    const paginationData = useMemo(() => {
        const totalPodcasts = filteredAndSortedPodcasts.length;
        const totalPages = Math.ceil(totalPodcasts / postsPerPage);

        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }

        const lastPodcastIndex = currentPage * postsPerPage;
        const firstPodcastIndex = lastPodcastIndex - postsPerPage;

        const currentCards = filteredAndSortedPodcasts.slice(firstPodcastIndex, lastPodcastIndex);

        return {
            currentCards,
            totalPages,
            currentPage: Math.min(currentPage, totalPages || 1),
            totalPodcasts
        };
    }, [filteredAndSortedPodcasts, currentPage, postsPerPage]);

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
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handlePodcastSelect = (podcast) => {
        console.log('Selected podcast:', podcast);
    };

    const { openMobileSidebar } = useLayout();

    const handleSidebarToggle = (isOpen) => {
        if (isOpen) {
            openMobileSidebar();
        } else {
            closeMobileSidebar();
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={`Failed to load podcasts: ${error}`} />;
    }
        
    return (
        <>
            <Header onSearch={handleSearch} />

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div 
                    className="xl:relative sm:fixed inset-0 dark:bg-[#1a1a1a] bg-[#F4F4F4] bg-opacity-50 z-30 lg:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Sidebar - Mobile/Tablet: Centered modal, Desktop: Normal sidebar */}
                <div className={`${isMobileSidebarOpen ? 'sm:relative inset-0 flex items-center justify-center z-40' : 'hidden'}`}>
                    <Sidebar />
                </div>
            
                {/* Main Content */}
                <div className={`main-content flex-1 w-full dark:text-white text-[#000] dark:bg-[#1a1a1a] bg-[#F4F4F4] p-4 lg:p-5 ${isSidebarOpen && window.innerWidth >= 767 ? 'xl:border-l xl:border-gray-300 xl:dark:border-[#333]' : ''}`}>
                    <div className="w-full flex flex-col gap-8">
                        {/* Welcome Section */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                                Welcome to Sippi-Cup Pod
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Discover your next favorite podcast from our curated collection
                            </p>
                        </div>

                        {/* Randomized Recommended Shows */}
                        {allPodcasts && allPodcasts.length > 0 && (
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                                    Recommended Shows
                                </h2>
                                <HomeRenderRow
                                    title="Discover Something New"
                                    allPodcasts={allPodcasts}
                                    onPodcastSelect={handlePodcastSelect}
                                />
                            </section>
                        )}

                        {/* All Podcasts Grid Section */}
                        {allPodcasts && allPodcasts.length > 0 ? (
                            <section>
                                <h2 className="font-bold text-2xl mb-4 lg:mb-2">
                                    {searchTerm ? `Search Results for "${searchTerm}"` : 'All Podcasts'}
                                    {filteredAndSortedPodcasts.length !== allPodcasts.length && (
                                        <span className="text-gray-400 text-lg ml-2">
                                            ({filteredAndSortedPodcasts.length} of {allPodcasts.length})
                                        </span>
                                    )}
                                </h2>

                                {/* Drop down filters and sorter */}
                                <div className="flex flex-col mb-6 lg:mb-12 md:flex-row md:items-center md:justify-start md:gap-3">
                                    <GenreFilter onGenreChange={handleGenreChange} />
                                    <Sorter onSortChange={handleSortChange} />
                                </div>

                                {/* Handling empty results */}
                                {searchTerm && filteredAndSortedPodcasts.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400 text-lg">
                                            No podcasts found matching "<span className="text-white">{searchTerm}</span>"
                                        </p>
                                        <button 
                                            onClick={clearSearch}
                                            className="mt-2 text-[#9A7B4F] hover:text-[#b3b3b3] transition-colors"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}

                                {/* Podcast Grid */}
                                {filteredAndSortedPodcasts.length > 0 && (
                                    <>
                                        <PodcastGrid 
                                            podcasts={paginationData.currentCards} 
                                            isSidebarOpen={isSidebarOpen}
                                        />
                                        
                                        {/* Pagination Component */}
                                        {paginationData.totalPages > 1 && (
                                            <Pagination 
                                                currentPage={paginationData.currentPage}
                                                totalPages={paginationData.totalPages}
                                                totalPosts={paginationData.totalPodcasts}
                                                postsPerPage={postsPerPage}
                                                onPageChange={handlePageChange}
                                            />
                                        )}
                                    </>
                                )}
                            </section>
                        ) : (
                            <p className="text-gray-400">No podcasts found</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;