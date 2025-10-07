// 1. Imported useState only, as no side effects are required here.
import { useState } from "react";

/**
 * Sorter Component
 * Provides date-based sorting for podcasts 
 * @component
 */
// 2. Then I Defined a controlled dropdown for sorting order.
// 3. using use the Array destructuring, useState hook allows you to define two objects, 
// - sortCriteria maintains internal UI state; initial value 'desc' (descending).
// - onSortChange again allows the parent component to react to this change.
const Sorter = ({ onSortChange }) => {
    const [sortCriteria, setSortCriteria] = useState('desc');

    // Sort options configuration
    // 4. Then I defined Static array of configuration objects, enabling data-driven rendering of the dropdown.
    // I Used an array of objects is cleaner than hardcoding <option> elements directly—allows scaling or localization easily.
    const sortOptions = [
        { value: 'recent', label: 'Newest: Recently updated' },
        { value: 'oldest', label: 'Oldest: GrandPa & GrandMa' },
        { value: 'title-az', label: 'A - Z: Alphabetical order' },
        { value: 'title-za', label: 'Z - A: Alphabetical order' },
        { value: 'seasons', label: '# Seasons: Number of seasons' }
    ];

    // Handle sort order change
    const handleSortChange = (event) => {
        // 5. Reads new sort value.
        const criteria = event.target.value;
        // 6. Updates component state.
        setSortCriteria(criteria);
        // 7. Propagates state upward.
        onSortChange(criteria);
    };

    return (
        <div className="flex items-center justify-start gap-3 mb-6 mt-6">
            <h4 className="font-medium text-[#fff] text-[15px]">Sort by:</h4>
            <div className="flex items-center relative">
                <select 
                    id="podcast-sorter"
                    value={sortCriteria}
                    onChange={handleSortChange}
                    className="w-full px-2 py-2 font-plus-jakarta-sans border text-[13px] font-medium border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-[#000112] [&>option:checked]:text-black"
                >
                    {/* 8. then here, I Used destructuring and arrow function mapping to dynamically render JSX elements.
                        - Ensures consistency and minimal re-renders. */}
                    {sortOptions.map(option => (
                        <option 
                            key={option.value} 
                            value={option.value}
                            className="bg-white text-[13px] font-medium text-gray-400 hover:bg-gray-900"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Sorter;