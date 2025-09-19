import { podcasts } from  "../data.js"
import { createPodcastElement } from "../Components/renderCard.js"

function sortPodcastsByDate(podcasts, order = 'desc') {
    // sort all podcast according to date (spread operator)
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

// Render sorted podcasts
function renderSortedPodcasts(order = 'desc') {
    const podcastsContainerTwo = document.getElementById('podcastGrid');
    // Error handling abstraction
    if (!podcastsContainerTwo) {
        console.error('podcastGrid element not found');
        return;
    }
    
    // Clear hardcoded container
    podcastsContainerTwo.innerHTML = '';
    
    // Sort podcasts
    const sortedPodcasts = sortPodcastsByDate(podcasts, order);
    
    // Render sorted podcasts
    sortedPodcasts.forEach(podcast => {
        const podcastElement = createPodcastElement(podcast);
        podcastsContainerTwo.appendChild(podcastElement);
    });
}

// Creating and rendering the date filter dropdown
function populateDateFilter() {
    const dateFilter = document.getElementById('updated-filter');
    if (!dateFilter) {
        console.error('Date filter element not found');
        return;
    }
    
    // Clear existing options
    dateFilter.innerHTML = '';
    
    // Creating options
    const options = [
        { value: 'desc', text: 'Newest: Recently updated' },
        { value: 'asc', text: 'Oldest: GrandPa & GrandMa' }
    ];
    
    // Adding options to select from in dropdown
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


// Initialize the date filter
function initDateFilter(container) {
    populateDateFilter();
    renderSortedPodcasts()
}


export { sortPodcastsByDate, renderSortedPodcasts, initDateFilter };
