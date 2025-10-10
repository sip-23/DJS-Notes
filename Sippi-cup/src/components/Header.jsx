// 1. Import React icons. 
import { IoBookOutline, IoNotificationsOutline, IoSearchOutline, IoPersonOutline } from "react-icons/io5";
// 2. Import Hooks.
import { useState, useEffect, useRef } from "react";

/**
 * Header Component
 *
 * A fixed top navigation bar 
 * @component
 */

// 3. The Child component, receives onSearch prop from <Home /> custom element.
const Header = ({ onSearch }) => {
    // 4. I Then used the useDtate hook.
    // - The hooks outputs an array of 2 elements:
    // --- The initialised value / varaible
    // --- A function: this function is used to update this state. (Setter)
    // 4. I then preformed Array destructuring to create the Local state for input text in the search box.
    // **Note**: setState() semantics: 
    // setSearchValue enqueues an update; 
    // - update may be batched and applied later. 
    // Do not rely on updated state immediately after setState.
    const [searchValue, setSearchValue] = useState("");
    // 5. **Note**: Ref (useRef) - useRef stores mutable objects between renders (timer ID, DOM input reference).
    // - Mutable container for values that persist across renders.
    // - Used for timer handles because changing a ref does not cause a render.
    // --- This helps because no re-renders then timoutRef changes
    const searchTimeoutRef = useRef(null);
    // --- It allows me to get Direct DOM access
    const searchInputRef = useRef(null);


    // ***Suggestions***: Stale onSearch closure
    // If onSearch is re-created by the parent frequently, scheduled timeouts will call the old function. 
    // To be robust, keep the latest onSearch in a ref:
    const onSearchRef = useRef(onSearch);
    useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);
    // then inside timeout: onSearchRef.current(...)


    // 6. Simple object literal, used in <img>.
    const darkLogo = {id: 2, image: "./src/assets/SippiCupPod Logo Dark NoBG.png", alt: "Dark mode logo"};


    // **Note**: The setTimeout + clearTimeout pattern implements:
    // Debounce: delaying execution until the input has stopped changing for a specified quiet period.

    // **Note**: Throttle vs Debounce: 
    // - Throttle limits action to at most once per interval; 
    // - Debounce delays until inactivity.

    // 7. Here I then catared for a debounced search input
    // On This function on every keystroke it updates local state and schedules a debounce timer (300 ms) to call onSearch.
    // If typing continues, the prior timer is cleared so only the last keystroke triggers the search.
    const handleSearchChange = (e) => {
        // 8. I used an arrow function expression assigned to a constant. 
        // --- It is a lexical function with lexical this (not relevant here since no this used).
        // 9. This function takes in a e
        // The e is the event object passed by the browser/React event system (in React this is a SyntheticEvent abstraction).
        const value = e.target.value;
        // 10. Then e.target is the DOM element that fired the event (the <input>). 
        // 11. value is the input’s current value — a string primitive.
        // - Why I capture it immediately? 
        // --- Historically React used SyntheticEvent pooling so event properties were invalidated after the handler returned; 
        // --- Modern React versions removed pooling, but capturing the value early is still correct and defensive because:
        //          - you need the value inside an asynchronous callback (setTimeout), and
        //          - value is a primitive and safe to close over — the later callback will see the captured value as it was at the moment of the event.

        // **Note**: SyntheticEvent: React’s wrapper for native events — historically pooled; 
        // reading e.target.value synchronously is recommended if you intend to use the value asynchronously later.

        // 12. Updates local state immediately
        // using the setSearchValue, which is a state updater returned from useState.
        // - Calling it enqueues a state update; 
        // - React schedules a re-render. 
        // - Important: setState in React is asynchronous and batched — the state change is not visible immediately on the next line. 
        //      - If you need the new value synchronously in this scope, use the captured value variable (as the code does for the scheduled callback).
        setSearchValue(value);

        // 13. Then I implemented the Debounce clearing block: Clears existing timer if typing continues.
        // This block is an if conditional statement. 
        // - This takes in and checks the boolean expression inside () which is the condition; 
        // the { ... } is the block statement executed when the condition evaluates to true.
        if (searchTimeoutRef.current) {             
            // 14. searchTimeoutRef is a useRef
            // 15. searchTimeoutRef.current holds the timer **handle** returned by setTimeout.
            // - clearTimeout(handle) cancels a scheduled timeout so its callback will not run. 
            // This is the core of the debounce pattern: cancel any pending run before scheduling a new one.
            clearTimeout(searchTimeoutRef.current);
        }
        
        // 15. Then to Schedule the debounce: After 300ms idle, calls parent onSearch.
        searchTimeoutRef.current = setTimeout(() => {
            // 16. setTimeout(callback, 300) schedules callback to run after ~300ms (a macrotask on the event loop). 
            // - It returns a timer **handle** that you store in searchTimeoutRef.current.
            // - The callback is an arrow function that closes over value and onSearch.
            // 17. The if (onSearch) { ... } guard checks that a callback prop exists before invoking it.
            // --- value.toLowerCase().trim():
            // ------ toLowerCase() returns a new string with all characters converted to lowercase (non-mutating).
            // ------ trim() returns a new string with leading and trailing whitespace removed (non-mutating). Does not remove whitespace inside the string
            // --- Combined, these normalize the search term for case-insensitive and whitespace-tolerant searching.
            if (onSearch) {
                onSearch(value.toLowerCase().trim());
            }
        }, 300);
    };

    // ***Suggestions***: Consider useCallback if passing handlers down
    // - If you pass these handlers as props to children, wrap them in useCallback with appropriate deps to avoid unnecessary re-renders.

    // ***Suggestions***: Race between setSearchValue and Enter handler
    // - Use the event target value in the Enter handler instead of searchValue state to avoid stale reads:
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value; // freshest input
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            if (onSearch) onSearch(value.toLowerCase().trim());
        }
    };

    // Use onKeyDown instead of onKeyPress
    // - keypress is legacy/less reliable for non-printable keys. 
    // - Prefer onKeyDown and check e.key === 'Enter'.

    // Use a tested utility for debounce when you need more features
    // - lodash.debounce or a small custom useDebouncedCallback hook can provide a cleaner API and built-in cancellation.
    // - Edge case: setTimeout returns different handles across environments
    // - In browsers it’s a number. In Node it may be a Timeout object. Storing it in a ref is portable; clearTimeout works with either.


    // 18. Enter Key
    // When Enter is pressed it prevents the default (e.g. form submit), clears any pending debounce, and immediately invokes onSearch.
    // This handler treats the Enter key as an immediate search trigger and prevents default form behavior.
    const handleKeyPress = (e) => {
        // 19. if statement with a boolean expression. 
        // - e.key is the standardized string representing the pressed key (preferred to legacy keyCode).
        // - Browser events: keydown/keyup are generally recommended for keyboard detection; 
        // --- keypress is deprecated for some uses (it is fired only for printable characters historically). 
        // ---- onKeyDown in modern code and check e.key === 'Enter'.
        if (e.key === 'Enter') {
            // 20. preventDefault() is an Event method on the event object that suppresses the default action the browser would take for the event.
            // - Example: pressing Enter inside a <form> typically triggers form submission. e.preventDefault() prevents that submission.
            // - Important: preventDefault() does not stop propagation (event bubbling). To stop propagation you'd call e.stopPropagation().
            e.preventDefault();

            // **Note**: Event bubbling and delegation - 
            // - preventDefault() prevents the browser default action; 
            // - stopPropagation() stops bubbling. 
            // - Neither is used here except preventDefault().
            
            // 21. Instant search when pressing Enter.
            // This is Clearing timer: Clear the pending debounce to avoid duplicate invocations.
            // & executing search immediately:
            // - searchTimeoutRef is a useRef hook value/ variable. 
            // - searchTimeoutRef.current holds the timer handle returned by setTimeout.
            // 22. The if (searchTimeoutRef.current) { ... } is an if and conditional statement
            // This guard checks that the condition evaluates to true and then the { ... } is the block statement executed:
            // - clearTimeout(handle) cancels a scheduled timeout so its callback will not run. 
            // This is the core of the debounce pattern: cancel any pending run before scheduling a new one.
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            
            // 23. Execute search immediately by calls parent onSearch.
            // Then call onSearch immediately using searchValue (state) normalized.
            // 24. The if (onSearch) { ... } guard checks that a callback prop exists before invoking it.
            // * searchValue is state
            // * setSearchValue (from the onChange that just occurred) is asynchronous.
            // --- value.toLowerCase().trim():
            // ------ toLowerCase() returns a new string with all characters converted to lowercase (non-mutating).
            // ------ trim() returns a new string with leading and trailing whitespace removed (non-mutating).
            // --- Combined, these normalize the search term for case-insensitive and whitespace-tolerant searching.
            if (onSearch) {
                onSearch(searchValue.toLowerCase().trim());
                // 25. If the user types one key and immediately hits Enter (faster than React's re-render), 
                // searchValue may still be the previous value. 
                // Safer is to use e.target.value (capture the fresh value) or 
                // Use the same captured value variable pattern as in handleSearchChange.
            }
        }
    }

    // 26. Clear Search
    // Resets the input and cancels the timer and any pending search.
    const clearSearch  = () => {
        setSearchValue("");  // 27. clears the input (controlled component pattern).
        if (searchTimeoutRef.current) {
            // 28. Clear timer if present so a pending onSearch won’t fire.
            clearTimeout(searchTimeoutRef.current);
        }
        if (onSearch) {
            onSearch("");
            // 29. signal parent to reset results (empty query). 
            // This is immediate and synchronous with the call stack — however parent may still perform asynchronous work (fetch).
        }
    };

    // 30. Cleanup - Cleanup function runs when component unmounts.
    // on unmount clears pending timers to avoid callbacks after the component is gone.
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                // 31. The cleanup () => { if (searchTimeoutRef.current) clearTimeout(...) } prevents a timer from firing after the component is destroyed 
                // — avoids calling onSearch after unmount and avoids potential memory leaks or "setState on unmounted component" type bugs.

                // 33. Semantics: React calls the cleanup before unmounting and also before re-running the effect if dependencies change (not applicable here because deps are []).
            }
        };
    }, []); // 34. useEffect with an empty dependency array [] means:
    // - The effect’s function runs after the first render (mount).
    // - The return function is the cleanup and runs on unmount

    return (
        <div className="top-0 left-0 right-0 bg-[#121212] w-full h-fit px-5 py-2 relative flex-1 flex items-center justify-between z-50 border-b border-[#333]">

            {/* Icon Container */}
            {darkLogo && (
                <img 
                    className="flex w-[200px] h-12 md:w-[170px]" 
                    src={darkLogo.image} 
                    alt={darkLogo.alt} 
                />
            )}
            
            
            {/* Search container */}
            <div className="flex items-center w-[350px] h-10 px-3">
                <IoSearchOutline color="#b3b3b3" className=" mr-3" size={22}/>
                <input
                    ref={searchInputRef} 
                    type="text" 
                    placeholder="Search" 
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress}
                    className="border rounded-md opacity-30 bg-[#121212] w-full py-2 px-4 placeholder:text-[#b3b3b3] text-white hover:border-[#9A7B4F]" 
                />

                {/* Adding Clear search button */}
                {searchValue && (
                    <button 
                        onClick={clearSearch}
                        className="ml-2 text-[#b3b3b3] hover:text-white transition-colors"
                        title="Clear search">
                        ×
                    </button>
                )}
            </div>
            
            {/* Icons container */}
            <div className="flex items-center justify-center">
                <div className="hidden md:block rounded-full w-10 h-10 bg-[#65350F] grid place-items-center cursor-pointer hover:bg-[#9A7B4F] mr-3 p-2">
                    <IoNotificationsOutline color="#b3b3b3" size={22}/>
                </div>
                <div className="hidden md:flex rounded-full w-10 h-10 bg-[#65350F] grid place-items-center cursor-pointer hover:bg-[#9A7B4F] mr-3 p-2">
                    <IoBookOutline color="#b3b3b3" size={22} />
                </div>
                <div className="rounded-full w-10 h-10 bg-[#65350F] grid place-items-center cursor-pointer hover:bg-[#9A7B4F] mr-3">
                    <IoPersonOutline color="#b3b3b3" size={22} />
                </div>
            </div>
        </div>
    );
};

// Assumed at top-level of component hardened implementation (compact)
// Below is an example that addresses stale onSearch and Enter race issues:

const searchTimeoutRef = useRef(null);
const onSearchRef = useRef(onSearch);  // onSearchRef ensures the latest callback is used without re-creating the debounced handler.
useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

const handleSearchChange = useCallback((e) => {
    const value = e.target.value;      // Using e.target.value in the Enter handler avoids relying on possibly stale searchValue state.
    setSearchValue(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(() => {
            onSearchRef.current?.(value.toLowerCase().trim());
        }, 300);
}, []); // no onSearch in deps, we use onSearchRef

const handleKeyDown = useCallback((e) => {  // useCallback and empty deps keep handlers stable for children props.
    if (e.key !== 'Enter') return;
        e.preventDefault(); // it tells the browser not to perform the event's default action (e.g., prevent form submission when Enter is pressed). 
        // It does not stop event propagation (use e.stopPropagation() for that).
    const value = e.target.value;  // Using e.target.value in the Enter handler avoids relying on possibly stale searchValue state.
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        onSearchRef.current?.(value.toLowerCase().trim());
}, []);

useEffect(() => {
    return () => clearTimeout(searchTimeoutRef.current);
}, []);


export default Header;