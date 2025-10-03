// 1. I start off by Importing the global list of genres from a local data.js file.
// - Each genre likely has an id and title.
import { genres } from "../../../data.js";

/**
 * This component builds and renders a podcast card with image, title, genres, seasons, and last updated date.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.podcast - The podcast object 
 * @param {string} props.podcast.id - Unique id
 * @param {string} props.podcast.title - Title
 * @param {string} props.podcast.image - URL of the podcast image
 * @param {string[]} [props.podcast.genres] - genre IDs in an array
 * @param {number} [props.podcast.seasons] - Number of seasons 
 * @param {string} props.podcast.updated - Date
 *
 * @returns {JSX.Element} A styled podcast card with metadata and genres.
 */

// 2. Then I Defined a functional React component naming PodcastCard.
// Accepts props:
// - podcast: object containing podcast details.
// - onPodcastSelect: callback triggered when a card is clicked.
const PodcastCard = ({ podcast, onPodcastSelect }) => {
    // 3. I then defined a state hook that would track how many days have passed since the podcast was last updated.
    // const [daysSinceUpdate, setDaysSinceUpdate] = useState(0);

    // 4. I then defined a side effect that calculates daysSinceUpdate.
    // - It would update whenever podcast.updated changes.
    // - Converts the date difference into days.
    // useEffect(() => {
    //     if (podcast.updated) {
    //     const updatedDate = new Date(podcast.updated);
    //     const currentDate = new Date();
    //     const timeDiff = currentDate.getTime() - updatedDate.getTime();
    //     setDaysSinceUpdate(Math.floor(timeDiff / (1000 * 3600 * 24)));
    //     }
    // }, [podcast.updated]);

    // 5. Utility function that converts a raw date string into a human-readable format
    const getFormattedDate = (dateString) => {
        const updatedDate = new Date(dateString);
        return updatedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });
    };

    // 6. Also defined a callback function or Event listener handleClick, called when the card is clicked.
    const handleClick = () => {
        if (onPodcastSelect) {  // 7. If onPodcastSelect is provided, it calls it with a simplified object (id, title, image).
        onPodcastSelect({
            id: podcast.id,
            title: podcast.title,
            image: podcast.image
        });
        }
    };

    // 8. I defined another Utility function that Maps the podcast’s genres (IDs) to their titles.
    const getGenreTitles = () => {
        // 9. it Uses the global genres dataset Imported above to find matches.
        if (!podcast.genres) return [];
        // 10. Returns an array of genre names
        return genres
            .filter(genre => podcast.genres.includes(genre.id))
            .map(genre => genre.title);
    };

    // 11. I then Call the above function and store the list of genre titles for rendering.
    const genreTitles = getGenreTitles();

    // 12. To Render the card container.
    return (
        // 13. Using TailwindCSS classes, I define size, padding, colors, hover effect, and rounded corners.
        <div 
            className="podcast-card min-w-[280px] max-w-[285px] max-h-[350px] flex flex-col p-5 gap-1 rounded-lg bg-[#282828] hover:bg-[#65350F] transition-colors cursor-pointer"
            // 14. Adds onClick={handleClick} so the entire card is clickable.
            onClick={handleClick}
        >
            {/* 15. Renders the podcast image/cover art with Fixed size with rounded corners. */}
            <img 
                src={podcast.image} 
                alt={podcast.title} 
                className="podcast-image rounded-md w-[240px] h-[190px] object-cover mb-2"
            />

            {/* 16. Displays the podcast title in bold, white text. truncate ensures long titles are cut off with an ellipsis. */}
            <div className="flex items-center justify-between">
                <h3 className="title font-semibold text-white truncate">{podcast.title}</h3>
            </div>

            {/* 17. Displays the season count with an icon. If podcast.seasons is missing, defaults to 0. */}
            <div className="flex items-center justify-start gap-2">
                <svg className="fill-[#b3b3b3]" xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 100.353 100.353">
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
                <span className="season-info text-sm text-[#b3b3b3] truncate">
                {podcast.seasons || 0} seasons
                </span>
            </div>

            {/* 18. Loops through genreTitles and renders each as a badge/tag.
                Example: Technology, Science, Business. Styled with background color and rounded edges. */}
            <div className="mb-1">
                <div className="flex flex-wrap gap-1">
                    {genreTitles.map((genre, index) => (
                        <span
                            key={index}
                            className="genre-tag bg-[#F4F4F4] rounded-[2px] w-fit px-1 text-sm text-[#121212] truncate"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>

            {/* 19. Shows the last updated date in a small, gray font. Uses getFormattedDate for readability. */}
            <p className="update-info text-sm text-[#b3b3b3] truncate">
                {getFormattedDate(podcast.updated)}
            </p>
        </div>
    ); // 20. Closes the card layout.
}; // 21. Ends the component definition.

export default PodcastCard; // 22. Exports the PodcastCard component as default for reuse in other parts of the app.