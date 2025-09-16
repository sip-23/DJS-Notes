const podcastsContainer = document.getElementById('podcasts-container');
const genreFilter = document.getElementById('genre-filter');
const sortBy = document.getElementById('sort-by');

// Function to load podcast data
export async function loadPodcastData() {
    const module = await import("./data.js"); // relative path
    return { podcasts: module.podcasts, genres: module.genres };
}

export function populateGenreFilter(genres) {
  if (!genreFilter) return;
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.title;
    genreFilter.appendChild(option);
  });
}

// Function to populate the genre filter dropdown
export function displayPodcasts(podcasts, genres) {
  if (!podcastsContainer) {
    console.error("No #podcasts-container found in DOM");
    return;
  }

  podcastsContainer.innerHTML = "";

  podcasts.forEach((podcast) => {
    // Map genre IDs → titles
    const podcastGenres = genres
      .filter((g) => podcast.genres.includes(g.id))
      .map((g) => g.title);

    // Build card
    const card = document.createElement("div");
    card.className = "podcast-card cursor-pointer p-4 bg-[#282828] rounded-md";
    card.setAttribute("data-id", podcast.id);
    card.innerHTML = `
      <img src="${podcast.image}" alt="${podcast.title}" 
           class="w-full h-40 object-cover rounded-md mb-2">
      <h3 class="text-white text-lg font-semibold">${podcast.title}</h3>
      <p class="text-sm text-gray-400">${podcastGenres.join(", ")}</p>
    `;

    podcastsContainer.appendChild(card);
  });
}
