import { useState, useRef, useEffect, useMemo } from "react";
import PodcastCard from "../components/PodcastCard";
import { useLayout } from "../layout/LayoutContext.jsx"; 

// This is a more advanced React component that mixes UI logic, state-driven rendering, DOM manipulation via refs, and browser storage.

// 1. I start of by Defineing  a React functional component called HomeRenderRow
// - Takes three props:
// --- title: String label for this section (e.g., “Trending Now”).
// --- allPodcasts: Array of podcast objects available for display.
// --- onPodcastSelect: Callback triggered when a podcast is clicked.
const HomeRenderRow = ({ title, allPodcasts, onPodcastSelect }) => {
    // 2. for my REFERENCES & STATE, I first initialise scrollContainerRef using useRef() hook.
    // - useRef() gives you a persistent reference to a DOM element.
    // - it’s initialized to null and later attached to the scrollable container of podcast cards.
    // - Used to read or manipulate the DOM 
    // --- scrolling left
    // --- scrolling right
    const scrollContainerRef = useRef(null);
    // 3. Then I also initialise Scroll Buttons Visibility State
    // - These control whether left/right scroll buttons are visible.
    // - Initially:
    // --- Left button hidden (false)
    // --- Right button visible (true)
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    // 4. Sidebar State (Context)
    // Calls a custom hook, likely from React Context.
    const { isSidebarOpen } = useLayout();
    // - useLayout() gives layout-related global state — here, whether the sidebar is open.
    // --- Used to dynamically adjust scroll widths and visible card counts depending on screen space.

    // 5. Then I Generate randomized podcasts with session persistence
    // - useMemo() memoizes (caches) the computed list of podcasts.
    // --- This Prevents re-randomization unless dependencies (allPodcasts or title) change Ensuring stable order across renders for the same session.
    const randomizedPodcasts = useMemo(() => {
        // 6. I start with a **Defensive Check**
        // - This checks if no podcasts available, then return an empty array immediately to avoid errors.
        if (!allPodcasts || allPodcasts.length === 0) return [];
        
        // 7. Then I Get or create session key for persistence
        // - This helps Builds a unique key for session storage: "homepage_randomized_trending_now".
        const sessionKey = `homepage_randomized_${title.replace(/\s+/g, '_').toLowerCase()}`;
        // - Using string interpolation, I take the title and apply the .replace(/\s+/g, '_') method 
        // --- This replaces spaces with underscores.
        // - That sting i take and apply .toLowerCase()
        // --- This normalizes key format into all lower case

        // 8. Then I Check for Stored Order
        // sessionStorage can only store strings
        // --- When we originally stored the data, we used:
        // ------- JSON.stringify() to convert arrays/objects to strings
        // --- Now we need to reverse that process
        // This Looks in sessionStorage for a previously stored random order.
        // - Get data from browser's session storage using a specific key.
        // - Returns either:
        // --- A string if data exists
        // --- null if no data exists for that key
        const stored = sessionStorage.getItem(sessionKey);
        // 9. Using presence check to Check if Data Exists, I ask: If found:
        // - This Proceeds only if stored is truthy (not null, undefined, empty string)
        if (stored) {
            // 10. Parses JSON into an array of IDs, There Converting a JSON string retrieved from browsers session storage back into a JavaScript object/array
            // --- "[1, 2, 3, 4]" and turns it into [1, 2, 3, 4]
            // This Uses stored randomized order for this session
            const storedIds = JSON.parse(stored);
            // 11. Now to render the rendomness
            // Step A: storedIds.map(id => ...)
            // - storedIds is now an array of IDs (e.g., [101, 102, 103])
            // - .map() creates a new array by transforming each element
            // - This Reconstructs podcast objects in that saved order.
            // 12. Step B: allPodcasts.find(podcast => podcast.id === id)
            // - For each ID, search through allPodcasts array
            // - Find the podcast object where the id property matches the current ID
            // Returns:
            // - The podcast object if found
            // - undefined if no match found
            // 13. Filters out any missing ones (e.g., if data changed) wtih .filter(Boolean)
            // - Removes all falsy values from the array
            // - Specifically removes undefined values (from unmatched IDs)
            // - Keeps only the actual podcast objects
            return storedIds.map(id => allPodcasts.find(podcast => podcast.id === id)).filter(Boolean);
            // Allowing us to Keeps the same random order during this session (page reload won’t reshuffle).
        // 14. Otherwise, Create a New Randomized Order
        } else {
            // Create new randomized order using array shuffling and sampling logic
            // 15. Using the Spread Operator Create a Shallow Copy
            // - This Copies allPodcasts into a new array (... spread avoids mutating the original).
            // How it works:
            // - Creates a new array using the spread operator ...
            // - Prevents modifying the original allPodcasts array
            // Example: If allPodcasts has 100 items, [...allPodcasts] creates a new array with the same 100 items
            const shuffled = [...allPodcasts]
                // 16. Then I applied some Shuffling Logic
                // - How Math.random() works:
                // --- Returns a random number between 0 (inclusive) and 1 (exclusive)
                // ------ Examples: 0.234, 0.876, 0.015, 0.654
                .sort(() => Math.random() - 0.5) 
                // 17. Once The Math.random() method is applied, The comparison function then does the following
                // This produces:
                // - Positive number (> 0) if Math.random() > 0.5 (50% chance)
                // - Negative number (< 0) if Math.random() < 0.5 (50% chance)
                // - Zero if Math.random() === 0.5 (extremely rare)
                // 18. Now how JavaScript sort works with this:
                // - When the comparison function returns negative, element a comes before b
                // - When it returns positive, element a comes after b
                // Since it's random each time, the sort order becomes randomized
                .slice(0, 10); 
                // 19. Then I select / Take a Sample - using .slice(0, 10) method to Show 10 random podcasts
                // - Extracts the first 10 elements from the shuffled array
                // - Returns a new array containing only those 10 items
                // - If the array has fewer than 10 items, it returns all of them
            
            // 20. After this, I then Store the IDs in sessionStorage
            // - Stores the randomized order by podcast ID for persistence.
            // - This is updated and can be accessed again should
            const podcastIds = shuffled.map(podcast => podcast.id);
            // 21. Using JSON.stringify(), I convert arrays/objects to strings as sessionStorage can only store strings
            // 22. The .setItem() method for sessionStorage then adds this into the browser sessionStorage
            sessionStorage.setItem(sessionKey, JSON.stringify(podcastIds));
            
            // 23. Then lastly, Return Final List
            // - The computed value (an array of 10 podcasts) is stored as randomizedPodcasts.
            return shuffled;
        }
    // 24. Then I defined the Memo Dependencies / dependancy array which implies
    // The randomization logic re-runs only if:
    // - The input podcast list changes, or
    // - The title (and thus session key) changes.
    }, [allPodcasts, title]);

    // 25. Then I defined a CLEANUP EFFECT
    // Which Clears session storage when component unmounts or on page refresh
    useEffect(() => {
        // 27. The returned function acts as a cleanup (runs when the component unmounts).
        return () => {
            // Optionally clear session storage when leaving homepage
            // Or keep it for the session as requested
        };
    }, []);
    // 26. Empty dependency array → runs only once on mount/unmount.

    // 28. Then I went ahead to Calculate Scroll Amount Dynamically with a Scroll functions (same as your existing RenderRow)
    const getScrollAmount = () => {
        // 29. I do an environment check using a conditional if statement.
        // - This is to Detect if running in non-browser environment (like SSR)
        // - typeof window - Returns the type of window object as a string and doing a Strict equality check for string 'undefined' using - === 'undefined'
        // This Returns : Fallback value 300 when window doesn't exist.
        if (typeof window === 'undefined') return 300;
        
        // 30. Then i performed Screen Width Detection and stor in a variable
        // - window.innerWidth - Returns viewport width in pixels
        const screenWidth = window.innerWidth;
        // 31. Then using a conditional if statement, I checked the Stored current browser viewport width for responsive calculations
        if (screenWidth < 768) {
            // Move by 280px
            return 280;
            // 768 - 1023 - Tablet devices
        } else if (screenWidth < 1024) {
            // I return a Ternary Operators - condition ? valueIfTrue : valueIfFalse
            // - that says 320px if sidebar open, 350px if closed
            return isSidebarOpen ? 320 : 350;
            // ≥ 1024 - Desktop devices
        } else {
            // I return a Ternary Operators - condition ? valueIfTrue : valueIfFalse
            // - that says  320px if sidebar open, 400px if closed
            return isSidebarOpen ? 350 : 400;
        }
    };

    // 32. Then I created a scrollRight() Function
    const scrollRight = () => {
        // 33. I start with a **Null Check**
        // Checks if the React ref points to an actual DOM element
        // - This Proceeds only if scrollContainerRef.current is truthy (not null, undefined, empty string)
        // This Prevents errors if element doesn't exist
        if (scrollContainerRef.current) {
            // 34. If scrollContainerRef.current; is present, then Stores the actual DOM element (scrollContainerRef.current) in a variable for easier access
            const container = scrollContainerRef.current;
            // 35. We also call the the scroll amount and store in a variable
            const scrollAmount = getScrollAmount();
            
            // 36. Then I used Scroll Properties
            // - container.scrollLeft - Current horizontal scroll position (pixels from left)
            // - container.scrollWidth - Total scrollable width including hidden content
            // - container.clientWidth - Visible width of the container
            const isAtEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 10);
            // 37. Then I perform this Calculation:
            // --- (scrollWidth - clientWidth) = Maximum possible scroll position
            // --- (-10) = 10px tolerance buffer for floating point precision
            // 38. Outside of the parenthesis I apply my comparison logic
            // - ">=" comparison checks if current position is at or beyond the end
            // - This Returns true when scrolled to the end, false otherwise.
            
            // 39. Using the conditional if statement, I perform a position value check
            if (isAtEnd) {
                // 40. I then applied the scrollTo() Method:
                // - left: 0 - Scrolls to absolute position 0 (far left)
                // - behavior: 'smooth' - Animated scrolling
                container.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // 41. If false, then I scrollBy() Method:
                // - left: scrollAmount - Scrolls relative to current position by specified pixels
                // - Positive value scrolls right
                container.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };

    // 42. I then created the scrollLeft() Function
    const scrollLeft = () => {
        // 43. Using the conditional if statement, I perform a Start Position Check
        if (scrollContainerRef.current) {
            // 44. If scrollContainerRef.current; is present, then Stores the actual DOM element (scrollContainerRef.current) in a variable for easier access
            const container = scrollContainerRef.current;
            // 45. We also call the the scroll amount and store in a variable
            const scrollAmount = getScrollAmount();
            
            // 46. I then performed
            // (<= 10) - Checks if at beginning (with 10px tolerance)
            // - Returns true when at or near the start
            const isAtStart = container.scrollLeft <= 10;
            
            // 47. Using the conditional if statement, I perform a position value check
            if (isAtStart) {
                // When at start: scrollTo({ left: container.scrollWidth }) jumps to far right
                // scrollWidth = Maximum scrollable position
                container.scrollTo({
                    left: container.scrollWidth,
                    behavior: 'smooth'
                });
            } else {
                // Negative Scroll: left: -scrollAmount - Negative value scrolls left
                container.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };

    // typeof window - Environment detection - String type
    //window.innerWidth - Viewport measurement - Number (px)
    // condition ? A : B - Conditional value - A or B
    // ref.current - DOM access - Element or null
    // scrollLeft - Scroll position - Number (px)
    // scrollWidth - Total content width - Number (px)
    // clientWidth - Visible width - Number (px)
    // scrollTo() - Absolute scrolling - void
    // scrollBy() - Relative scrolling - void

    // 48. I then create a BUTTON VISIBILITY HANDLING function
    const updateButtonVisibility = () => {
        // 49. Using the conditional if statement, I perform a Start Position Check
        if (scrollContainerRef.current) {
            // 50. If scrollContainerRef.current; is present, then Stores the actual DOM element (scrollContainerRef.current) in a variable for easier access
            const container = scrollContainerRef.current;
            // 51. currently sets both buttons visible and changes thier states.
            setShowLeftButton(true);
            setShowRightButton(true);
            // Could be expanded to hide left/right buttons when fully scrolled one way.
        }
    };

    // 52. Then I went ahead to Calculate Visible Cards Dynamically with a Scroll functions (same as your existing RenderRow)
    // This Determines how many podcast cards should be visible per row.
    // Based on both:
    // - Screen width (mobile/tablet/desktop)
    // - Sidebar state (affects available space)
    const getVisibleCardCount = () => {
        // 53. I do an environment check using a conditional if statement.
        // - This is to Detect if running in non-browser environment (like SSR)
        // - typeof window - Returns the type of window object as a string and doing a Strict equality check for string 'undefined' using - === 'undefined'
        // This Returns : Fallback value 3 when window doesn't exist.
        if (typeof window === 'undefined') return 3;
        
        // 54. Then i performed Screen Width Detection and star in a variable
        // window.innerWidth - Returns viewport width in pixels
        const screenWidth = window.innerWidth;
        // 55. Then using a conditional if statement, I checked the Stored current browser viewport width for responsive calculations
        if (screenWidth < 768) {
            // show and move by one card
            return 1;
            // 768 - 1023 - Tablet devices
        } else if (screenWidth < 1024) {
            // I return a Ternary Operators - condition ? valueIfTrue : valueIfFalse
            // - that says show 2 cards if sidebar open, show 3 cards if closed
            return isSidebarOpen ? 2 : 3;
            // ≥ 1024 - Desktop devices
        } else {
            // I return a Ternary Operators - condition ? valueIfTrue : valueIfFalse
            // - that says show 3 cards if sidebar open, show 4 cards if closed
            return isSidebarOpen ? 3 : 4;
        }
    };

    // 56. To solve for Design inconsistancy I then created an arrow function that Adjust Padding Dynamically.
    // This Returns a Tailwind CSS padding class depending on the visible cards count.
    // This ensures equal horizontal spacing at different screen sizes.
    const getContainerPadding = () => {
        const visibleCards = getVisibleCardCount();
        if (visibleCards >= 4) return 'px-2';
        if (visibleCards === 3) return 'px-4';
        return 'px-6';
    };

    // 58. I then added SCROLL AND RESIZE LISTENERS using the useEffect Hook as it is able to Perform side effects in functional components
    // Runs after component render
    // Can cleanup before next effect or unmount
    // Adds event listeners to:
    // - Recalculate button visibility on scroll.
    // - Recalculate layout when window resizes.
    // Cleans up on unmount (good memory management).
    // Reattaches listeners if randomizedPodcasts or isSidebarOpen changes.
    // useEffect(callbackFunction, dependencyArray)
    useEffect(() => {
        // 59. scrollContainerRef.current - Gets the actual DOM element from React ref
        const container = scrollContainerRef.current;
        // 60. if (container) - Null check to ensure element exists before adding event listeners
        // - this check Prevents errors during initial render when ref might not be set yet.
        if (container) {
            // Event Listeners Setup
            // 61. Scroll Event
            // Event: 'scroll' - Fires when container is scrolled
            // - Handler: updateButtonVisibility - Function that shows/hides navigation buttons
            // - Purpose: Update UI when user scrolls horizontally
            container.addEventListener('scroll', updateButtonVisibility);
            // 62. Resize Event
            // Event: 'resize' - Fires when browser window resizes
            // Handler: updateButtonVisibility - Same function
            // Purpose: Recalculate button visibility on screen size changes
            window.addEventListener('resize', updateButtonVisibility);
            // 63. Purpose: Manually calls the function once to set initial button state
            // Ensures buttons are correctly shown/hidden on first render
            // Without this, buttons might be wrong until first scroll/resize
            updateButtonVisibility();

            // 64. Cleanup Function - Prevents memory leaks and unwanted behavior
            // Runs: Before next effect execution OR when component unmounts
            // Removes: Event listeners to avoid multiple registrations
            // Its essential because Without cleanup, each re-render would add new listeners, causing performance issues and bugs.
            return () => {
                container.removeEventListener('scroll', updateButtonVisibility);
                window.removeEventListener('resize', updateButtonVisibility);
            };
        }
        // 65. Dependency Array: Controls when the effect re-runs
    }, [randomizedPodcasts, isSidebarOpen]);
    // Dependencies Explained:
    // **randomizedPodcasts
    // - Why included: When podcast list changes, scroll container content changes
    // - Affects: Scroll boundaries and button visibility logic
    // - Example: New podcasts → different scroll width → different button states

    // **isSidebarOpen
    // - Why included: Sidebar state affects container width
    // - Affects: clientWidth calculation in updateButtonVisibility()
    // - Example: Sidebar opens → less horizontal space → scroll boundaries change

    // Missing Dependencies Analysis:
    // **updateButtonVisibility - NOT in dependencies
    // - Reason: Likely defined with useCallback or stable reference
    // - Alternative: Could be defined inside effect to avoid dependency

    // **scrollContainerRef - NOT in dependencies
    // - Reason: React refs have stable identity across re-renders
    // - Safe: Ref object doesn't change between renders

    // 66. EFFECT: DEBOUNCED VISIBILITY UPDATE
    useEffect(() => {
        // A delayed recheck (300ms) after updates.
        // Prevents layout flicker or premature updates (debouncing technique).
        const timer = setTimeout(updateButtonVisibility, 300);
        return () => clearTimeout(timer);
    }, [randomizedPodcasts, isSidebarOpen]);

    // 67. EMPTY STATE HANDLING
    if (!randomizedPodcasts || randomizedPodcasts.length === 0) {
        return null;
    }

    // 68.FINAL PRE-RENDER COMPUTATIONS
    const visibleCardCount = getVisibleCardCount();
    const containerPadding = getContainerPadding();

    return (
        // Root div: Container with flex column layout, full width, and bottom margin
        <div className="flex flex-col mb-8 w-full">
            {/* h1 element: Main title using JSX expression {title} for dynamic content */}
            <h1 className="text-2xl font-bold text-black dark:text-white mb-4 px-4">
                {title}
                {/* Nested span: Displays item count using array length property and template literal equivalent */}
                <span className="text-sm text-gray-500 ml-2 font-normal"> 
                    ({randomizedPodcasts.length} shows) 
                </span>
            </h1>
            
            {/* Left Scroll Button */}
            <div className="flex items-center relative group">
                <button 
                    onClick={scrollLeft} // Event handler prop: onClick={scrollLeft} - function reference, not invocation
                    // CSS transitions: Multiple Tailwind classes for smooth interactions
                    className={`absolute left-0 z-10 p-3 bg-black bg-opacity-30 rounded-full hover:bg-opacity-90 
                              transition-all duration-200 ml-2 transform hover:scale-110
                              ${showLeftButton ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}
                              // Conditional styling: Template literal with ternary operator for dynamic classes
                              // Conditional Rendering Pattern:
                              // Uses ternary operator for conditional CSS classes
                              // Provides visual feedback for disabled state
                    aria-label="Scroll left" // ARIA attribute: aria-label for accessibility
                    disabled={!showLeftButton} // Conditional disabling: disabled={!showLeftButton} - boolean prop
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                </button>

                {/* Scroll Container with Dynamic Styling */}
                <div
                    // ref attribute: ref={scrollContainerRef} - React ref for direct DOM access
                    ref={scrollContainerRef}
                    // Dynamic className: Template literal with variable interpolation ${containerPadding}
                    className={`flex items-center gap-4 w-full overflow-x-auto scrollbar-hide scroll-smooth py-3 ${containerPadding}
                              transition-all duration-300 ease-in-out`}
                    // Inline style object: style={{...}} - JSX style prop with CSS-in-JS
                    style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        maxWidth: isSidebarOpen ? 'calc(100vw - 22rem)' : '100vw'
                        // Conditional maxWidth: Ternary operator inside style object calculating based on isSidebarOpen
                    }}
                >
                    {/* Podcast Cards Mapping  using JavaScript Array Methods & Props:*/}
                    {randomizedPodcasts.map((podcast) => (
                        // Array.prototype.map(): Transforms data array into JSX elements
                        <div 
                            // key prop: key={podcast.id} - React reconciliation identifier
                            key={podcast.id} 
                            // Dynamic inline styles: Calculating widths based on visibleCardCount variable
                            className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
                            // Dynamic Styling Pattern
                            // - Template literals in style objects for calculated values
                            // - Responsive card sizing based on state
                            style={{
                                minWidth: `calc(${100 / visibleCardCount}% - 1rem)`,
                                maxWidth: `calc(${100 / visibleCardCount}% - 1rem)`
                            }}
                        >
                            {/* Component prop passing: Passing podcast object and onPodcastSelect function as props
                                - Prop drilling - passing data and functions to child components
                                - Reusable component pattern */}
                            <PodcastCard
                                podcast={podcast}
                                onPodcastSelect={onPodcastSelect}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button 
                    // Event handler prop: onClick={scrollLeft} - function reference, not invocation
                    onClick={scrollRight}
                    // Conditional styling: Template literal with ternary operator for dynamic classes
                    // CSS transitions: Multiple Tailwind classes for smooth interactions
                    className={`absolute right-0 z-10 p-3 bg-black bg-opacity-30 rounded-full hover:bg-opacity-90 
                              transition-all duration-200 mr-2 transform hover:scale-110
                              ${showRightButton ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}
                    aria-label="Scroll right" // ARIA attribute: aria-label for accessibility
                    // Conditional disabling: disabled={!showLeftButton} - boolean prop
                    disabled={!showRightButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default HomeRenderRow;


// Understand: 
// - React Context
// - sessionStorage

// - How session storage is used.
const sessionKey = 'favoritePodcasts';
const allPodcasts = [
  { id: 101, title: 'Tech Talk' },
  { id: 102, title: 'Science Weekly' },
  { id: 103, title: 'History Hour' }
];

// What's in session storage (as a string):
// "[101, 103, 999]" - 999 doesn't exist in allPodcasts

const stored = sessionStorage.getItem(sessionKey); // Gets "[101, 103, 999]"
const storedIds = JSON.parse(stored); // Converts to [101, 103, 999]

// After mapping:
// [101, 103, 999].map(...) becomes:
// [
//   { id: 101, title: 'Tech Talk' },    // Found
//   { id: 103, title: 'History Hour' }, // Found  
//   undefined                           // Not found (id 999 doesn't exist)
// ]

// After filtering:
// Removes undefined, final result:
// [
//   { id: 101, title: 'Tech Talk' },
//   { id: 103, title: 'History Hour' }
// ]

// Applying Randomness
const shuffled = [...allPodcasts]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

// For better randomness, use the Fisher-Yates shuffle:
// Better shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const shuffled = shuffleArray(allPodcasts).slice(0, 10);

// Left and Right Scroll Example: Container with horizontal scrolling content
const scrollAmount = getScrollAmount(); 
// On desktop with sidebar closed: returns 400

const container = {
    scrollLeft: 0,        // Currently at start
    scrollWidth: 2000,    // Total scrollable width
    clientWidth: 500      // Visible width
};

// scrollRight() execution:
const isAtEnd = 0 >= (2000 - 500 - 10); // 0 >= 1490 → false
container.scrollBy({ left: 400, behavior: 'smooth' }); // Scrolls right 400px

// After multiple clicks, scrollLeft becomes 1500:
const isAtEnd = 1500 >= (2000 - 500 - 10); // 1500 >= 1490 → true
container.scrollTo({ left: 0, behavior: 'smooth' }); // Wraps to start

// Event listeners Component mounts
useEffect runs → 
  // Setup phase:
  Get container ref ✓
  Add scroll listener ✓  
  Add resize listener ✓
  Call updateButtonVisibility() ✓
  
// User interacts:
User scrolls → scroll event → updateButtonVisibility() runs
Window resizes → resize event → updateButtonVisibility() runs

// Dependencies change:
randomizedPodcasts updates → 
  Cleanup runs (remove old listeners) →
  Effect re-runs (add new listeners) →
  updateButtonVisibility() called again

// Component unmounts:
Cleanup runs → all listeners removed ✓