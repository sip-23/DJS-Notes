// 1. here, This one introduces useEffect, dependency management, and derived state calculation.
import { useState, useEffect } from "react";

/**
 * Pagination Component
 * 
 * The count or numbered pages with navigation buttons 
 * @component
 */

// 2. Props: externally controlled pagination state.
const Pagination = ({ currentPage, totalPages, totalPosts, postsPerPage, onPageChange }) => {
        // 3. State: pageNumbers is a derived UI subset — local to this component.
        const [pageNumbers, setPageNumbers] = useState([]);
        // 4. Parent likely owns currentPage and onPageChange (classic state lifting pattern).

    // Calculating visible page numbers at the bottom: 1, 2, 3, ... 7
    useEffect(() => {
        const numbers = [];
        const maxVisiblePages = 3;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }
        
        setPageNumbers(numbers);
    }, [currentPage, totalPages]);

    // 5. Effect hook (useEffect):
    // - Executes after the component renders or updates.
    // - Dependency array [currentPage, totalPages] means:
    //      - The effect re-runs only when currentPage or totalPages changes.
    //      - Prevents unnecessary recalculation of pageNumbers (performance optimization).

    // 4. Algorithm:
    // - Dynamically computes visible page indices (e.g., 3 pages visible around the current one).
    // - Uses Math operations to clamp page ranges.
    // - Updates local state (setPageNumbers) to trigger UI re-render.

    // 5. Functional purity:
    // The computation is deterministic and side-effect-free except for the controlled state update.

    if (totalPages <= 1) return null;
    // 6. Short-circuit return — prevents rendering pagination UI when unnecessary.
    // - A common conditional rendering pattern in React.

    // Calculates the range of posts being displayed.
    const startPost = (currentPage - 1) * postsPerPage + 1;
    // Derived values used in UI copy (no state, pure computation).
    const endPost = Math.min(currentPage * postsPerPage, totalPosts);

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

export default Pagination;