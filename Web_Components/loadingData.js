const podcastsContainer = document.getElementById('podcasts-container');
const genreFilter = document.getElementById('genre-filter');
const sortBy = document.getElementById('sort-by');

// Function to load podcast data
async function loadPodcastData() {
    const module = await import("./data.js"); // relative path
    return { podcasts: module.podcasts, genres: module.genres };
}

// Function to populate the genre filter dropdown
function populateGenreFilter(genres) {
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.title;
        genreFilter.appendChild(option);
    });
}

// Function to display podcasts
function displayPodcasts(podcasts, genres) {
    podcastsContainer.innerHTML = '';
    
    podcasts.forEach(podcast => {
        // Get genre names for this podcast
        const podcastGenres = genres
            .filter(genre => podcast.genres.includes(genre.id))
            .map(genre => genre.title);
        
        // Create the custom element
        const podcastElement = document.createElement('podcast-preview');
        podcastElement.id = podcast.id;
        podcastElement.setAttribute('image', podcast.image);
        podcastElement.setAttribute('title', podcast.title);
        podcastElement.setAttribute('genres', JSON.stringify(podcastGenres));
        podcastElement.setAttribute('seasons', podcast.seasons);
        podcastElement.setAttribute('updated', podcast.updated);
        podcastElement.setAttribute('likes', Math.floor(Math.random() * 200) + 50);
        
        podcastsContainer.appendChild(podcastElement);
    });
}

// Function to filter and sort podcasts
function filterAndSortPodcasts(podcasts, genres) {
    const selectedGenre = genreFilter.value;
    const sortCriteria = sortBy.value;
    
    // Filter podcasts by genre
    let filteredPodcasts = podcasts;
    if (selectedGenre !== 'all') {
        filteredPodcasts = podcasts.filter(podcast => 
            podcast.genres.includes(parseInt(selectedGenre))
        );
    }
    
    // Sort podcasts
    switch(sortCriteria) {
        case 'title':
            filteredPodcasts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'recent':
            filteredPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
            break;
        case 'seasons':
            filteredPodcasts.sort((a, b) => b.seasons - a.seasons);
            break;
    }
    
    // Display the filtered and sorted podcasts
    displayPodcasts(filteredPodcasts, genres);
}
