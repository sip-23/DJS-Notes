// 1. I first imported the React hooks: 
// - useState: for managing state (data, loading, error).
// - useEffect: for running side effects (fetching data when the component mounts or apiUrl changes)
import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching podcast data from an API
 * useFetchPodcasts is a custom React hook that performs a GET fetch to apiUrl, 
 * Manages 3 pieces of UI state (data, isLoading, error)
 * Returns them for the calling component to render.
 */
// 2. I used named export of a constant binding to define my custom hook named useFetchPodcasts.
// - This means the Consumers import with { useFetchPodcasts }
// 3. I use a arrow function to define the hook name.
// - To satisfy the Rules of Hooks and linting, I start the hook name with "use"
// 4. It accepts a single parameter: apiUrl (string), which is the endpoint where podcasts are fetched from.
export const useFetchPodcasts = (apiUrl) => { 
    // 5. I then declared the data state, using useState([]) — a React Hook that creates a state variable and an updater function 
    // - initialized the state varaible as an empty array.
    // - setData will update this state after a successful API call.
    // 6. I then preformed Array destructuring to create the varaible state for input data.
    const [data, setData] = useState([]);
    // 7. I then declared the isloading state, using useState([]) — a React Hook that creates a state variable and an updater function
    // - isLoading is a boolean flag for UI loading state. 
    // - initialized the state varaible as true: meaning the hook assumes the request is pending initially.
    // - setLoading will update this state after a successful API call.
    // 8. I then preformed Array destructuring to create the varaible state for input data.
    const [isLoading, setIsLoading] = useState(true);
    // 9. I then declared the error state, using useState([]) — a React Hook that creates a state variable and an updater function 
    // - initialized the state varaible to hold either null (no error) or a string/error message
    // - setError will update this state variable and  setError is used to record failures.
    // 10. I then preformed Array destructuring to create the varaible state for input data.
    const [error, setError] = useState(null);

    // 11. Using UseEffect, I Started a side effect which Runs when the component, using this hook, mounts or whenever apiUrl changes.
    // --- Effects are for side-effects (network IO, subscriptions, DOM mutations).
    // useEffect is an effect hook that runs after render.
    // The anonymous function you pass is the effect callback.
    // useEffect([apiUrl]) runs on mount and whenever apiUrl identity changes.
    useEffect(() => {
        // 12. Inside the useEffect scope, I Declared an async function named fetchData. 
        // - This Handles the actual fetching of data.
        // Declaring the async function inside the effect is idiomatic: 
        // - it allows await usage while keeping the effect sync 
        // --- the effect itself cannot be async because it must return either undefined or a cleanup function.
        const fetchData = async () => {
            // 13. Then using the try-catch-finally block, I intend for error handling and guaranteed cleanup semantics.
            // In the Try Block, 
            // - first Sets loading state / set the loading flag at start (maybe redundant if already true, but good for refetch).
            // - Then I Clear any previous error using the setError set to null, clearing previous errors before a new request.
            try {
                setIsLoading(true);
                setError(null);
                
                // 14. Then I Return a Response object Using the Fetch API function to make an HTTP request to the given apiUrl.
                // - This uses the browser fetch API returning a Promise resolved to a Response object.
                // - Await pauses the async function until the promise resolves, allowing the fetch to continue without timing out
                // - Non-blocking for the JS event loop
                // **NB**: fetch will reject the promise on network errors only; 
                // - HTTP error statuses (4xx/5xx) do not reject — you must check response.ok (see next line).
                const response = await fetch(apiUrl);
                
                // 15. Then I Check if the response is not OK (status code not between 200–299).
                // - response.ok is a boolean (true for 2xx HTTP codes)
                // - If ok is false we explicitly throw a new Error. 
                // - That transfers control to the catch block.
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`); // throw creates an exception object — the catch will receive it as err.
                }
                
                // 16. response.json() returns a Promise that resolves with the parsed JSON body
                // If successful, Parse the JSON response body into a JavaScript object/array.
                // - podcasts now holds the parsed value (often an array of objects, but could be any JSON type).
                const podcasts = await response.json();
                
                // 17. I then performed Defensive validation: Validate that we got an array
                // This Checks the runtime type. 
                // - If the API returned an object { data: [...] } or something else, this throws an error. 
                // --- This keeps downstream code simple (it can assume data is an array).
                if (!Array.isArray(podcasts)) {
                    throw new Error('Invalid data format received from API');
                }
                
                // 18. Stores the validated array into React state. This enqueues a re-render with the updated data.
                setData(podcasts);
            
            // 19. The Catch Block takes control If response.ok is false.
            // - The catch block is for Error handling.
            // - If something goes wrong (network error, bad response, parsing error), The block allows To store the error message in error state
            // The catch (err) receives thrown errors from:
            // - network failures (fetch rejection),
            // - non-ok HTTP statuses (we threw earlier),
            // - JSON parsing errors (response.json() throws),
            // - the validation throw.
            } catch (err) {
                // 20. Then I store the error string 
                // - note: if err is not an Error object, err.message may be undefined — safer to coerce.
                setError(err.message);
                // 21. Then I also Log the full error to the console for debugging.
                console.error('Fetch error:', err);
            // 22. Then In the Finally Block, I update the Loading state to false.
            // - This block always runs, whether success or failure — It ensures the isLoading flag clears.
            } finally {
                setIsLoading(false);
            }
        };

        // 23. I then Define fetchData, and then invoke it.
        fetchData();
        // Because fetchData is async, fetchData() returns immediately with a Promise; the effect callback does not await it (fine — effect returns no cleanup here).
        // The network flow runs asynchronously; state updates will happen when awaited steps resolve.

    // 24. Dependency array for useEffect: the effect re-runs whenever apiUrl identity changes. 
    // - If apiUrl is stable (same string), the effect runs once on mount; 
    // - If apiUrl changes (e.g., user types new search or route changes) it re-fetches.
    }, [apiUrl]);

    // 25. Returns an object with shorthand property names ({ data, isLoading, error } 
    // - This is equivalent to { data: data, isLoading: isLoading, error: error }). 
    // Then outside of the useEffect definition, I Returns an object containing:
    // - data → the fetched podcasts.
    // - isLoading → whether the data is currently being fetched.
    // - error → error message if the fetch fail
    // The calling component can "const { data, isLoading, error } = useFetchPodcasts(url)"
    return { data, isLoading, error };
}; 


// State after unmount / race conditions
// - If the component using the hook unmounts before the fetch resolves, setData / setIsLoading will run on an unmounted component and—while React no longer errors on this the way older versions did—this is still conceptually incorrect and can produce race conditions.
// - Also: if apiUrl changes rapidly, previous requests may resolve later and overwrite the latest data. You should cancel previous requests (AbortController) or gate the updates.

// fetch cancellation — use AbortController
// - fetch supports cancellation via AbortController. Best practice: create a controller in the effect and pass signal to fetch, and call controller.abort() in the effect cleanup.

// Stale apiUrl closure
// - The effect captures the apiUrl value of the render that created it. Because apiUrl is in the deps array, a new effect runs whenever apiUrl changes — that’s OK. Just be aware of closures when returning functions or callbacks.

// Error coercion
// - setError(err.message) assumes err is an Error. In the wild it might be something else — safer to String(err) or err?.message ?? String(err).

// Synchronous setState vs Async code
// - setIsLoading(false) in finally runs after awaited operations — the state updates may be batched. If you call this hook’s refetch quickly, isLoading may flicker; you might want a debounce or to keep track of an active request counter for concurrent requests.

// Response shape differences
// - The hook assumes the API returns an array. Many APIs return { data: [...] } or { results: [...] }. The validation will throw in that case. 
// - Align the hook with your API contract or make mapping configurable.

// Retries and backoff
// - For flaky networks, add retry logic with exponential backoff or rely on libraries (axios + retry, or a SWR/React Query layer).

// Alternatives
// - For robust caching, revalidation, retries, background refresh and deduplication use React Query / SWR rather than rolling your own.

import { useState, useEffect, useRef, useCallback } from 'react';

export const useFetchPodcasts = (apiUrl) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const fetchData = useCallback(async (url) => {
    // Abort any previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error('Invalid data format received from API');
      }
      // Only set state if not aborted
      if (!signal.aborted) {
        setData(json);
      }
    } catch (err) {
      // Ignore abort errors; otherwise set error
      if (err.name === 'AbortError') {
        // intentionally ignored
      } else {
        setError(err?.message ?? String(err));
        console.error('Fetch error:', err);
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // Auto-fetch when apiUrl changes
  useEffect(() => {
    if (!apiUrl) {
      setData([]);
      setIsLoading(false);
      return;
    }
    fetchData(apiUrl);

    // cleanup: abort on unmount or if apiUrl changes
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [apiUrl, fetchData]);

  const refetch = useCallback(() => {
    if (apiUrl) fetchData(apiUrl);
  }, [apiUrl, fetchData]);

  return { data, isLoading, error, refetch };
};
