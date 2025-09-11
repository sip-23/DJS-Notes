import { podcasts, genres } from "../../data.js"
import { openPodcastModal } from './modalHandlers.js';

// DOM elements accessing
const podcastsContainer = document.getElementById('podcasts-container');


// Create podcast card element
function createPodcastElement(podcast) {
    const podcastElement = document.createElement('div');
    podcastElement.className = 'min-w-[280px] max-h-[350px] flex flex-col hover:bg-[#65350F] p-5 gap-1 rounded-lg bg-[#282828] transition-colors cursor-pointer';
    podcastElement.setAttribute('data-id', podcast.id);
    
    // Get genre names for this podcast
    const podcastGenres = genres.filter(genre => 
        podcast.genres.includes(genre.id)
    ).map(genre => genre.title);
    
    // Calculate days since last update
    const updatedDate = new Date(podcast.updated);
    const currentDate = new Date();
    const daysSinceUpdate = Math.floor((currentDate - updatedDate) / (1000 * 60 * 60 * 24));
    
    podcastElement.innerHTML = `
        <img src="${podcast.image}" alt="${podcast.title}" class="rounded-md mb-4 w-[240px] h-[190px] object-cover">
        <div class="flex items-center justify-between">
            <h3 class="font-semibold text-white truncate">${podcast.title}</h3>
            <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px" height="12px" viewBox="0 -2.5 21 21" version="1.1">
                    <title>love [#1489]</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="#b3b3b3" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-99.000000, -362.000000)" fill="#b3b3b3">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <path d="M55.5929644,215.348992 C55.0175653,215.814817 54.2783665,216.071721 53.5108177,216.071721 C52.7443189,216.071721 52.0030201,215.815817 51.4045211,215.334997 C47.6308271,212.307129 45.2284309,210.70073 45.1034811,207.405962 C44.9722313,203.919267 48.9832249,202.644743 51.442321,205.509672 C51.9400202,206.088455 52.687619,206.420331 53.4940177,206.420331 C54.3077664,206.420331 55.0606152,206.084457 55.5593644,205.498676 C57.9649106,202.67973 62.083004,203.880281 61.8950543,207.507924 C61.7270546,210.734717 59.2322586,212.401094 55.5929644,215.348992 M53.9066671,204.31012 C53.8037672,204.431075 53.6483675,204.492052 53.4940177,204.492052 C53.342818,204.492052 53.1926682,204.433074 53.0918684,204.316118 C49.3717243,199.982739 42.8029348,202.140932 43.0045345,207.472937 C43.1651842,211.71635 46.3235792,213.819564 50.0426732,216.803448 C51.0370217,217.601149 52.2739197,218 53.5108177,218 C54.7508657,218 55.9898637,217.599150 56.9821122,216.795451 C60.6602563,213.815565 63.7787513,211.726346 63.991901,207.59889 C64.2754005,202.147929 57.6173611,199.958748 53.9066671,204.31012" id="love-[#1489]"></path>
                            </g>
                        </g>
                    </g>
                </svg>
                <span class="font-medium text-white text-[13px]">75</span>  
            </div>
        </div>
        <div class="flex items-center justify-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#b3b3b3" width="12px" height="12px" viewBox="0 0 100.353 100.353" id="Layer_1" version="1.1" xml:space="preserve">
                <g>
                    <path d="M32.286,42.441h-9.762c-0.829,0-1.5,0.671-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.829,0,1.5-0.672,1.5-1.5v-9.762C33.786,43.113,33.115,42.441,32.286,42.441z M30.786,52.203h-6.762v-6.762h6.762V52.203z"/>
                    <path d="M55.054,42.441h-9.762c-0.829,0-1.5,0.671-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5v-9.762C56.554,43.113,55.882,42.441,55.054,42.441z M53.554,52.203h-6.762v-6.762h6.762V52.203z"/>
                    <path d="M77.12,42.441h-9.762c-0.828,0-1.5,0.671-1.5,1.5v9.762c0,0.828,0.672,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5v-9.762C78.62,43.113,77.948,42.441,77.12,42.441z M75.62,52.203h-6.762v-6.762h6.762V52.203z"/>
                    <path d="M32.286,64.677h-9.762c-0.829,0-1.5,0.672-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.829,0,1.5-0.672,1.5-1.5v-9.762C33.786,65.349,33.115,64.677,32.286,64.677z M30.786,74.439h-6.762v-6.762h6.762V74.439z"/>
                    <path d="M55.054,64.677h-9.762c-0.829,0-1.5,0.672-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5v-9.762C56.554,65.349,55.882,64.677,55.054,64.677z M53.554,74.439h-6.762v-6.762h6.762V74.439z"/>
                    <path d="M77.12,64.677h-9.762c-0.828,0-1.5,0.672-1.5,1.5v9.762c0,0.828,0.672,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5v-9.762C78.62,65.349,77.948,64.677,77.12,64.677z M75.62,74.439h-6.762v-6.762h6.762V74.439z"/>
                    <path d="M89,13.394h-9.907c-0.013,0-0.024,0.003-0.037,0.004V11.4c0-3.268-2.658-5.926-5.926-5.926s-5.926,2.659-5.926,5.926v1.994H56.041V11.4c0-3.268-2.658-5.926-5.926-5.926s-5.926,2.659-5.926,5.926v1.994H33.025V11.4c0-3.268-2.658-5.926-5.926-5.926s-5.926,2.659-5.926,5.926v1.995c-0.005,0-0.01-0.001-0.015-0.001h-9.905c-0.829,0-1.5,0.671-1.5,1.5V92.64c0,0.828,0.671,1.5,1.5,1.5H89c0.828,0,1.5-0.672,1.5-1.5V14.894C90.5,14.065,89.828,13.394,89,13.394z M70.204,11.4c0-1.614,1.312-2.926,2.926-2.926s2.926,1.312,2.926,2.926v8.277c0,1.613-1.312,2.926-2.926,2.926s-2.926-1.312-2.926-2.926V11.4zM50.115,8.474c1.613,0,2.926,1.312,2.926,2.926v8.277c0,1.613-1.312,2.926-2.926,2.926c-1.614,0-2.926-1.312-2.926-2.926v-4.643c0.004-0.047,0.014-0.092,0.014-0.141s-0.01-0.094-0.014-0.141V11.4C47.189,9.786,48.501,8.474,50.115,8.474z M24.173,11.4c0-1.614,1.312-2.926,2.926-2.926c1.613,0,2.926,1.312,2.926,2.926v8.277c0,1.613-1.312,2.926-2.926,2.926c-1.614,0-2.926-1.312-2.926-2.926V11.4z M87.5,91.14H12.753V16.394h8.405c0.005,0,0.01-0.001,0.015-0.001v3.285c0,3.268,2.659,5.926,5.926,5.926s5.926-2.658,5.926-5.926v-3.283h11.164v3.283c0,3.268,2.659,5.926,5.926,5.926s5.926-2.658,5.926-5.926v-3.283h11.163v3.283c0,3.268,2.658,5.926,5.926,5.926s5.926-2.658,5.926-5.926V16.39c0.013,0,0.024,0.004,0.037,0.004H87.5V91.14z"/>
                </g>
            </svg>
            <span class="text-sm text-[#b3b3b3] truncate">${podcast.seasons} seasons</span>
        </div>
        <div class="flex flex-wrap items-start gap-1">
            ${podcastGenres.map(genre => 
                `<button class="bg-[#F4F4F4] w-fit h-fit px-1 text-sm text-[#121212] truncate">${genre}</button>`
            ).join('')}
        </div>
        <p class="text-sm text-[#b3b3b3] truncate">Updated ${daysSinceUpdate} days ago</p>
    `;
    
    // Add click event to open modal
    podcastElement.addEventListener('click', () => {
        openPodcastModal(podcast.id);
    });
    
    return podcastElement;
}

// Show all podcasts
function showAllPodcasts() {
    podcastsContainer.innerHTML = '';
    
    podcasts.forEach(podcast => {
        const podcastElement = createPodcastElement(podcast);
        podcastsContainer.appendChild(podcastElement);
    });
}

function setupEventListeners() {
    // Event delegation for podcast cards
    podcastsContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.podcast-card');
        if (card) {
            const podcastId = card.getAttribute('data-id');
            openPodcastModal(podcastId);
        }
    });
}

// Export functions
export { showAllPodcasts, createPodcastElement };

import { podcasts, genres, seasons } from "../../data.js";

let currentPodcast = null;

// DOM elemets accessing
const podcastModal = document.getElementById('podcast-modal');
const cancelBtn = document.getElementById('cancel-btn');

// Open podcast modal with details
export function openPodcastModal(podcastId) {
    currentPodcast = podcasts.find(podcast => podcast.id === podcastId);
    
    if (!currentPodcast) return;
    
    // Get genre names for this podcast
    const podcastGenres = genres.filter(genre => 
        currentPodcast.genres.includes(genre.id)
    ).map(genre => genre.title);
    
    // Format the updated date
    const updatedDate = new Date(currentPodcast.updated);
    const formattedDate = updatedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get seasons for this podcast
    const podcastSeasons = seasons.find(season => season.id === podcastId);
    
    // Populate modal with data - with null checks
    const podTitle = document.getElementById('pod-title');
    const podDesc = document.getElementById('pod-desc');
    const podImage = document.getElementById('pod-image');
    const lastUpdated = document.getElementById('last-updated-date');
    
    if (podTitle) podTitle.textContent = currentPodcast.title;
    if (podDesc) podDesc.textContent = currentPodcast.description;
    if (podImage) {
        podImage.src = currentPodcast.image;
        podImage.alt = currentPodcast.title;
    }
    if (lastUpdated) lastUpdated.textContent = formattedDate;
    

    const genreList = document.getElementById('genre-list');
    if (genreList) {
        genreList.innerHTML = '';
        podcastGenres.forEach(genre => {
            const genreButton = document.createElement('button');
            genreButton.className = 'bg-[#F4F4F4] w-fit h-fit px-1 text-sm text-[#121212] truncate';
            genreButton.textContent = genre;
            genreList.appendChild(genreButton);
        });
    }
    

    const seasonsContainer = document.getElementById('seasons-container');
    if (seasonsContainer) {
        seasonsContainer.innerHTML = '';
        
        if (podcastSeasons && podcastSeasons.seasonDetails) {
            podcastSeasons.seasonDetails.forEach(season => {
                const seasonElement = document.createElement('div');
                seasonElement.className = 'w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-400 [&>option:checked]:text-black mb-3';
                seasonElement.innerHTML = `
                    <h4 class="block text-l font-medium text-[#fff] p-2">${season.title}</h4>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-[#b3b3b3] p-2">Season description</span>
                        <span class="text-sm font-medium text-[#b3b3b3] p-2">${season.episodes} Episodes</span>
                    </div>
                `;
                seasonsContainer.appendChild(seasonElement);
            });
        } else {
            seasonsContainer.innerHTML = '<p class="text-[#b3b3b3]">No season information available</p>';
        }
    }
    
    // Show the modal
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


// Setup event listeners
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

// now initialisng modal handles
function initModalhandlers() {
    setupEventListeners();
}

export { openPodcastModal, closePodcastModal, initModalhandlers, setupEventListeners};

import { showAllPodcasts, setupEventListeners } from './scripts/ui/renderCard.js';
import { initModalHandlers } from './scripts/ui/modalHandlers.js';

// Initialize the application
function init() {
    showAllPodcasts();
    setupEventListeners();
    initModalHandlers();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// ---------------------------------------------------------- SOLID Principles---------------------------------------------------------------- //

// Data

export const podcasts = [
  {
    id: "10716",
    title: "Something Was Wrong",
    description:
      "Something Was Wrong is an Iris Award-winning true-crime docuseries about the discovery, trauma, and recovery from shocking life events and abusive relationships.",
    seasons: 14,
    image:
      "https://content.production.cdn.art19.com/images/cc/e5/0a/08/cce50a08-d77d-490e-8c68-17725541b0ca/9dcebd4019d57b9551799479fa226e2a79026be5e2743c7aef19eac53532a29d66954da6e8dbdda8219b059a59c0abe6dba6049892b10dfb2f25ed90d6fe8d9a.jpeg",
    genres: [1, 2],
    updated: "2022-11-03T07:00:00.000Z",
  },
  {
    id: "5675",
    title: "This Is Actually Happening",
    description:
      "What if your mother left to follow a cult… or you woke up in a morgue… or if your boat got caught in a storm and began to sink -- what would you do?   This is Actually Happening brings you extraordinary true stories of life-changing events told by the people who lived them. From a man who finds out a celebrity crush isn’t who she seems to a woman stranded in a Mexican desert fighting to survive, these stories will have you on the edge of your seat waiting to hear what happens next. New episodes come out every Tuesday for free. Listen 1-week early and to exclusive past episodes - all ad-free - with Wondery+ or Amazon Music with a Prime membership or Amazon Music Unlimited subscription.",
    seasons: 12,
    image:
      "https://content.production.cdn.art19.com/images/5a/4f/d4/19/5a4fd419-11af-4270-b31c-2c7ed2f563a5/bc913bc926be23d04c9a4d29a829269a753be3d2612dad91f7e92ba4618fefc5c8802af29a1d32b3261eb03f83613e2535e3c574469b0cb510c32cd8d94cfaa1.png",
    genres: [2],
    updated: "2022-11-01T10:00:00.000Z",
  }]

export const genres = [
  {
    id: 1,
    title: "Personal Growth",
    description:
      "Looking to improve yourself and reach your full potential? Look no further than our collection of personal growth podcasts! Our curated selection features a wide range of experts and thought leaders sharing their insights and strategies on everything from goal setting and productivity to mindfulness and self-care. Whether you're looking to advance your career, improve your relationships, or simply live a happier and more fulfilling life, our podcasts offer practical, actionable advice to help you achieve your goals.",
    shows: ["10716", "10276", "6756", "10660"],
  },
  {
    id: 2,
    title: "Investigative Journalism",
    description:
      "Looking for a collection of podcasts that will keep you on the edge of your seat? Look no further than our selection of investigative journalism podcasts! These shows feature in-depth reporting and in-depth analysis of some of the most important and intriguing stories of our time. From breaking news to long-form investigations, these podcasts have it all. Whether you're a news junkie or just looking for something to keep you informed and engaged, these podcasts are the perfect choice. ",
    shows: [
      "10716",
      "5675",
      "10539",
      "9177",
      "8860",
      "5012",
      "9054",
      "7654",
      "8256",
      "8291",
      "5718",
      "5276",
      "5964",
      "6465",
      "5320",
      "6451",
      "5692",
      "6430",
    ],
  }]

export const seasons = [
  {
    id: "10716",
    seasonDetails: [
      {
        title: "Season 1",
        episodes: 10,
      },
      {
        title: "Season 2",
        episodes: 8,
      },
      {
        title: "Season 3",
        episodes: 9,
      },
      {
        title: "Season 4",
        episodes: 7,
      },
      {
        title: "Season 5",
        episodes: 10,
      },
      {
        title: "Season 6",
        episodes: 7,
      },
      {
        title: "Season 7",
        episodes: 6,
      },
      {
        title: "Season 8",
        episodes: 6,
      },
      {
        title: "Season 9",
        episodes: 9,
      },
      {
        title: "Season 10",
        episodes: 10,
      },
      {
        title: "Season 11",
        episodes: 10,
      },
      {
        title: "Season 12",
        episodes: 6,
      },
      {
        title: "Season 13",
        episodes: 10,
      },
      {
        title: "Season 14",
        episodes: 4,
      },
    ],
  },
  {
    id: "5675",
    seasonDetails: [
      {
        title: "Season 1",
        episodes: 10,
      },
      {
        title: "Season 2",
        episodes: 10,
      },
      {
        title: "Season 3",
        episodes: 10,
      },
      {
        title: "Season 4",
        episodes: 10,
      },
      {
        title: "Season 5",
        episodes: 10,
      },
      {
        title: "Season 6",
        episodes: 10,
      },
      {
        title: "Season 7",
        episodes: 10,
      },
      {
        title: "Season 8",
        episodes: 10,
      },
      {
        title: "Season 9",
        episodes: 10,
      },
      {
        title: "Season 10",
        episodes: 10,
      },
      {
        title: "Season 11",
        episodes: 10,
      },
      {
        title: "Season 12",
        episodes: 10,
      },
    ],
  }]



// Programming Paradigm:
//      - Functional Programming: Heavy use of pure functions, immutability, and function composition
//      - Modular Design: Code is organized into focused, reusable modules
//      - Factory Functions: Used for creating DOM elements with specific behavior

// SOLID Principles Applied:
//      - Single Responsibility: Each function has a single, clear purpose
//      - Open/Closed: Functions can be extended without modification (e.g., adding new card styles)
//      - Liskov Substitution: Functions can be replaced with alternatives that follow the same interface
//      - Interface Segregation: Functions have focused, specific interfaces
//      - Dependency Inversion: High-level modules depend on abstractions, not concrete implementations

// Design Patterns Identified:
//      - Factory Pattern: For creating DOM elements
//      - Facade Pattern: openPodcastModal provides a simple interface to complex functionality
//      - Module Pattern: Code organized into logical modules with clear exports
//      - Observer Pattern: Event listeners for user interactions

// ---- Single Responsibility Principle (SRP) ----  Each class/function should have only one reason to change //

import { podcasts, genres } from "../../data.js"
import { openPodcastModal } from './modalHandlers.js';

// DOM elements accessing
const podcastsContainer = document.getElementById('podcasts-container');

// Utility functions with single responsibilities
function calculateDaysSinceUpdate(updatedDate) {
    const updated = new Date(updatedDate);
    const current = new Date();
    return Math.floor((current - updated) / (1000 * 60 * 60 * 24));
}

/**
 * Finds a podcast by its ID
 * Single Responsibility Principle (SRP): Only responsible for finding a podcast by ID
 * Open/Closed Principle (OCP): Can be extended with different search strategies without modifying existing code
 * @param {string} id - The ID of the podcast to find
 * @returns {Object|undefined} The podcast object if found, undefined otherwise
 */
function getPodcastById(id) {
    return podcasts.find(podcast => podcast.id === id);
}
// 1. Accepts a string id representing the podcast ID to search for
// 2. Then it Uses the find() method to locate a podcast with matching ID
// - Iterates through the podcasts array and returns the first podcast where podcast.id === id evaluates to true
//      - Returns the first element in an array that satisfies a testing function
// 3. Then it Returns the podcast object if found, or undefined if not found


/**
 * Gets genre names for a specific podcast
 * Functional Programming: Uses pure functions (no side effects), array methods, and transformation pipelines
 * Single Responsibility Principle (SRP): This function has one job - to convert podcast genre IDs to genre names
 * Dependency Inversion Principle (DIP): It depends on the abstract concept of "a podcast with genres" rather than a specific implementation
 * @param {Object} podcast - The podcast object
 * @returns {string[]} Array of genre names
 */
function getPodcastGenres(podcast) {
    return genres.filter(genre => podcast.genres.includes(genre.id))
                 .map(genre => genre.title);
}
// 1. Accepts a podcast object that has a genres property containing genre IDs
// Podcast = keys_Prop{id, title, description, seasons, image, genres: [1, 2], updated}
// 2. Then it takes the global genres array
// genres = [keys_Prop{id, title, description, shows}]
// 3. Then I used the filter() method: Filters the global genres array to find genres that match the podcast's genre IDs.
// - Iterates through each item in the genres array and keeps only those where the *callback function* returns true
//      - Callback function: genre => podcast.genres.includes(genre.id) 
//          - Checks if the current genre's ID exists in the podcast's genres array
//          - Creates a new array with only the elements that pass a test.
//      - includes() method: Checks if an array contains a specific value
//          - Returns true if genre.id is found in podcast.genres, 
//          - Returns false otherwise
// 4. Then the I used the map() method: Transforms the genre objects into just their title strings
// - Creates a new array by transforming each element in the original array
// - Iterates through each filtered genre object and extracts only the title property
//      - Retuning a ["Personal Growth", "Investigative Journalism"]



function createCardElement() {
    const element = document.createElement('div');
    element.className = 'min-w-[280px] max-h-[350px] flex flex-col hover:bg-[#65350F] p-5 gap-1 rounded-lg bg-[#282828] transition-colors cursor-pointer';
    return element;
}

function applyCardStyling(element) {
    // This could be extended if you need more complex styling logic
    element.classList.add('podcast-card');
}

function buildCardHTML(podcast, podcastGenres, daysSinceUpdate) {
    return `
        <img src="${podcast.image}" alt="${podcast.title}" class="rounded-md mb-4 w-[240px] h-[190px] object-cover">
        <div class="flex items-center justify-between">
            <h3 class="font-semibold text-white truncate">${podcast.title}</h3>
            <div class="flex items-center gap-1">
                <!-- Love icon SVG -->
                <span class="font-medium text-white text-[13px]">75</span>  
            </div>
        </div>
        <div class="flex items-center justify-start gap-2">
            <!-- Calendar icon SVG -->
            <span class="text-sm text-[#b3b3b3] truncate">${podcast.seasons} seasons</span>
        </div>
        <div class="flex flex-wrap items-start gap-1">
            ${podcastGenres.map(genre => 
                `<button class="bg-[#F4F4F4] w-fit h-fit px-1 text-sm text-[#121212] truncate">${genre}</button>`
            ).join('')}
        </div>
        <p class="text-sm text-[#b3b3b3] truncate">Updated ${daysSinceUpdate} days ago</p>
    `;
}

/**
 * Creates a complete podcast card element with content and events
 * This is a Factory Function - it creates and returns a new object (DOM element) with specific properties and behavior.
 * Single Responsibility Principle (SRP): Coordinates the creation of a podcast card but delegates specific tasks to other functions
 * Dependency Inversion Principle (DIP): Depends on abstractions (function interfaces) rather than concrete implementations
 * @param {Object} podcast - The podcast object
 * @returns {HTMLElement} The complete podcast card element
 */
function createPodcastElement(podcast) {
    const podcastElement = createCardElement();
    applyCardStyling(podcastElement);
    podcastElement.setAttribute('data-id', podcast.id);
    
    const podcastGenres = getPodcastGenres(podcast);
    const daysSinceUpdate = calculateDaysSinceUpdate(podcast.updated);
    
    podcastElement.innerHTML = buildCardHTML(podcast, podcastGenres, daysSinceUpdate);
    
    // Add click event to open modal
    podcastElement.addEventListener('click', () => {
        openPodcastModal(podcast.id);
    });
    
    return podcastElement;
}
// 1. Accepts a complete podcast object
// 2. Creates a base card element using the createCardElement() function
// 3. Then uses the applyCardStyling() function which takes the created base card element and Applies additional styling.
//      - This returns the created base card element with styling.
// 4. Sets a data attribute for identification on the created styled base card element. (<div class="" data-id="">...</div>)
// 5. Then using the getPodcastGenres() function, it accepts the the Podcast object and related global genres data and ...
// 6. Then using the calculateDaysSinceUpdate() function, it accepts the update info from the Podbast object and ...
// 6. Then takes the Updated-styled-base-card-element and Builds and inserts HTML content ...
// 7. It then Adds click event handler
// 8. And Returns a fully constructed DOM element ready for insertion



// Clear container with single responsibility
function clearPodcastsContainer() {
    podcastsContainer.innerHTML = '';
}

// Show all podcasts with single responsibility
function showAllPodcasts() {
    clearPodcastsContainer();
    
    podcasts.forEach(podcast => {
        const podcastElement = createPodcastElement(podcast);
        podcastsContainer.appendChild(podcastElement);
    });
}

function setupEventListeners() {
    // Event delegation for podcast cards
    podcastsContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.podcast-card');
        if (card) {
            const podcastId = card.getAttribute('data-id');
            openPodcastModal(podcastId);
        }
    });
}

// Export functions
export { showAllPodcasts, createPodcastElement, clearPodcastsContainer };

//--------------------------------------------------------------------------------------------

import { podcasts, genres, seasons } from "../../data.js";

let currentPodcast = null;

// DOM elements accessing
const podcastModal = document.getElementById('podcast-modal');
const cancelBtn = document.getElementById('cancel-btn');

// Data processing functions
function getCurrentPodcast(podcastId) {
    return podcasts.find(podcast => podcast.id === podcastId);
}

function getPodcastGenres(podcast) {
    return genres.filter(genre => podcast.genres.includes(genre.id))
                 .map(genre => genre.title);
}


/**
 * Formats a date string to a readable format
 * Single Responsibility: Only formats dates, doesn't handle DOM manipulation or other logic
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
// 1. Takes a date string (like "2022-11-03T07:00:00.000Z")
// 2. Then it Converts the string to a Date object using the Date() method.
//      - new Date(dateString): Creates a JavaScript Date object from the string
// 3. Formats it to a human-readable string using the .toLocalDateString()
//      - toLocaleDateString(): Converts the date to a locale-specific string
//          - 'en-US': Uses US English formatting
//          - year: 'numeric': Shows full year (2022)
//          - month: 'long': Shows full month name (November)
//          - day: 'numeric': Shows day as number (3)
//      - Returns a formatted date string (like "November 3, 2022")

function getPodcastSeasons(podcastId) {
    return seasons.find(season => season.id === podcastId);
}

/**
 * Updates the text content of a DOM element
 * Single Responsibility: Only updates text content of elements
 * Open/Closed: Can be extended to handle different types of text updates without modifying this function
 * @param {string} id - The ID of the element to update
 * @param {string} text - The text content to set
 */
function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}
// 1. This function accepts 
//      - id: The HTML ID of the element to update
//      - text: The new text content to set
// 2. Then, using document.getElementById(id): Finds the HTML element with the specified ID
// 3. If the element exists, updates its text content
//      - The if (element) check prevents errors if the element doesn't exist
//      - Using element.textContent = text: Sets the text content of the element (safer than innerHTML for text)
//  - No return value (void), but modifies the DOM


/**
 * Updates the source and alt attributes of an image element
 * Single Responsibility: Only updates image attributes
 * Has a focused interface for image-specific updates
 * @param {string} id - The ID of the image element
 * @param {string} src - The image source URL
 * @param {string} alt - The alt text for the image
 */
function updateImageElement(id, src, alt) {
    const element = document.getElementById(id);
    if (element) {
        element.src = src;
        element.alt = alt;
    }
}
// 1. This function accepts
//      - id: The HTML ID of the image element to update
//      - src: The new image source URL
//      - alt: The new alt text for accessibility
// 2. Then it Finds the image element with the specified ID
//      - If the element exists, updates its src and alt attributes using:
//          - element.src: The source URL of the image
//          - element.alt: The alternative text for screen readers and accessibility
// 3. No return value, but modifies the DOM


// DOM manipulation functions
function updateModalTitle(title) {
    const podTitle = document.getElementById('pod-title');
    if (podTitle) podTitle.textContent = title;
}

function updateModalDescription(description) {
    const podDesc = document.getElementById('pod-desc');
    if (podDesc) podDesc.textContent = description;
}

function updateModalImage(imageSrc, altText) {
    const podImage = document.getElementById('pod-image');
    if (podImage) {
        podImage.src = imageSrc;
        podImage.alt = altText;
    }
}

function updateLastUpdatedDate(date) {
    const lastUpdated = document.getElementById('last-updated-date');
    if (lastUpdated) lastUpdated.textContent = date;
}

/**
 * Populates the genre list in the modal with genre buttons
 * @param {Array} genresList - Array of genre names
 */
function populateGenres(genresList) {
    const genreList = document.getElementById('genre-list');
    if (genreList) {
        genreList.innerHTML = '';
        genresList.forEach(genre => {
            const genreButton = document.createElement('button');
            genreButton.className = 'bg-[#F4F4F4] w-fit h-fit px-1 text-sm text-[#121212] truncate';
            genreButton.textContent = genre;
            genreList.appendChild(genreButton);
        });
    }
}
// 1. Accepts genresList - Array of genre names 
//      - like ["Business", "News", "Technology"]
// 2. Finds the genre list container element
//      - Using getElementById('genre-list')
// 3. Using the innerHTML = '': Clears the container by setting its HTML to empty (Clears any existing content)
// 4. Using the .forEach() method, For each genre, creates a button element with appropriate styling.
//      - document.createElement('button'): Creates a new button element
// 5. Adds the button to the container
// 6. No return value, but modifies the DOM



function populateSeasons(seasonsData) {
    const seasonsContainer = document.getElementById('seasons-container');
    if (seasonsContainer) {
        seasonsContainer.innerHTML = '';
        
        if (seasonsData && seasonsData.seasonDetails) {
            seasonsData.seasonDetails.forEach(season => {
                const seasonElement = document.createElement('div');
                seasonElement.className = 'w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-400 [&>option:checked]:text-black mb-3';
                seasonElement.innerHTML = `
                    <h4 class="block text-l font-medium text-[#fff] p-2">${season.title}</h4>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-[#b3b3b3] p-2">Season description</span>
                        <span class="text-sm font-medium text-[#b3b3b3] p-2">${season.episodes} Episodes</span>
                    </div>
                `;
                seasonsContainer.appendChild(seasonElement);
            });
        } else {
            seasonsContainer.innerHTML = '<p class="text-[#b3b3b3]">No season information available</p>';
        }
    }
}

function showModal() {
    if (podcastModal) {
        podcastModal.classList.remove('hidden');
    }
}

/**
 * Main function to open and populate the podcast modal
 * This Function follows the Facade Pattern - it provides a simple interface to a complex subsystem (all the modal population logic).
 * Single Responsibility Principle (SRP): Coordinates the process of opening a modal but delegates details to specialized functions
 * Dependency Inversion Principle (DIP): Depends on function abstractions rather than concrete implementations
 * @param {string} podcastId - The ID of the podcast to display
 * @returns {void}
 */
export function openPodcastModal(podcastId) {
    currentPodcast = getCurrentPodcast(podcastId);
    
    if (!currentPodcast) return;
    
    const podcastGenres = getPodcastGenres(currentPodcast);
    const formattedDate = getFormattedDate(currentPodcast.updated);
    const podcastSeasons = getPodcastSeasons(podcastId);
    
    // Update modal content
    updateModalTitle(currentPodcast.title);
    updateModalDescription(currentPodcast.description);
    updateModalImage(currentPodcast.image, currentPodcast.title);
    updateLastUpdatedDate(formattedDate);
    populateGenres(podcastGenres);
    populateSeasons(podcastSeasons);
    
    // Show the modal
    showModal();
}
// 1. This function Accepts a podcast ID string
// 2. Retrieves podcast data by ID
// 3. Gets related data (genres, formatted date, seasons)
// 4. Updates various parts of the modal UI with the retrieved data
// 5. Displays the modal
// 6. Return Value: None (void)

// ---- Open/Closed Principle (OCP) ---- code should be open for extension but closed for modification //

// Create a configurable card builder
class PodcastCardBuilder {
    constructor(podcast, genres) {
        this.podcast = podcast;
        this.genres = genres;
        this.element = null;
    }
    
    createBaseElement() {
        this.element = document.createElement('div');
        this.element.className = 'min-w-[280px] max-h-[350px] flex flex-col hover:bg-[#65350F] p-5 gap-1 rounded-lg bg-[#282828] transition-colors cursor-pointer podcast-card';
        this.element.setAttribute('data-id', this.podcast.id);
        return this;
    }
    
    addImage() {
        const imgHTML = `<img src="${this.podcast.image}" alt="${this.podcast.title}" class="rounded-md mb-4 w-[240px] h-[190px] object-cover">`;
        this.element.innerHTML += imgHTML;
        return this;
    }
    
    addTitle() {
        const titleHTML = `
            <div class="flex items-center justify-between">
                <h3 class="font-semibold text-white truncate">${this.podcast.title}</h3>
                <div class="flex items-center gap-1">
                    <!-- Love icon SVG -->
                    <span class="font-medium text-white text-[13px]">75</span>  
                </div>
            </div>
        `;
        this.element.innerHTML += titleHTML;
        return this;
    }
    
    addSeasonsInfo() {
        const seasonsHTML = `
            <div class="flex items-center justify-start gap-2">
                <!-- Calendar icon SVG -->
                <span class="text-sm text-[#b3b3b3] truncate">${this.podcast.seasons} seasons</span>
            </div>
        `;
        this.element.innerHTML += seasonsHTML;
        return this;
    }
    
    addGenres() {
        const podcastGenres = this.genres.filter(genre => 
            this.podcast.genres.includes(genre.id)
        ).map(genre => genre.title);
        
        const genresHTML = `
            <div class="flex flex-wrap items-start gap-1">
                ${podcastGenres.map(genre => 
                    `<button class="bg-[#F4F4F4] w-fit h-fit px-1 text-sm text-[#121212] truncate">${genre}</button>`
                ).join('')}
            </div>
        `;
        this.element.innerHTML += genresHTML;
        return this;
    }
    
    addUpdateInfo() {
        const daysSinceUpdate = calculateDaysSinceUpdate(this.podcast.updated);
        const updateHTML = `<p class="text-sm text-[#b3b3b3] truncate">Updated ${daysSinceUpdate} days ago</p>`;
        this.element.innerHTML += updateHTML;
        return this;
    }
    
    addClickEvent() {
        this.element.addEventListener('click', () => {
            openPodcastModal(this.podcast.id);
        });
        return this;
    }
    
    build() {
        return this.element;
    }
}

// Updated createPodcastElement using the builder
function createPodcastElement(podcast) {
    return new PodcastCardBuilder(podcast, genres)
        .createBaseElement()
        .addImage()
        .addTitle()
        .addSeasonsInfo()
        .addGenres()
        .addUpdateInfo()
        .addClickEvent()
        .build();
}

// -------------------------------------------------------------------------------------------------------

import { podcasts, genres, seasons } from "../../data.js";

class PodcastModalHandler {
    constructor() {
        this.currentPodcast = null;
        this.podcastModal = document.getElementById('podcast-modal');
        this.cancelBtn = document.getElementById('cancel-btn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    // Data processing methods
    getCurrentPodcast(podcastId) {
        return podcasts.find(podcast => podcast.id === podcastId);
    }
    
    getPodcastGenres(podcast) {
        return genres.filter(genre => podcast.genres.includes(genre.id))
                     .map(genre => genre.title);
    }
    
    getFormattedDate(dateString) {
        const updatedDate = new Date(dateString);
        return updatedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    getPodcastSeasons(podcastId) {
        return seasons.find(season => season.id === podcastId);
    }
    
    // DOM manipulation methods (can be overridden by subclasses)
    updateModalTitle(title) {
        const podTitle = document.getElementById('pod-title');
        if (podTitle) podTitle.textContent = title;
    }
    
    updateModalDescription(description) {
        const podDesc = document.getElementById('pod-desc');
        if (podDesc) podDesc.textContent = description;
    }
    
    updateModalImage(imageSrc, altText) {
        const podImage = document.getElementById('pod-image');
        if (podImage) {
            podImage.src = imageSrc;
            podImage.alt = altText;
        }
    }
    
    updateLastUpdatedDate(date) {
        const lastUpdated = document.getElementById('last-updated-date');
        if (lastUpdated) lastUpdated.textContent = date;
    }
    
    populateGenres(genresList) {
        const genreList = document.getElementById('genre-list');
        if (genreList) {
            genreList.innerHTML = '';
            genresList.forEach(genre => {
                const genreButton = document.createElement('button');
                genreButton.className = 'bg-[#F4F4F4] w-fit h-fit px-1 text-sm text-[#121212] truncate';
                genreButton.textContent = genre;
                genreList.appendChild(genreButton);
            });
        }
    }
    
    populateSeasons(seasonsData) {
        const seasonsContainer = document.getElementById('seasons-container');
        if (seasonsContainer) {
            seasonsContainer.innerHTML = '';
            
            if (seasonsData && seasonsData.seasonDetails) {
                seasonsData.seasonDetails.forEach(season => {
                    const seasonElement = document.createElement('div');
                    seasonElement.className = 'w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-400 [&>option:checked]:text-black mb-3';
                    seasonElement.innerHTML = `
                        <h4 class="block text-l font-medium text-[#fff] p-2">${season.title}</h4>
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-[#b3b3b3] p-2">Season description</span>
                            <span class="text-sm font-medium text-[#b3b3b3] p-2">${season.episodes} Episodes</span>
                        </div>
                    `;
                    seasonsContainer.appendChild(seasonElement);
                });
            } else {
                seasonsContainer.innerHTML = '<p class="text-[#b3b3b3]">No season information available</p>';
            }
        }
    }
    
    showModal() {
        if (this.podcastModal) {
            this.podcastModal.classList.remove('hidden');
        }
    }
    
    closeModal() {
        if (this.podcastModal) {
            this.podcastModal.classList.add('hidden');
        }
    }
    
    // Main modal opening method
    openPodcastModal(podcastId) {
        this.currentPodcast = this.getCurrentPodcast(podcastId);
        
        if (!this.currentPodcast) return;
        
        const podcastGenres = this.getPodcastGenres(this.currentPodcast);
        const formattedDate = this.getFormattedDate(this.currentPodcast.updated);
        const podcastSeasons = this.getPodcastSeasons(podcastId);
        
        // Update modal content
        this.updateModalTitle(this.currentPodcast.title);
        this.updateModalDescription(this.currentPodcast.description);
        this.updateModalImage(this.currentPodcast.image, this.currentPodcast.title);
        this.updateLastUpdatedDate(formattedDate);
        this.populateGenres(podcastGenres);
        this.populateSeasons(podcastSeasons);
        
        // Show the modal
        this.showModal();
    }
    
    setupEventListeners() {
        // Only add event listener if cancelBtn exists
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Only add event listener if podcastModal exists
        if (this.podcastModal) {
            this.podcastModal.addEventListener('click', (e) => {
                if (e.target === this.podcastModal) {
                    this.closeModal();
                }
            });
        }
    }
}

// Create and export a singleton instance
const podcastModalHandler = new PodcastModalHandler();

// Export methods for external use
export const openPodcastModal = (podcastId) => podcastModalHandler.openPodcastModal(podcastId);
export const closePodcastModal = () => podcastModalHandler.closeModal();
export const initModalhandlers = () => {}; // Already initialized in constructor
export const setupEventListeners = () => {}; // Already initialized in constructor


// ---- Liskov Substitution Principle (LSP) ----- Objects should be replaceable with instances of their subtypes without altering correctness. //

// Create a base class for card creators
class CardCreator {
    constructor(container) {
        if (this.constructor === CardCreator) {
            throw new Error("Abstract classes can't be instantiated");
        }
        this.container = container;
    }
    
    createElement() {
        throw new Error("Method 'createElement()' must be implemented");
    }
    
    render() {
        throw new Error("Method 'render()' must be implemented");
    }
}

// Implement a specific card creator
class PodcastCardCreator extends CardCreator {
    constructor(container, podcasts, genres) {
        super(container);
        this.podcasts = podcasts;
        this.genres = genres;
    }
    
    createElement(podcast) {
        // Use our builder pattern here
        return new PodcastCardBuilder(podcast, this.genres)
            .createBaseElement()
            .addImage()
            .addTitle()
            .addSeasonsInfo()
            .addGenres()
            .addUpdateInfo()
            .addClickEvent()
            .build();
    }
    
    render() {
        this.container.innerHTML = '';
        
        this.podcasts.forEach(podcast => {
            const element = this.createElement(podcast);
            this.container.appendChild(element);
        });
    }
}

// Usage
const cardCreator = new PodcastCardCreator(podcastsContainer, podcasts, genres);

function showAllPodcasts() {
    cardCreator.render();
}


// ----- Interface Segregation Principle (ISP) ---- Clients shouldn't be forced to depend on interfaces they don't use. //
// Separate interfaces for different responsibilities
class CardElementBuilder {
    buildElement() {
        throw new Error("Method 'buildElement()' must be implemented");
    }
}

class CardDataProcessor {
    processData() {
        throw new Error("Method 'processData()' must be implemented");
    }
}

class CardEventManager {
    addEvents() {
        throw new Error("Method 'addEvents()' must be implemented");
    }
}

// Implement specific interfaces
class PodcastCardElementBuilder extends CardElementBuilder {
    buildElement(podcast) {
        const element = document.createElement('div');
        element.className = 'min-w-[280px] max-h-[350px] flex flex-col hover:bg-[#65350F] p-5 gap-1 rounded-lg bg-[#282828] transition-colors cursor-pointer podcast-card';
        element.setAttribute('data-id', podcast.id);
        return element;
    }
}

class PodcastCardDataProcessor extends CardDataProcessor {
    processData(podcast, genres) {
        const podcastGenres = genres.filter(genre => 
            podcast.genres.includes(genre.id)
        ).map(genre => genre.title);
        
        const daysSinceUpdate = calculateDaysSinceUpdate(podcast.updated);
        
        return {
            podcastGenres,
            daysSinceUpdate
        };
    }
}

class PodcastCardEventManager extends CardEventManager {
    addEvents(element, podcastId) {
        element.addEventListener('click', () => {
            openPodcastModal(podcastId);
        });
    }
}

// Composed card creator
class ComposedPodcastCardCreator {
    constructor(elementBuilder, dataProcessor, eventManager) {
        this.elementBuilder = elementBuilder;
        this.dataProcessor = dataProcessor;
        this.eventManager = eventManager;
    }
    
    createCard(podcast, genres) {
        const element = this.elementBuilder.buildElement(podcast);
        const processedData = this.dataProcessor.processData(podcast, genres);
        
        const html = buildCardHTML(podcast, processedData.podcastGenres, processedData.daysSinceUpdate);
        element.innerHTML = html;
        
        this.eventManager.addEvents(element, podcast.id);
        
        return element;
    }
}

// Usage
const elementBuilder = new PodcastCardElementBuilder();
const dataProcessor = new PodcastCardDataProcessor();
const eventManager = new PodcastCardEventManager();

const cardCreator = new ComposedPodcastCardCreator(elementBuilder, dataProcessor, eventManager);

function createPodcastElement(podcast) {
    return cardCreator.createCard(podcast, genres);
}

// ---- Dependency Inversion Principle (DIP) ---- Depend on abstractions, not concretions. //

// Define abstractions
class IPodcastService {
    getPodcasts() {
        throw new Error("Method 'getPodcasts()' must be implemented");
    }
}

class IGenreService {
    getGenres() {
        throw new Error("Method 'getGenres()' must be implemented");
    }
}

// Implement concrete services
class DataJsPodcastService extends IPodcastService {
    getPodcasts() {
        return podcasts; // From your data.js import
    }
}

class DataJsGenreService extends IGenreService {
    getGenres() {
        return genres; // From your data.js import
    }
}

// Card creator that depends on abstractions
class PodcastCardCreator {
    constructor(podcastService, genreService, modalHandler) {
        this.podcastService = podcastService;
        this.genreService = genreService;
        this.modalHandler = modalHandler;
    }
    
    createAllCards(container) {
        const podcasts = this.podcastService.getPodcasts();
        const genres = this.genreService.getGenres();
        
        container.innerHTML = '';
        
        podcasts.forEach(podcast => {
            const element = this.createCardElement(podcast, genres);
            container.appendChild(element);
        });
    }
    
    createCardElement(podcast, genres) {
        // Implementation using any of the patterns above
        const element = document.createElement('div');
        element.className = 'podcast-card';
        element.setAttribute('data-id', podcast.id);
        
        // Add content and events
        element.addEventListener('click', () => {
            this.modalHandler.openPodcastModal(podcast.id);
        });
        
        return element;
    }
}

// Usage
const podcastService = new DataJsPodcastService();
const genreService = new DataJsGenreService();
const modalHandler = { openPodcastModal }; // Your imported function

const cardCreator = new PodcastCardCreator(podcastService, genreService, modalHandler);

function showAllPodcasts() {
    cardCreator.createAllCards(podcastsContainer);
}

// ------------------------------------------------------------------------------------------------------------------------

// Define interfaces/abstractions
class IPodcastDataService {
    getPodcastById(id) {
        throw new Error("Method 'getPodcastById()' must be implemented");
    }
}

class IGenreDataService {
    getGenresByPodcast(podcast) {
        throw new Error("Method 'getGenresByPodcast()' must be implemented");
    }
}

class ISeasonDataService {
    getSeasonsByPodcastId(id) {
        throw new Error("Method 'getSeasonsByPodcastId()' must be implemented");
    }
}

// Implement concrete services
class DataJsPodcastService extends IPodcastDataService {
    getPodcastById(id) {
        return podcasts.find(podcast => podcast.id === id);
    }
}

class DataJsGenreService extends IGenreDataService {
    getGenresByPodcast(podcast) {
        return genres.filter(genre => podcast.genres.includes(genre.id))
                     .map(genre => genre.title);
    }
}

class DataJsSeasonService extends ISeasonDataService {
    getSeasonsByPodcastId(id) {
        return seasons.find(season => season.id === id);
    }
}

// Refactored modal handler that depends on abstractions
class PodcastModalHandler {
    constructor(podcastService, genreService, seasonService) {
        this.podcastService = podcastService;
        this.genreService = genreService;
        this.seasonService = seasonService;
        
        this.currentPodcast = null;
        this.podcastModal = document.getElementById('podcast-modal');
        this.cancelBtn = document.getElementById('cancel-btn');
        
        this.init();
    }
    
    // ... rest of the methods remain similar but use the injected services
    
    openPodcastModal(podcastId) {
        this.currentPodcast = this.podcastService.getPodcastById(podcastId);
        
        if (!this.currentPodcast) return;
        
        const podcastGenres = this.genreService.getGenresByPodcast(this.currentPodcast);
        const formattedDate = this.getFormattedDate(this.currentPodcast.updated);
        const podcastSeasons = this.seasonService.getSeasonsByPodcastId(podcastId);
        
        // Update modal content
        this.updateModalTitle(this.currentPodcast.title);
        this.updateModalDescription(this.currentPodcast.description);
        this.updateModalImage(this.currentPodcast.image, this.currentPodcast.title);
        this.updateLastUpdatedDate(formattedDate);
        this.populateGenres(podcastGenres);
        this.populateSeasons(podcastSeasons);
        
        // Show the modal
        this.showModal();
    }
    
    // ... other methods
}

// Create instances with dependency injection
const podcastService = new DataJsPodcastService();
const genreService = new DataJsGenreService();
const seasonService = new DataJsSeasonService();

const podcastModalHandler = new PodcastModalHandler(podcastService, genreService, seasonService);

// Export methods for external use
export const openPodcastModal = (podcastId) => podcastModalHandler.openPodcastModal(podcastId);
export const closePodcastModal = () => podcastModalHandler.closeModal();
export const initModalhandlers = () => {};
export const setupEventListeners = () => {};