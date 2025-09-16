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