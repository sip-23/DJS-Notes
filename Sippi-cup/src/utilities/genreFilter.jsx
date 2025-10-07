// 1. I then created React functional components using hooks (useState, useEffect) for state management and UI interaction logic
import { useState, useEffect } from "react";
// 2. useState: manages local component state, triggering re-renders when the value changes.
// 3. useEffect is used  for side effects where I fetch genres dynamically
import { genres } from "../../../data";
// 4. then I import the genres global object form a static dataset imported from a relative file path, likely an array of {id, title} objects.

/**
 * GenreFilter Component
 * Provides genre-based filtering for podcasts 
 * @component
 */

// 5. Then I Defined a functional component using arrow function syntax.
// 6. Receives a prop onGenreChange, which is a callback function passed down from a parent. 
// --- lifting state up for data filtering logic.
const GenreFilter = ({ onGenreChange }) => {
    const [selectedGenre, setSelectedGenre] = useState('all');
    // 7. Then I Declared the state variable selectedGenre initialized to 'all'.
    // 8. using array destructuring i also defined the setter function: setSelectedGenre is the state updater function returned by useState.
    // --- When setSelectedGenre is called, React schedules a state update, and the component re-renders with the new value.
    // 9. useState is called at the top level of the component (not nested) to comply with React’s Rules of Hooks.

    // Handle genre selection change
    // 10. then I Defined an event handler using an arrow function.
    const handleGenreChange = (event) => {
        // 11. event.target.value accesses the <select> element’s selected value.
        const genreId = event.target.value;
        // 12. then Two updates happen here:
        setSelectedGenre(genreId);         // 13. Local state update: updates the component-level selected genre.
        onGenreChange(genreId);           //  14. Prop callback invocation: triggers a parent-level handler (onGenreChange) to update global/app-level state (often filtered podcast data).
    };
    
    // JSX syntax returning a DOM structure (React transforms this into React.createElement calls at compile time).
    return (
        <div className="flex items-center justify-start gap-3 mb-6 mt-6">
            <h4 className="font-medium text-[#fff] text-[15px]">Filter by:</h4>
            <div className="flex items-center relative">
                {/* Controlled component:
                    - The value attribute binds the state to the UI.
                    - The onChange event ensures two-way data binding (UI → state → re-render).
                    - Ensures deterministic rendering, meaning UI always reflects selectedGenre. */}
                <select 
                    id="genre-filter"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    className="w-full px-2 py-2 font-plus-jakarta-sans border text-[13px] font-medium border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-[#000112] [&>option:checked]:text-black"
                >
                    <option value="all" className="bg-white text-[13px] font-medium text-gray-400 hover:bg-gray-900">
                        All Genres
                    </option>
                    {/* Uses array mapping (Array.prototype.map) to render dynamic <option> elements.
                        - The key prop gives React a stable identity for each child node—critical for diffing efficiency in the Virtual DOM reconciliation process. */}
                    {genres.map(genre => (
                        <option 
                            key={genre.id} 
                            value={genre.id}
                            className="bg-white text-[13px] font-medium text-gray-400 hover:bg-gray-900"
                        >
                            {genre.title}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default GenreFilter;