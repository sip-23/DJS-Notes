import { genres } from "../../data.js"
import { podcasts } from  "../../data.js"
import { createPodcastElement } from "../ui/renderCard.js"

const genreFilter = document.getElementById('genre-filter');
const podcastsContainer = document.getElementById('podcasts-container');
const podcastsContainerTwo = document.getElementById('podcasts-container2');
const noResultsMessage = document.getElementById('no-results');


// A function to generate the dropdown option dynamically
function generateGenreOptions() {
    // Clear existing options
    genreFilter.innerHTML = '';
    
    // Add "All Genres" option
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



// Function to render podcasts based on selected genre
function renderFilteredPodcastsByGenre(selectedGenre = 'all') {
    // Clear the container
    podcastsContainer.innerHTML = '';
    
    // Filter podcasts based on selected genre
    const filteredPodcasts = selectedGenre === 'all' 
        ? podcasts 
        : podcasts.filter(podcast => podcast.genres.includes(parseInt(selectedGenre)));
    
    // Show no results message if no podcasts match the filter
    if (filteredPodcasts.length === 0) {
        noResultsMessage.classList.remove('hidden');
        return;
    }
    
    // Hide no results message
    noResultsMessage.classList.add('hidden');
    
    // Render filtered podcasts
    filteredPodcasts.forEach(podcast => {
        const podcastElement = createPodcastElement(podcast);
        podcastsContainer.appendChild(podcastElement);
    });
}

// Event listener for genre filter change
genreFilter.addEventListener('change', (e) => {
    renderFilteredPodcastsByGenre(e.target.value);
});


// Function to sort podcasts by date
function sortPodcastsByDate(podcasts, order = 'desc') {
    return [...podcasts].sort((a, b) => {
        const dateA = new Date(a.updated);
        const dateB = new Date(b.updated);
        
        if (order === 'asc') {
            return dateA - dateB; // Oldest to newest
        } else {
            return dateB - dateA; // Newest to oldest (default)
        }
    });
}

// Function to render sorted podcasts
function renderSortedPodcasts(order = 'desc') {
    const podcastsContainerTwo = document.getElementById('podcasts-container2');
    if (!podcastsContainerTwo) {
        console.error('podcasts-container2 element not found');
        return;
    }
    
    // Clear the container
    podcastsContainerTwo.innerHTML = '';
    
    // Sort podcasts
    const sortedPodcasts = sortPodcastsByDate(podcasts, order);
    
    // Render sorted podcasts
    sortedPodcasts.forEach(podcast => {
        const podcastElement = createPodcastElement(podcast);
        podcastsContainerTwo.appendChild(podcastElement);
    });
}

// Function to create and render the date filter dropdown
function populateDateFilter() {
    const dateFilter = document.getElementById('updated-filter');
    if (!dateFilter) {
        console.error('Date filter element not found');
        return;
    }
    
    // Clear existing options
    dateFilter.innerHTML = '';
    
    // Create correct options
    const options = [
        { value: 'desc', text: 'Recently updated (newest first)' },
        { value: 'asc', text: 'Oldest first' }
    ];
    
    // Add options to select
    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.textContent = optionData.text;
        option.className = 'bg-white text-[13px] font-medium text-gray-400 hover:bg-gray-900';
        dateFilter.appendChild(option);
    });
    
    // Add event listener
    dateFilter.addEventListener('change', (e) => {
        renderSortedPodcasts(e.target.value);
    });
}


// Function to initialize the date filter
function initDateFilter(container) {
    populateDateFilter();
    renderSortedPodcasts()
}


export { generateGenreOptions, renderFilteredPodcastsByGenre, sortPodcastsByDate, renderSortedPodcasts, initDateFilter };
