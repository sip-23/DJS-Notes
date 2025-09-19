// Main application logic

// 1. Attaches an event listener that runs the provided async arrow function once the DOM is fully parsed
document.addEventListener('DOMContentLoaded', async () => {
    let podcastsData = [];   // 2. Declares a variable to hold the podcasts array. Initially empty.
    let genresData = [];    // 3. Declares a variable to hold genres metadata.

    try {                   // 4. try block to catch runtime errors from async operations below.
        // Load data
        const data = await loadPodcastData();  // 5. use await inside the callback - await makes async code read like sync code
        // 6. Calls loadPodcastData() and waits for its promise to resolve, storing the result in data.
        podcastsData = data.podcasts;
        genresData = data.genres;

        
        // 7. Calls a function that injects <option>s into the genre <select> element using genresData
        // Populating genre filter dropdown with all the possible filters
        populateGenreFilter(genresData);

        // 8. Renders podcast cards (or similar) into the DOM using the loaded data.
        // Displaying the podcasts
        displayPodcasts(podcastsData, genresData);

        // 9. Adds an event listener to the genre select control that runs when the selected option changes.
        // 
        Set up event listeners for filtering and sorting
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

















































import "./podcastModal.js";
import { loadPodcastData, populateGenreFilter, displayPodcasts } from "./loadingData.js";

document.addEventListener('DOMContentLoaded', async () => {
    let podcastsData = [];
    let genresData = [];

    try {
        // Load podcast data
        const data = await loadPodcastData();
        podcastsData = data.podcasts;
        genresData = data.genres;

        // Populate genre filter
        populateGenreFilter(genresData);

        // Add <podcast-modal> dynamically if not in HTML
        let modal = document.querySelector("podcast-modal");
        if (!modal) {
            modal = document.createElement("podcast-modal");
            document.body.appendChild(modal);
        }

        // Unified function to render podcasts and attach modal listeners
        function renderPodcasts(podcasts) {
            displayPodcasts(podcasts, genresData);

            // Attach click listener for modal
            document.querySelectorAll(".podcast-card").forEach(card => {
                card.addEventListener("click", () => {
                    const podcastId = card.getAttribute("data-id");
                    modal.open(podcastId);
                });
            });
        }

        // Initial render
        renderPodcasts(podcastsData);

        // Filter & sort with automatic re-render
        function handleFilterSort() {
            const selectedGenre = genreFilter.value;
            const sortCriteria = sortBy.value;

            let filtered = podcastsData;

            if (selectedGenre !== 'all') {
                filtered = filtered.filter(p => p.genres.includes(parseInt(selectedGenre)));
            }

            switch (sortCriteria) {
                case 'title':
                    filtered.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'recent':
                    filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                    break;
                case 'seasons':
                    filtered.sort((a, b) => b.seasons - a.seasons);
                    break;
            }

            renderPodcasts(filtered);
        }

        genreFilter.addEventListener('change', handleFilterSort);
        sortBy.addEventListener('change', handleFilterSort);

    } catch (error) {
        console.error('Error loading podcast data:', error);
    }
});