// I first imported the React hooks: 
// - useState: for managing state (data, loading, error).
// - useEffect: for running side effects (fetching data when the component mounts or apiUrl changes)
import { useState, useEffect } from 'react';

/**
 * fetching podcast data from an API URL provided
 *
 * @function useFetchPodcasts
 * @param {string} apiUrl - The API URL from which to fetch podcast data.
 * @returns {Object} - An object containing:
 *   @property {Array} data - The fetched podcast data.
 *   @property {boolean} isLoading - Loading state indicator.
 *   @property {string|null} error - Error message if the fetch fails. 
 */

// 2. Define my custom hook named useFetchPodcasts.
// - It accepts a single parameter: apiUrl (string), which is the endpoint where podcasts are fetched from.
const useFetchPodcasts = (apiUrl) => { 
  // 3. I then declared the data state, initialized as an empty array.
  // - setData will update this state after a successful API call.
  const [data, setData] = useState([]);
  // 4. I then declared the loading buffer state, initialized as "true"
  // - Indicates whether the fetch request is in progress.
  const [isLoading, setIsLoading] = useState(true);
  // 5. I then also declared the error state, initialized as null.
  // - Will store any error message if the fetch fails.
  const [error, setError] = useState(null);

  // 6. Using UseEffect, I Started a side effect which Runs when the component using this hook mounts or whenever apiUrl changes.
  useEffect(() => {
    const fetchData = async () => { // 7. Inside the useEffect, I Defined an asynchronous function fetchData. Handles the actual fetching of data.
      // 8. Then using the try-catch-finally statement, The Try Block:
      // - first Sets loading state to true before making a request.
      // - Then Clears any previous error using the setError to null.
      try {
        setIsLoading(true);
        setError(null);
        
        // 9. Then I Returns a Response object Using the Fetch API function to make an HTTP request to the given apiUrl.
        // - await allows the fetch to continue without timing out.
        const response = await fetch(apiUrl);
        
        // 10. Then I Check if the response is not OK (status code not between 200–299).
        if (!response.ok) {
          // 11. It must throw an error with the server status (e.g., 404, 500).
          throw new Error(`Server error: ${response.status}`);
        }
        
        // 12. If successful, Parse the JSON response body into a JavaScript object/array.
        const podcasts = await response.json();
        // 13. Updates data state with the fetched podcast data.
        setData(podcasts);
        
        // 14. The Catch Error handling block allows, If something goes wrong (network error, bad response, parsing error), To store the error message in error state.
      } catch (err) {
        setError(err.message);
        // 15. Then I also Log the full error to the console for debugging.
        console.error('Fetch error:', err);
        // 16. Then the Finally Block Ensures that isLoading is set to false once the request finishes, whether it succeeded or failed.
      } finally {
        setIsLoading(false);
      }
    }; // Close off the fetchData function definition.

    // 17. Then I Call the async function immediately when useEffect runs.
    fetchData();
  }, [apiUrl]); // 18. Dependency array: ensures that the effect runs when apiUrl changes. If the API URL is updated, the hook will re-fetch new data.

  // 19. Then outside of the useEffect definition, I Returs an object containing:
  // - data → the fetched podcasts.
  // - isLoading → whether the data is currently being fetched.
  // - error → error message if the fetch fail
   return { data, isLoading, error };
}; // close off the hook definition.

// 20. This Exports the hook as the default export so it can be imported and used in other components.
export default useFetchPodcasts;

// reusable across multiple components—just pass in any API endpoint.