// Main application logic
document.addEventListener('DOMContentLoaded', async () => {
    let podcastsData = [];
    let genresData = [];
    
    try {
        // Load data from external files
        const data = await loadPodcastData();
        podcastsData = data.podcasts;
        genresData = data.genres;
    
        
        // Populate genre filter
        populateGenreFilter(genresData);
        
        // Display podcasts
        displayPodcasts(podcastsData, genresData);
        
        // Set up event listeners for filtering and sorting
        genreFilter.addEventListener('change', () => {
            filterAndSortPodcasts(podcastsData, genresData);
        });
        
        sortBy.addEventListener('change', () => {
            filterAndSortPodcasts(podcastsData, genresData);
        });
        
    } catch (error) {
        console.error('Error loading podcast data:', error);
    }
});

// Add event listeners to handle the custom events from podcast elements
document.addEventListener('podcastSelected', (e) => {
    console.log('Podcast selected:', e.detail);
    alert(`Selected podcast: ${e.detail.title}`);
});