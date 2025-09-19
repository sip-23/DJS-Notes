import { showAllPodcasts, setupEventListeners } from './Components/renderCard.js';
import { initModalHandlers } from './Components/modalHandlers.js';
import { createGrid } from './views/createGrid.js';
import { generateGenreOptions, renderFilteredPodcastsByGenre } from "./Utilites/genreFilter.js"
import { initDateFilter } from "./Utilites/sortByUpdates.js";
import { updateButtonVisibility, scrollersEventListener } from "./Utilites/scrollableCarousel.js"

// Initialize the application
function init() {
    showAllPodcasts();
    setupEventListeners();
    initModalHandlers();
    createGrid();
    generateGenreOptions();
    renderFilteredPodcastsByGenre();
    initDateFilter();
    updateButtonVisibility();
    scrollersEventListener();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);