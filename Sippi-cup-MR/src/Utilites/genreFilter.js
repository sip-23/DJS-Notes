import { genres } from "../data.js"
import { podcasts } from  "../data.js"
import { createPodcastElement } from "../Components/renderCard.js"

const genreFilter = document.getElementById('genre-filter');
const podcastsContainer = document.getElementById('podcasts-container');

// Fill in dropdown options dynamically where options are extracted form data.js
function generateGenreOptions() {
    // Clear my hardcoded options
    genreFilter.innerHTML = '';
    
    // All Genres option to be the first and appearing option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Genres';
    allOption.className = 'bg-white text-[13px] font-medium text-gray-400 hover:bg-gray-900';
    genreFilter.appendChild(allOption);
    
    // Add genre options
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.title;
        option.className = 'bg-white text-[13px] font-medium text-gray-400 hover:bg-gray-900';
        genreFilter.appendChild(option);
    });
}

// Render podcasts based on selected genre
function renderFilteredPodcastsByGenre(selectedGenre = 'all') {
    // Clear the hardcoded elements from my container
    podcastsContainer.innerHTML = '';
    
    // Filter podcasts based on selected genre
    const filteredPodcasts = selectedGenre === 'all' 
        ? podcasts 
        : podcasts.filter(podcast => podcast.genres.includes(parseInt(selectedGenre)));
    
    // Render filtered podcasts
    filteredPodcasts.forEach(podcast => {
        const podcastElement = createPodcastElement(podcast);
        podcastsContainer.appendChild(podcastElement);
    });
}

// The event listener for genre filter change
genreFilter.addEventListener('change', (e) => {
    renderFilteredPodcastsByGenre(e.target.value);
});

export { generateGenreOptions, renderFilteredPodcastsByGenre };