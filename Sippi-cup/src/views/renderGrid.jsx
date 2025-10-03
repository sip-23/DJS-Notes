// 1. I first Import the PodcastCard component, which renders individual podcast  card with respective details.
import PodcastCard from '../components/PodcastsCard';

/**
 * PodcastGrid component renders a responsive grid of PodcastCard components creating a grid layout.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object[]} props.podcasts - Array of podcast objects.
 * @param {string} props.podcasts[].id - Unique id.
 * @param {string} props.podcasts[].title - Podcast title.
 * @param {string} props.podcasts[].image - Podcast image URL.
 * @param {string[]} [props.podcasts[].genres] - Array of genre IDs
 * @param {number} [props.podcasts[].seasons] - Number of seasons.
 * @param {string} props.podcasts[].updated - Date string of last update.
 *
 * @returns {JSX.Element} A responsive grid of podcast cards or a message if no podcasts are found.
 */

// 2. Defines a functional component PodcastGrid.
// Props:
// - podcasts: an array of podcast objects.
// - onPodcastSelect: callback to handle when a podcast is clicked.

// 3. PodcastGrid will reuse PodcastsCard for multiple podcasts.
const PodcastGrid = ({ podcasts, onPodcastSelect }) => {
  // 4. check: If podcasts is missing or empty, it returns a fallback message. The message is centered and styled in gray.
  if (!podcasts || podcasts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No podcasts found
      </div>
    );
  }

  // 5. Main container for the grid.
  // - Uses TailwindCSS for layout:
  // --- flex flex-col items-center: default mobile layout → stacked vertically.
  // --- w-[90%] mx-auto: content takes 90% width, centered.
  // --- md:grid md:grid-cols-2: on medium screens → switches to a grid with 2 columns.
  // --- lg:grid-cols-3: on large screens → 3 columns.
  // --- xl:grid-cols-4: on extra-large screens → 4 columns.
  // --- gap-4: space between cards.
  return (
    <div className="flex flex-col items-center w-[90%] md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto">
      {/* Loops through the podcasts array with .map().
      - For each podcast, renders a PodcastCard.
      
      Passes:
      - key={podcast.id} → unique React key for performance.
      - podcast={podcast} → passes podcast details to the card.
      - onPodcastSelect={onPodcastSelect} → passes callback for click handling. */}
      {podcasts.map(podcast => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          onPodcastSelect={onPodcastSelect}
        />
      ))}
    </div>
  );
}; // Closes the container and returns the full grid layout.

export default PodcastGrid;
// Exports the component so it can be used elsewhere (e.g., homepage, search results, etc.).