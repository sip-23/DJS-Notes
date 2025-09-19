// 1. Start of by Getting DOM elements - Grabs references to elements already in the HTML
const podcastsContainer = document.getElementById('podcasts-container');
const genreFilter = document.getElementById('genre-filter');
const sortBy = document.getElementById('sort-by');

// 2. The this I created this Function to load podcast data
// Dynamic import (import()) to load data.js meaning the file is only loaded when needed.
// export → makes this function usable in other modules
export async function loadPodcastData() {
    const module = await import("./data.js"); // relative path
    return { podcasts: module.podcasts, genres: module.genres };
    // 3. Returns an object with { podcasts, genres }
}

// 4. Then I create a function that helps us to Populating genre filter dropdown
export function populateGenreFilter(genres) {
  if (!genreFilter) return;           // safety check in case the element is missing in the DOM.
  genres.forEach((genre) => {        // 5. Iterates through the list of genres.
    const option = document.createElement("option");  // 6. For each genre, creates an <option> tag, 
    option.value = genre.id;          // 7. sets its value (ID)
    option.textContent = genre.title;   // 8. sets its text (title)
    genreFilter.appendChild(option);  // 9. then Appends it to the <select> element.
  });
}

// 10. Then I created Displaying podcast cards function
export function displayPodcasts(podcasts, genres) {
  if (!podcastsContainer) {                                   // 11. safety check
    console.error("No #podcasts-container found in DOM");
    return;
  }

  podcastsContainer.innerHTML = "";  // 12. Clears out the container (innerHTML = "") before inserting new podcast cards.

  // 13. Loop through podcasts and build cards
  podcasts.forEach((podcast) => {   // 14. For each podcast, 
    // Map genre IDs → titles
    const podcastGenres = genres         // 15. looks at its genres property -array of genre IDs
      .filter((g) => podcast.genres.includes(g.id))   // 16. It checks if the IDs under investigation is matching to actual genre objects (filter)
      .map((g) => g.title);             // 17. then extracts just the titles (map).

    // 18. Create podcast card element | Build card
    const card = document.createElement("div");
    card.className = "podcast-card cursor-pointer p-4 bg-[#282828] rounded-md";
    card.setAttribute("data-id", podcast.id);
    card.innerHTML = `
      <img src="${podcast.image}" alt="${podcast.title}" 
           class="w-full h-40 object-cover rounded-md mb-2">
      <h3 class="text-white text-lg font-semibold">${podcast.title}</h3>
      <p class="text-sm text-gray-400">${podcastGenres.join(", ")}</p>
    `;

    podcastsContainer.appendChild(card);  // 19. Append card to container
  });
}
