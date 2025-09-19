import { podcasts, genres } from "../data.js"
import { openPodcastModal } from './modalHandlers.js';

// DOM elements accessing
const podcastsContainer = document.getElementById('podcasts-container');

// Using the Single Responsibility principle, I can break this down into the following:
// 1. Creating the div element for the card
// 2. Styling the Card
// 3. Adding id for each card
// 4. Calculating days for last updated (used for filtering)

// 1. Creating the div element for the card

/**
 * Creates a card element with styling
 * @returns {HTMLElement} The created div element
 */
function createCardElement() {
    const element = document.createElement('div');
    element.className = 'min-w-[280px] max-w-[285px] max-h-[350px] flex flex-col hover:bg-[#65350F] p-5 gap-1 rounded-lg bg-[#282828] transition-colors cursor-pointer';
    return element;
}


// 2. Styling the Card

/**
 * Implements additional styling to a card element
 * @param {HTMLElement} element - The card element to style
 * @returns {}
 */
function applyCardStyling(element) {
    // This could be extended if you need more complex styling logic
    element.classList.add('podcast-card');
}

// 2. Styling the Card

/**
 * Builds the HTML content for a podcast card
 * @param {Object} podcast - The podcast object
 * @param {Array} podcastGenres - Array of genre names
 * @param {number} daysSinceUpdate - Number of days since last update
 * @returns {string} HTML string for the card content
 */
function buildCardHTML(podcast, podcastGenres, daysSinceUpdate) {
    return `
        <img src="${podcast.image}" alt="${podcast.title}" class="rounded-md mb-4 w-[240px] h-[190px] object-cover">
        <div class="flex items-center justify-between">
            <h3 class="font-semibold text-white truncate">${podcast.title}</h3>
            <div class="flex items-center gap-1">
                <svg class="fill-[#b3b3b3]" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px" height="12px" viewBox="0 -2.5 21 21" version="1.1">
                <title>love [#1489]</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-99.000000, -362.000000)">
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                            <path d="M55.5929644,215.348992 C55.0175653,215.814817 54.2783665,216.071721 53.5108177,216.071721 C52.7443189,216.071721 52.0030201,215.815817 51.4045211,215.334997 C47.6308271,212.307129 45.2284309,210.70073 45.1034811,207.405962 C44.9722313,203.919267 48.9832249,202.644743 51.442321,205.509672 C51.9400202,206.088455 52.687619,206.420331 53.4940177,206.420331 C54.3077664,206.420331 55.0606152,206.084457 55.5593644,205.498676 C57.9649106,202.67973 62.083004,203.880281 61.8950543,207.507924 C61.7270546,210.734717 59.2322586,212.401094 55.5929644,215.348992 M53.9066671,204.31012 C53.8037672,204.431075 53.6483675,204.492052 53.4940177,204.492052 C53.342818,204.492052 53.1926682,204.433074 53.0918684,204.316118 C49.3717243,199.982739 42.8029348,202.140932 43.0045345,207.472937 C43.1651842,211.71635 46.3235792,213.819564 50.0426732,216.803448 C51.0370217,217.601149 52.2739197,218 53.5108177,218 C54.7508657,218 55.9898637,217.59915 56.9821122,216.795451 C60.6602563,213.815565 63.7787513,211.726346 63.991901,207.59889 C64.2754005,202.147929 57.6173611,199.958748 53.9066671,204.31012" id="love-[#1489]"></path>
                        </g>
                    </g>
                </g>
                </svg>
                <span class="font-medium text-white text-[13px]">75</span>  
            </div>
        </div>
        <div class="flex items-center justify-start gap-2">
            <svg class="fill-[#b3b3b3]" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px" height="12px" viewBox="0 0 100.353 100.353" id="Layer_1" version="1.1" xml:space="preserve">
                <g>
                    <path d="M32.286,42.441h-9.762c-0.829,0-1.5,0.671-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.829,0,1.5-0.672,1.5-1.5   v-9.762C33.786,43.113,33.115,42.441,32.286,42.441z M30.786,52.203h-6.762v-6.762h6.762V52.203z"/>
                    <path d="M55.054,42.441h-9.762c-0.829,0-1.5,0.671-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5   v-9.762C56.554,43.113,55.882,42.441,55.054,42.441z M53.554,52.203h-6.762v-6.762h6.762V52.203z"/>
                    <path d="M77.12,42.441h-9.762c-0.828,0-1.5,0.671-1.5,1.5v9.762c0,0.828,0.672,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5v-9.762   C78.62,43.113,77.948,42.441,77.12,42.441z M75.62,52.203h-6.762v-6.762h6.762V52.203z"/>
                    <path d="M32.286,64.677h-9.762c-0.829,0-1.5,0.672-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.829,0,1.5-0.672,1.5-1.5   v-9.762C33.786,65.349,33.115,64.677,32.286,64.677z M30.786,74.439h-6.762v-6.762h6.762V74.439z"/>
                    <path d="M55.054,64.677h-9.762c-0.829,0-1.5,0.672-1.5,1.5v9.762c0,0.828,0.671,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5   v-9.762C56.554,65.349,55.882,64.677,55.054,64.677z M53.554,74.439h-6.762v-6.762h6.762V74.439z"/>
                    <path d="M77.12,64.677h-9.762c-0.828,0-1.5,0.672-1.5,1.5v9.762c0,0.828,0.672,1.5,1.5,1.5h9.762c0.828,0,1.5-0.672,1.5-1.5v-9.762   C78.62,65.349,77.948,64.677,77.12,64.677z M75.62,74.439h-6.762v-6.762h6.762V74.439z"/>
                    <path d="M89,13.394h-9.907c-0.013,0-0.024,0.003-0.037,0.004V11.4c0-3.268-2.658-5.926-5.926-5.926s-5.926,2.659-5.926,5.926v1.994   H56.041V11.4c0-3.268-2.658-5.926-5.926-5.926s-5.926,2.659-5.926,5.926v1.994H33.025V11.4c0-3.268-2.658-5.926-5.926-5.926   s-5.926,2.659-5.926,5.926v1.995c-0.005,0-0.01-0.001-0.015-0.001h-9.905c-0.829,0-1.5,0.671-1.5,1.5V92.64   c0,0.828,0.671,1.5,1.5,1.5H89c0.828,0,1.5-0.672,1.5-1.5V14.894C90.5,14.065,89.828,13.394,89,13.394z M70.204,11.4   c0-1.614,1.312-2.926,2.926-2.926s2.926,1.312,2.926,2.926v8.277c0,1.613-1.312,2.926-2.926,2.926s-2.926-1.312-2.926-2.926V11.4z    M50.115,8.474c1.613,0,2.926,1.312,2.926,2.926v8.277c0,1.613-1.312,2.926-2.926,2.926c-1.614,0-2.926-1.312-2.926-2.926v-4.643   c0.004-0.047,0.014-0.092,0.014-0.141s-0.01-0.094-0.014-0.141V11.4C47.189,9.786,48.501,8.474,50.115,8.474z M24.173,11.4   c0-1.614,1.312-2.926,2.926-2.926c1.613,0,2.926,1.312,2.926,2.926v8.277c0,1.613-1.312,2.926-2.926,2.926   c-1.614,0-2.926-1.312-2.926-2.926V11.4z M87.5,91.14H12.753V16.394h8.405c0.005,0,0.01-0.001,0.015-0.001v3.285   c0,3.268,2.659,5.926,5.926,5.926s5.926-2.658,5.926-5.926v-3.283h11.164v3.283c0,3.268,2.659,5.926,5.926,5.926   s5.926-2.658,5.926-5.926v-3.283h11.163v3.283c0,3.268,2.658,5.926,5.926,5.926s5.926-2.658,5.926-5.926V16.39   c0.013,0,0.024,0.004,0.037,0.004H87.5V91.14z"/>
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
}

// 3. mapping gnares to the podcast
function getPodcastGenres(podcast) {
    return genres.filter(genre => podcast.genres.includes(genre.id))
                 .map(genre => genre.title);
}


// 4. Calculating days for last updated (used for filtering later :))
function calculateDaysSinceUpdate(updatedDate) {
    const updated = new Date(updatedDate);
    const current = new Date();
    return Math.floor((current - updated) / (1000 * 60 * 60 * 24));
} 

// 5. Main: With this, I can then Then create the card using the above function:

/**
 * Creates a full podcast card element with content/information
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

// Now rendering the Card can be broken into this:
// 1. First clear out the hardcoded card on the DOM
// 2. Function that adds the Cards

// 1. First clear out the hardcoded card on the DOM
function clearPodcastsContainer() {
    podcastsContainer.innerHTML = '';
}

// 2. Function that adds all the Cards
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
export { showAllPodcasts, createPodcastElement, clearPodcastsContainer, setupEventListeners };