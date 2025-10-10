// 1. here, This one introduces useEffect, dependency management, and derived state calculation.
import { useState, useEffect } from "react";

/**
 * Pagination Component
 * 
 * The count or numbered pages with navigation buttons 
 * @component
 */

// 2. I defined my React functional component using an arrow function
// 3. The Component accepts these Props: Which are externally controlled pagination states / inputs
// - props are single-source-of-truth — 
// --- Don’t mutate them. 
// --- Always validate/clamp before using.
const Pagination = ({ currentPage, totalPages, totalPosts, postsPerPage, onPageChange }) => {
    // This is the state-lifting pattern: 
    // - The parent owns the canonical pagination state (currentPage) and provides the update handler onPageChange.
    // --- currentPage, totalPages, totalPosts, postsPerPage are numeric (or numeric-convertible) 
    // --- onPageChange is a function
    
    // 4. State: pageNumbers is a derived UI subset — local to this component.
    // pageNumbers is local state which I created with the useState hook
    // Holds an array of page indices that will be displayed in the UI
    // Using Array destructuring, I then defined my Array with two items:
    // - Inilaised value
    // - Function that updates the state
    const [pageNumbers, setPageNumbers] = useState([]);
    // This state is derived from currentPage and totalPages. 
    // - Derived state patterns: Either 
    // - (a) Store derived values in state (like this) or (b) Compute them on render with useMemo. 
    // --- Storing in state triggers an extra render when it’s set (effect runs after render → setState → second render). 
    // --- useMemo avoids that extra render and is usually preferable for pure derivations.
    // Parent likely owns currentPage and onPageChange (classic state lifting pattern).

    // 5. Calculating visible page numbers at the bottom: 1, 2, 3, ... 7
    // useEffect schedules the callback to run after React finishes painting (after render).
    // - The effect runs whenever any dependency changes: the dependency array is [currentPage, totalPages].
    // Effect hook (useEffect):
    // - Executes after the component renders or updates.
    // - Dependency array [currentPage, totalPages] means:
    //      - The effect re-runs only when currentPage or totalPages changes.
    //      - Prevents unnecessary recalculation of pageNumbers (performance optimization).
    // How it works:
    // - Because the effect runs after the render in which currentPage or totalPages changed, 
    // -- Calling setPageNumbers causes one additional render — 
    // --- (a) the component renders, 
    // --- (b) effect sets state, 
    // --- (c) component re-renders with the new pageNumbers.

    // Algorithm explained step-by-step (semantics + correctness)
    useEffect(() => {
        // 4. Algorithm:
        // - Dynamically computes visible page indices (e.g., 3 pages visible around the current one).
        // - Uses Math operations to clamp page ranges.
        // - Updates local state (setPageNumbers) to trigger UI re-render.
        // 7. I also define an empty list that will store the numbers to be rendered on the window size
        const numbers = [];
        // 8. Then I define the the window size: how many page buttons to show at once (a small centered window).
        const maxVisiblePages = 3;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        // 9. Attempt to center the window around currentPage
        // - Math.max(1, ...) clamps to first page >= 1.
        // - Math.floor(maxVisiblePages/2) computes the left offset. 
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        // 10. Tentatively set the right boundary of the window to fit maxVisiblePages. 
        // - Math.min clamps to totalPages.
        
        // 11. Using the if conditional statement, the adjustment corrects the window when endPage was clamped at totalPages and we lost items on the left: 
        // - it slides the window left so it still contains maxVisiblePages elements if possible. 
        // - startPage is again clamped to >= 1.
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 12. Then i defined a for loop pushes page indices from startPage to endPage inclusive. 
        // - Complexity: O(k) where k = endPage - startPage + 1 (in practice k = maxVisiblePages or fewer). 
        // This is tiny/constant time in normal usage.
        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }
        
        setPageNumbers(numbers);
    }, [currentPage, totalPages]);

    // Examples
    // currentPage = 1, totalPages = 10, maxVisible = 3 → start = 1, end = 3 → [1,2,3].
    // currentPage = 5, totalPages = 10 → center around 5 → [4,5,6].
    // currentPage = 10, totalPages = 10 → end clamped → [8,9,10] (after adjustment).

    //**Sugestion**:
    // totalPages could be 0 or 1. If totalPages <= 1 you’ll short-circuit and not render the control (see below).
    // If postsPerPage is 0 or falsy, later index calculations will be meaningless — you should validate numeric inputs (postsPerPage >= 1 and totalPages >= 0).
    // If currentPage is out of range (e.g., currentPage > totalPages or currentPage < 1), you should clamp it before using it to compute the window:
    const page = Math.max(1, Math.min(totalPages || 1, Number(currentPage) || 1))

    // 5. Functional purity:
    // The computation is deterministic and side-effect-free except for the controlled state update.

    if (totalPages <= 1) return null;
    // 13. Short-circuit return — prevents rendering pagination UI when unnecessary.
    // I used a if-conditional statement
    // - A common conditional rendering pattern in React.
    // - return null in a React component means “render nothing” — 
    // --- React will not create DOM nodes for this component. 
    // - This is a common pattern to avoid rendering unnecessary UI for single-page or empty results.
    // However, if you want the layout to remain consistent (e.g. show Showing 0 - 0 of 0 results), you might render a compact info block instead of returning null.

    // 14. Calculating visible post range: Calculates the range of posts being displayed.
    // using 1-based indexing for display (human-friendly), I applied Indexing semantics:
    // - startPost formula: 
    // --- For page 1 → (1 - 1) * n + 1 = 1. 
    // --- For page 2 → (2 - 1) * n + 1 = n+1. 
    // Correct for a UI that displays “Showing X - Y of Z results”.
    const startPost = (currentPage - 1) * postsPerPage + 1;
    // 15. Derived values used in UI copy (no state, pure computation).
     // endPost clamps the theoretical last index (currentPage * postsPerPage) to the actual totalPosts so the last page shows correct truncated range.
    const endPost = Math.min(currentPage * postsPerPage, totalPosts);

    // Edge cases:
    // If postsPerPage is 0, startPost becomes 1 (incorrect) and endPost = Math.min(0, totalPosts) → 0. 
    // - You must validate postsPerPage >= 1.
    // If totalPosts is 0, better display “Showing 0 results” or adapt the start/end logic to avoid “Showing 1 - 0 of 0”.
    const perPage = Math.max(1, Number(postsPerPage) || 1);
    const total = Math.max(0, Number(totalPosts) || 0);
    const page = Math.max(1, Math.min(Number(currentPage) || 1, Math.ceil(total / perPage) || 1));
    const startPost = total === 0 ? 0 : (page - 1) * perPage + 1;
    const endPost = total === 0 ? 0 : Math.min(page * perPage, total);


    // **Notes**: Why useEffect vs useMemo (tradeoffs)
    // - Current approach (useEffect + useState):
    // Pros: pageNumbers is stateful — easy to debug, inspect, and pass around.
    // Cons: extra render on each change (render → effect → setState → render). Not necessary for pure derivation.
    
    // Better for pure derivation: useMemo:
    // --- Use useMemo to compute pageNumbers synchronously during render:
    const pageNumbers = useMemo(() => {
        // same computation, return numbers
    }, [currentPage, totalPages]);
    // No extra render; semantics are identical for UI outcome. For derived arrays this is usually preferred.

    return (
        <div className="flex flex-col items-center justify-between gap-4 mt-8 sm:flex-row">
            {/* Results info */}
            <div className="text-[#b3b3b3] text-sm">
                Showing {startPost}-{endPost} of {totalPosts} results
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {/* Previous button
                - Uses inline arrow functions for event handlers.
                - Ensures the parent receives page-change events.
                - disabled prop uses a boolean condition for UX control. */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-[#b3b3b3] bg-[#282828] rounded-md hover:bg-[#65350F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {/* First page 
                Dynamically renders pagination buttons.
                - Conditional class application using template literals.
                - Demonstrates React reconciliation via key prop for minimal DOM mutation.*/}
                {pageNumbers[0] > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                1 === currentPage 
                                    ? 'bg-[#65350F] text-white' 
                                    : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#65350F] hover:text-white'
                            }`}
                        >
                            1
                        </button>
                        {pageNumbers[0] > 2 && <span className="px-2 text-[#b3b3b3]">...</span>}
                    </>
                )}

                {/* Page numbers */}
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            number === currentPage 
                                ? 'bg-[#65350F] text-white' 
                                : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#65350F] hover:text-white'
                        }`}
                    >
                        {number}
                    </button>
                ))}

                {/* Last page */}
                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                            <span className="px-2 text-[#b3b3b3]">...</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                totalPages === currentPage 
                                    ? 'bg-[#65350F] text-white' 
                                    : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#65350F] hover:text-white'
                            }`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-[#b3b3b3] bg-[#282828] rounded-md hover:bg-[#65350F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

// React render & reconciliation notes
// When pageNumbers changes (via setPageNumbers), React performs its Virtual DOM diff. 
// Page buttons should be rendered with stable key props (use the page number as key) to ensure minimal DOM ops. 
// Example in your render loop:
{pageNumbers.map(num => <button key={num} {"..."}>{num}</button>)}

// Accessibility: add aria-current="page" for the active page button, and a nav wrapper with aria-label="Pagination" for screen readers. 
// Disable buttons with disabled attribute (semantic) for prev/next when on edges.
// Accessibility checklist (important)
// - Wrap with <nav aria-label="Pagination"> (semantic region).
// - Set aria-current="page" on the button that equals currentPage.
// - Ensure keyboard navigation works: buttons should be real <button> elements (they are), not <div>.
// - Use visible focus outlines or manage :focus styles for keyboard users.
// - For long lists, announce changes via live region if appropriate (rare).

// **Suggested refactor (compute pageNumbers synchronously)**
// Why:
// - No extra render from effect — pageNumbers is computed synchronously with useMemo.
// - Inputs are normalized/clamped to safe values.
// - Accessibility attributes included.
// - Readable and testable.

import { useMemo } from 'react';

const Pagination = ({ currentPage, totalPages, totalPosts, postsPerPage, onPageChange }) => {
  // Defensive normalization
  const perPage = Math.max(1, Number(postsPerPage) || 1);
  const total = Math.max(0, Number(totalPosts) || 0);
  const lastPage = Math.max(1, Number(totalPages) || Math.ceil(total / perPage) || 1);
  const page = Math.max(1, Math.min(Number(currentPage) || 1, lastPage));

  const maxVisible = 3;

  const pageNumbers = useMemo(() => {
    const nums = [];
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(lastPage, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, lastPage, maxVisible]);

  const startPost = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endPost = total === 0 ? 0 : Math.min(page * perPage, total);

  if (lastPage <= 1) return null;

  return (
    <nav aria-label="Pagination">
      <div>Showing {startPost}-{endPost} of {total} results</div>
      <div>
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>

        {pageNumbers[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)}>1</button>
            {pageNumbers[0] > 2 && <span>…</span>}
          </>
        )}

        {pageNumbers.map(num => (
          <button
            key={num}
            aria-current={num === page ? 'page' : undefined}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < lastPage && (
          <>
            {pageNumbers[pageNumbers.length - 1] < lastPage - 1 && <span>…</span>}
            <button onClick={() => onPageChange(lastPage)}>{lastPage}</button>
          </>
        )}

        <button disabled={page === lastPage} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </nav>
  );
};

// TL;DR (practical checklist)
// - Validate & coerce numeric props (Number(), Math.max/Math.min).
// - Prefer useMemo over useEffect+useState for pure derivations (avoid extra re-render).
// - Clamp currentPage into [1, totalPages].
// - Add accessibility (aria-current, nav aria-label, disabled).
// - Handle postsPerPage === 0 and totalPosts === 0 explicitly.
// - Consider server-side / cursor pagination if totalPages is huge.


export default Pagination;