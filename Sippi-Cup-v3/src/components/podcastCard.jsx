import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 

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
// 1. I start by Defining a functional React component named PodcastCard by declaring it as a constant arrow function.
// 2. It receives a single prop podcast, which contains podcast data
// Accepts props:
// - podcast: object containing podcast details.
const PodcastCard = ({ podcast }) => {
    // 3. Then I declared the navigate variable using useNavigate()
    // useNavigate() is a React Router hook that returns a function to programmatically navigate between routes (URLs).
    // Lets Think of it like window.location.href = ..., but within a single-page app that doesn’t reload.
    const navigate = useNavigate();
    // 4. I then declared the following states, Managed with / using useState() — a React Hook that creates a state variable and an updater function 
    // - I initialized the genreTitles state varaible as an empty array and handles the array of genre names
    // - I initialized the isLoadingGenres state varaible as a boolean false and Tracks whether genre data is being fetched.
    // --- Used to conditionally render loading spinners, disable buttons
    // - I initialized the favoritesCount state varaible as a numerical value = 0 and stores how many users (or how many times) this podcast has been favorited.
    // - I initialized the isFavorited state varaible as a boolean false and it check with a boolean — whether the current user has favorited this podcast.
    // --- These are local to this component.
    // - I then prefixed these updater function using set. Thes update this state after an action.
    // 5. I then preformed Array destructuring to create the varaible state and prefixed state updater function.
    const [genreTitles, setGenreTitles] = useState([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);

    // Fetch genre data from API
    // 6. I then Define an asynchronous helper function to fetch data for a single genre.
    // 7. This Accepts:
    // - genreId → the genre’s unique identifier.
    // - retries → how many times to retry fetching if it fails (default = 3).
    const fetchGenreData = async (genreId, retries = 3) => {
        // 8. Then I create a Retry loop, which Loops up to retries times to reattempt the fetch if it fails.
        for (let i = 0; i < retries; i++) {
            // 9. Using the the try-catch block, I intend for error handling and guaranteed cleanup semantics.
            // 10. In the Try Block, 
            try {
                // 11. I Try to fetch using The fetch() method, which performs an HTTP GET request to the given endpoint.
                // - This uses the browser fetch API returning a Promise resolved to a Response object.
                // - Await pauses the async function execution until the promise resolves, allowing the fetch to continue without timing out
                // - Non-blocking for the JS event loop
                // **NB**: fetch will reject the promise on network errors only; 
                // - HTTP error statuses (4xx/5xx) do not reject — you must check response.ok (see next line).
                const response = await fetch(`https://podcast-api.netlify.app/genre/${genreId}`);
                // 12. Then I Check if the response is not OK (status code not between 200–299).
                // - response.ok is a boolean (true for 2xx HTTP codes)
                if (!response.ok) {
                    // 13. If ok is false we explicitly throw a new Error. 
                    // - That transfers control to the catch block and then jumps to the catch block.
                    throw new Error(`Failed to fetch genre: ${response.status}`);
                }
                // 14. If ok is true (true for 2xx HTTP codes)
                // Parse JSON - Menaing it Converts the response body to JSON
                const genreData = await response.json();
                // 15. Return - This returns the converted response to the caller.
                return genreData;
            // 16. In the case where ok is false, control is transfered to the catch block (jumps to the catch block)
            } catch (err) {
                // 17. Within the scope of the catch error, I first Log a warning if an attempt fails.
                console.warn(`Attempt ${i + 1} failed for genre ${genreId}:`, err);
                // 18. Then I do a conditional if statement which varifies if our iteration is less then 3 (2), 
                // - If true, it means it’s the last attempt
                if (i === retries - 1) {
                    // 19. log an error and return null.
                    console.error(`All attempts failed for genre ${genreId}`);
                    return null;
                }
                // 20. Otherwise, Wait before retrying (exponential backoff)
                // 21. I then create a trick which pauses async execution.
                // 22. 1000 * (i+1) → delays increase progressively: 1s, 2s, 3s
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
        // 23. Finally return a null
        return null;
    };

    // 24. Then I Defined another async helper function that Fetch all genres associated with / for this podcast
    const fetchPodcastGenres = async () => {
        // 25. As a Safeguard, I then applied a conditional if statement that check if the Array object is not there or the length of the array is 0
        // - essentially if the podcast has no genres
        if (!podcast.genres || podcast.genres.length === 0) {
            // 26. Update the GenreTitles state variable to an empyty list
            setGenreTitles([]);
            return;
        }

        // 27. Else, If we to have Genre titles, Then we update the isloadingGenre state variable / indicator to true before the async operation begins.
        setIsLoadingGenres(true);
        
        // 28. Using the Try-Catch Block, In the Try:
        try {
            // 29. Using the .map() method, I create an array of promises for each genre fetch.
            const genrePromises = podcast.genres.map(genreId => 
                // 30. I then call the fetchGenreData defined function which accepts the Genre IDs
                fetchGenreData(genreId)
            );
            
            // 30. With the created array of promises, I then apply Promise.all().
            // - This runs them in parallel, not sequentially — faster overall.
            // 31. Then we store then into GenreResults variables
            const genreResults = await Promise.all(genrePromises);
            // 32. Now to get the titles themselves, We take our results variables
            // - Apply the filter() method to Filter out null results (failed fetches).
            // - Then I applied the Map() method to Map the remaining objects to their title field.
            const titles = genreResults
                .filter(genre => genre !== null)
                .map(genre => genre.title);
                // Then I set up another Helper function: To Get genre names from podcast.
                // - Here, I Cross-reference podcast.genres (array of IDs) with the global genres list.
                // - This then Maps IDs → genre titles.
                // Two array transformations:
                // Filtering genres global array to match only IDs inside podcast.genres.
                // Mapping filtered list to titles.
                // Uses array chaining and pure functional transformation — no mutation.
                // Returns a derived array, suitable for React rendering (.map() in JSX).
            
            // 33. After that, We update the GenreTitles state from an empty array to the array of titles
            setGenreTitles(titles);
        // 34. In the Catch Block, I then performed Error handling and cleanup
        } catch (err) {
            // 35. With the above in the Try Block scope fails, an error is capture and I also Log the errors on the console
            console.error('Error fetching podcast genres:', err);
            // 36. resets titles if necessary
            setGenreTitles([]);
        // 37. Then Finally turns off the loading flag regardless of success/failure In the Finally Block.
        } finally {
            setIsLoadingGenres(false);
        }
    };

    // 38. Using UseEffect, I Started a side effect which Runs when the component, using this hook, mounts or whenever listed dependencies changes.
    // - This Runs after the component mounts or when dependencies change.
    // - Calls fetchPodcastGenres() immediately.
    useEffect(() => {
        fetchPodcastGenres();
        
        // 39. Load favorites data from localStorage
        // - I applied the .getItem() method on our Global class LocalStorage which Retrieves stored favorite count for this specific podcast that is passed.
        const savedCount = localStorage.getItem(`favorites_${podcast.id}`);
        // 40. Using a Conditional if statement to check presence, If true:
        if (savedCount) {
            // 41. Converts from string to number
            // 42. An then I updates state to the converted Numerical value.
            setFavoritesCount(parseInt(savedCount));
        }
        
        // 43. To Check if user has favorited this podcast
        // - I access the browsers Local storage and retrieve associated values with the key of the object passed in as a string
        // - This returns the value as a string or null if key doesnt exhist
        // using: JSON.parse(), I take the JSON string, and parse it to convert it back to a JavaScript object or Array
        // - This will throw an error iif the string in not a valid JSON
        // **Note**: JSON.stringify() converts the object into a string so it can held in Local storage
        // 44. this then Loads array of favorite IDs.
        const userFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
        // 45. Then I check if current ID is in the parsed array of IDs
        // - If this podcast’s id is in the list (True), 
        // - Update or sets isFavorited to true.
        setIsFavorited(userFavorites.includes(podcast.id));
        // 46. Then I set the ID and the Genres to be my Dependencies (Dependency array)
        // This Re-runs effect if the podcast’s id or its genres array changes.
    }, [podcast.id, podcast.genres]);


    // 47. I then created another Helper function to Format last updated date
    // - Converts a raw date string (like "2024-05-23T00:00:00Z") into a readable format (“May 23, 2024”).
    // --- Input validation + graceful fallback.
    const getFormattedDate = (dateString) => {
        const updatedDate = new Date(dateString);
        // Uses JavaScript’s Date API to format in locale-aware style.
        // Avoids mutating the date — a pure deterministic function.
        // Uses toLocaleDateString() with format options.
        return updatedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    // ------ Would be a good candidate for memoization (useMemo) if performance ever mattered for large data.

    // 48. I then created a Navigation Handler
    // this Always navigate to detail page
    const handleClick = () => {
        // When the card is clicked, navigates to a route like /podcast/123.
        // This Triggers page transition in React Router.
        navigate(`/podcast/${podcast.id}`);
    };

    // 49. FAVORITE HANDLING
    const handleFavoriteClick = (e) => {
        // 50. Stops event bubbling (prevents parent click → avoids navigating away).
        // - Important: preventDefault() does not stop propagation (event bubbling). To stop propagation you'd call e.stopPropagation().
        e.stopPropagation();
        // this is a method that stops the event from propagating futher though the DOM tree. (Parent doesnt recieve the event)
        // It prevents the even from moving to the next phase of Propagation.
        // Event propagation: How do events work in the DOM
        // - When event occurs on an element, it doesnt just trigger on that one element - it travels through the DOM tree in 3 Phases:
        // 1. Capture Phase: Event travels from root down to target element.
        // 2. Target Phase: Event reaches the target element.
        // 3. Bubble Phase: Event bubbles up from taeget back to the root.
        
        // 51. Then I looked into Toggle favorite state
        // - If currently favorited → remove one. Otherwise → add one.
        const newCount = isFavorited ? favoritesCount - 1 : favoritesCount + 1;
        // Updates both states.
        setFavoritesCount(newCount);
        setIsFavorited(!isFavorited);
        
        // 52. Persist count: Update localStorage for the count
        // - Saves updated favorite count in persistent storage.
        localStorage.setItem(`favorites_${podcast.id}`, newCount.toString());
        
        // 53. Update user favorites array
        // - Loads entire favorites array.
        const userFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
        // 54. Then I can, I perform a conditional if Statement that check if Podcast is favourited?
        // - If true: This means the user is now clicking to un-favorite.
        if (isFavorited) {
            // 55. This filters for: 
            // Removes the podcast from favorites.
            const updatedFavorites = userFavorites.filter(fav => fav.podcastId !== podcast.id);
            // 56. Using JSON.stringify(), I convert the object into a string so it can held in Local storage
            // 57. setItem() this then Loads array of favorite IDs.
            localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
        // 58. If false: Then it means we are now likeing this Podcast and want to add it to our favorites.
        // - Therefore: Construct an object describing the podcast and adds it to favorites.
        } else {
            const favoriteData = {
                podcastId: podcast.id,
                podcastTitle: podcast.title,
                podcastImage: podcast.image,
                dateAdded: new Date().toISOString()
            };
            // Take the array of objects that we have in our local storage and update it with the newly constructed object data.
            userFavorites.push(favoriteData);
            // Saves the new array to localStorage.
            localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
        }
    };

    return (
        <div 
            className="podcast-card min-w-[280px] max-w-[285px] max-h-[350px] flex flex-col p-5 gap-1 rounded-lg hover:bg-[#b3b3b3] dark:hover:bg-[#65350F] dark:bg-[#282828] bg-white transition-colors cursor-pointer"
            onClick={handleClick}
        >
            <img 
                src={podcast.image} 
                alt={podcast.title} 
                className="podcast-image rounded-md w-[240px] h-[190px] object-cover mb-2"
            />

            <div className="flex items-center justify-between">
                <h3 className="title font-semibold dark:text-white text-black truncate">{podcast.title}</h3>
                <div className="flex items-center gap-1">
                    <button  // Implemented JSX opening tag for a button element
                        onClick={handleFavoriteClick}  // added the Event handler prop - when clicked, execute the handleFavoriteClick function
                        // I then implement a Ternary operator (rather Conditional Ternary Operator)
                        // - Syntax: condition ? expressionIfTrue : expressionIfFalse
                        // - How it works:
                        // --- isFavorited is evaluated as a boolean
                        // --- If true, returns 'fill-red-500'
                        // --- If false, returns 'fill-[#b3b3b3]'
                        // --- The result is **interpolated** into the template string
                        className={`${isFavorited ? 'fill-red-500' : 'fill-[#b3b3b3]'} hover:fill-red-400 transition-colors`}
                        // Implemted Dynamic className prop using:
                        // - Template literal (backticks) for string interpolation
                        // - Ternary operator for conditional classes 
                        // - Tailwind CSS classes for styling
                    >
                        <svg    // Implementing SVG JSX element representing a heart icon
                            className="w-5 h-5" 
                            fill="currentColor" // SVG attribute that inherits color from parent's CSS color
                            viewBox="0 0 24 24" // SVG attribute defining the coordinate system
                        >
                            <path  // SVG path element with drawing commands
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            /> 
                        </svg>
                    </button>
                    <span className="font-medium text-black dark:text-white text-[13px]">{favoritesCount}</span>  
                </div>
            </div>
            
            <div className="flex items-center justify-start gap-2">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="#b3b3b3" 
                    width="12px" 
                    height="12px" 
                    viewBox="0 0 100.353 100.353"
                >
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

            <div className="mb-1">
                {/* I then implement Ternary Operator for Conditional Rendering */}
                <div className="flex flex-wrap gap-1">
                    {isLoadingGenres ? (
                        // Syntax: condition ? expressionIfTrue : expressionIfFalse
                        // The ? here is part of the ternary operator used for conditional rendering of two different branches.
                        // - Structure:
                        // --- Condition: isLoadingGenres
                        // --- If true: Render loading span
                        <span className="genre-tag dark:bg-[#F4F4F4] bg-[#b3b3b3] w-fit h-fit px-1 text-sm dark:text-[#121212] text-[#ffffff] truncate">
                            Loading...
                        </span>
                        // --- If false: Execute genreTitles.map() to render genre tags
                    ) : (
                        // If Ternary operator condition is false, I apply Array mapping to transform data to JSX
                        genreTitles.map((genre, index) => (
                            <span
                                key={index}  // React key prop for list item identification (helps with reconciliation)
                                className="genre-tag dark:bg-[#F4F4F4] bg-[#b3b3b3] w-fit h-fit px-1 text-sm dark:text-[#121212] text-[#ffffff] truncate"
                            >
                                {genre}
                            </span>
                        ))
                    )}
                    {/* I then implement short-circuit evaluation */}
                    {!isLoadingGenres && genreTitles.length === 0 && (
                        // Using  logical AND operator (&&) for conditional rendering.
                        // - How it works:
                        // --- !isLoadingGenres && genreTitles.length === 0 - both conditions must be true
                        // --- If both are true, the JSX after && is rendered
                        // --- If any condition is false, React renders null (nothing)
                        // - Translation: "If NOT loading genres AND the genreTitles array is empty, then render the 'No genres' span"
                        <span className="genre-tag dark:bg-[#F4F4F4] bg-[#b3b3b3] w-fit h-fit px-1 text-sm dark:text-[#121212] text-[#ffffff] truncate">
                            No genres
                        </span>
                    )}
                </div>
            </div>

            <p className="update-info text-sm dark:text-[#b3b3b3] text-[#6D6D6D] truncate">
                {getFormattedDate(podcast.updated)}
            </p>
        </div>
    );
};

export default PodcastCard;


// Component implements a loading state pattern:
// 1. First, check if loading: isLoadingGenres ? ...
// 2. If not loading, check if empty: !isLoadingGenres && genreTitles.length === 0
// 3. Otherwise, render the data

// This creates three possible UI states:
// - Loading: Shows "Loading..."
// - Loaded but empty: Shows "No genres"
// - Loaded with data: Shows the actual genres

// TerminologyJSX Element: 
// - HTML-like syntax in JavaScript (<div>, <button>)
// - JSX Expression: JavaScript code inside {} in JSX
// - Prop: Attributes passed to JSX elements (onClick, className)
// - Ternary Operator: condition ? trueValue : falseValue
// - Logical AND Operator: && used for conditional rendering
// - Template Literal: String interpolation using backticks
// - Event Handler: Function executed on events (onClick, onChange)
// - Conditional Rendering: Showing/hiding JSX based on conditions