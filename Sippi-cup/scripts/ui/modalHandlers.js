

import { podcasts, genres, seasons } from "../../data.js";

let currentPodcast = null;

// DOM elemets accessing
const podcastModal = document.getElementById('podcast-modal');
const cancelBtn = document.getElementById('cancel-btn');

// Using the SOLID Principles, I will break this Open modal function:
// 1. Find the Podcast from my data using selected Id
// 2. Mapp the Genres using thier ids
// 3. Mapp those Genres names to the selected Podcast
// 4. Format the Date
// 5. full in the text in the modal
// 6. Adding the image in the modal
// 7. Adding the Genres in the model
// 8. Adding the season-containters in the modal
// 9. Showing the modal
// 10. Main: Opening the modal after selecting the Podcast card


// // Open podcast modal with details
// export function openPodcastModal(podcastId) {
//     currentPodcast = podcasts.find(podcast => podcast.id === podcastId);
    
//     if (!currentPodcast) return;
    
//     // Get genre names for this podcast
//     const podcastGenres = genres.filter(genre => 
//         currentPodcast.genres.includes(genre.id)
//     ).map(genre => genre.title);
    
//     // Format the updated date
//     const updatedDate = new Date(currentPodcast.updated);
//     const formattedDate = updatedDate.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });
    
//     // Get seasons for this podcast
//     const podcastSeasons = seasons.find(season => season.id === podcastId);
    
//     // Populate modal with data - with null checks
//     const podTitle = document.getElementById('pod-title');
//     const podDesc = document.getElementById('pod-desc');
//     const podImage = document.getElementById('pod-image');
//     const lastUpdated = document.getElementById('last-updated-date');
    
//     if (podTitle) podTitle.textContent = currentPodcast.title;
//     if (podDesc) podDesc.textContent = currentPodcast.description;
//     if (podImage) {
//         podImage.src = currentPodcast.image;
//         podImage.alt = currentPodcast.title;
//     }
//     if (lastUpdated) lastUpdated.textContent = formattedDate;
    

//     const genreList = document.getElementById('genre-list');
//     if (genreList) {
//         genreList.innerHTML = '';
//         podcastGenres.forEach(genre => {
//             const genreButton = document.createElement('button');
//             genreButton.className = 'bg-[#F4F4F4] w-fit h-fit px-1 text-sm text-[#121212] truncate';
//             genreButton.textContent = genre;
//             genreList.appendChild(genreButton);
//         });
//     }
    

//     const seasonsContainer = document.getElementById('seasons-container');
//     if (seasonsContainer) {
//         seasonsContainer.innerHTML = '';
        
//         if (podcastSeasons && podcastSeasons.seasonDetails) {
//             podcastSeasons.seasonDetails.forEach(season => {
//                 const seasonElement = document.createElement('div');
//                 seasonElement.className = 'w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-400 [&>option:checked]:text-black mb-3';
//                 seasonElement.innerHTML = `
//                     <h4 class="block text-l font-medium text-[#fff] p-2">${season.title}</h4>
//                     <div class="flex items-center justify-between">
//                         <span class="text-sm font-medium text-[#b3b3b3] p-2">Season description</span>
//                         <span class="text-sm font-medium text-[#b3b3b3] p-2">${season.episodes} Episodes</span>
//                     </div>
//                 `;
//                 seasonsContainer.appendChild(seasonElement);
//             });
//         } else {
//             seasonsContainer.innerHTML = '<p class="text-[#b3b3b3]">No season information available</p>';
//         }
//     }
    
//     // Show the modal
//     if (podcastModal) {
//         podcastModal.classList.remove('hidden');
//     }
// }

// 1. Find the Podcast from my data using selected Id

/**
 * Finds a podcast by its ID
 * @param {string} id - The ID of the podcast to find
 * @returns {Object} The podcast object if found, undefined otherwise
 */
function getPodcastById(id) {
    return podcasts.find(podcast => podcast.id === id);
}

// 2. Mapp the Genres using thier ids

/**
 * Gets genre names for a specific podcast
 * @param {Object} podcast - The podcast object
 * @returns {string[]} Array of genre names
 */
function getGenresByPodcast(podcast) {
    return genres.filter(genre => podcast.genres.includes(genre.id))
                 .map(genre => genre.title);
}

// 3. Mapp those Genres names to the selected Podcast

/**
 * Finds seasons for a specific podcast
 * @param {string} id - The ID of the podcast
 * @returns {Object} Seasons data if found, undefined otherwise
 */
function getSeasonsByPodcastId(id) {
    return seasons.find(season => season.id === id);
}

// 4. Format the Date

/**
 * Formats a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
function getFormattedDate(dateString) {
    const updatedDate = new Date(dateString);
    return updatedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 5. full in the text in the modal

/**
 * Updates the text content of a DOM element
 * @param {string} id - The ID of the element to update
 * @param {string} text - The text content to set
 */
function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}


// 6. Adding the image in the modal

/**
 * Updates the source and alt attributes of an image element
 * @param {string} id - The ID of the image element
 * @param {string} src - The image source URL
 * @param {string} alt - The alt text for the image
 * @returns {}
 */
function updateImageElement(id, src, alt) {
    const element = document.getElementById(id);
    if (element) {
        element.src = src;
        element.alt = alt;
    }
}


// 7. Adding the Genres in the model

/**
 * Populates the genre list in the modal with genre buttons
 * @param {Array} genresList - Array of genre names
 * @returns {}
 */
function populateGenreList(genresList) {
    const genreList = document.getElementById('genre-list');
    if (genreList) {
        genreList.innerHTML = '';
        genresList.forEach(genre => {
            const genreButton = document.createElement('button');
            genreButton.className = 'dark:bg-[#F4F4F4] bg-[#b3b3b3] bg- w-fit h-fit px-1 text-sm text-[#121212] truncate';
            genreButton.textContent = genre;
            genreList.appendChild(genreButton);
        });
    }
}

// 8. Adding the season-containters in the modal

/**
 * Populates the seasons list in the modal with season information
 * @param {Object} seasonsData - Seasons data object
 * @returns {}
 */
function populateSeasonList(seasonsData) {
    const seasonsContainer = document.getElementById('seasons-container');
    if (seasonsContainer) {
        seasonsContainer.innerHTML = '';
        
        if (seasonsData && seasonsData.seasonDetails) {
            seasonsData.seasonDetails.forEach(season => {
                const seasonElement = document.createElement('div');
                seasonElement.className = 'w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-400 [&>option:checked]:text-black mb-3';
                seasonElement.innerHTML = `
                    <h4 class="block text-l font-medium text-black dark:text-[#fff] p-2">${season.title}</h4>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-[#121212] dark:text-[#b3b3b3] p-2">Season description</span>
                        <span class="text-sm font-medium text-[#121212] dark:text-[#b3b3b3] p-2">${season.episodes} Episodes</span>
                    </div>
                `;
                seasonsContainer.appendChild(seasonElement);
            });
        } else {
            seasonsContainer.innerHTML = '<p class="text-[#121212] dark:text-[#b3b3b3]">No season information available</p>';
        }
    }
}

// 9. Showing the modal
function showPodcastModal() {
    if (podcastModal) {
        podcastModal.classList.remove('hidden');
    }
}

// Close modal function
function closePodcastModal() {
    if (podcastModal) {
        podcastModal.classList.add('hidden');
    }
}

// 10. Main: Opening the modal after selecting the Podcast card

/**
 * The Main function to open and populate the podcast modal
 * @param {string} podcastId - The ID of the podcast to display
 * @returns {}
 */
export function openPodcastModal(podcastId) {
    const podcast = getPodcastById(podcastId);
    if (!podcast) return;
    
    const podcastGenres = getGenresByPodcast(podcast);
    const formattedDate = getFormattedDate(podcast.updated);
    const podcastSeasons = getSeasonsByPodcastId(podcastId);
    
    // Update modal content
    updateElementText('pod-title', podcast.title);
    updateElementText('pod-desc', podcast.description);
    updateImageElement('pod-image', podcast.image, podcast.title);
    updateElementText('last-updated-date', formattedDate);
    populateGenreList(podcastGenres);
    populateSeasonList(podcastSeasons);
    
    // Show the modal
    showPodcastModal();
}




// Setup event listener for the modal interaction

/**
 * Sets up event listeners for the modal (close button and backdrop click)
 * 
 */
function setupEventListeners() {
    // Only add event listener if cancelBtn exists
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePodcastModal);
    }
    
    // Only add event listener if podcastModal exists
    if (podcastModal) {
        podcastModal.addEventListener('click', (e) => {
            if (e.target === podcastModal) {
                closePodcastModal();
            }
        });
    }
}

// Initialize modal handlers
export function initModalHandlers() {
    setupEventListeners();
}

export { setupEventListeners };