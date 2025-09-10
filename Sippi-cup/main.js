import { showAllPodcasts, setupEventListeners } from './scripts/ui/renderCard.js';
import { initModalHandlers } from './scripts/ui/modalHandlers.js';
import { initSidebar } from './scripts/ui/sidebarMenu.js';
import { generateGenreOptions, renderFilteredPodcastsByGenre, initDateFilter } from "./scripts/utilities/catagoryFilters.js"
import { initAudioPlayer } from "./scripts/ui/audioPlayer.js";
import { themeToggleEventListener } from "./scripts/utilities/themeToggle.js"
import { scrollersEventListener, updateButtonVisibility } from "./scripts/utilities/scrollCards.js"

// Initialize the application
function init() {
    themeToggleEventListener();
    showAllPodcasts();
    setupEventListeners();
    initModalHandlers();
    initSidebar();
    generateGenreOptions();
    renderFilteredPodcastsByGenre();

    initDateFilter();

    initAudioPlayer();

    updateButtonVisibility();
    scrollersEventListener();
}



// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);