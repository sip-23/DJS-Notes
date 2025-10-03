import { useState, useEffect } from "react";
import { genres } from "../../../data";

/**
 * GenreFilter Component
 * Provides genre-based filtering for podcasts
 * @component
 */
const GenreFilter = ({ onGenreChange }) => {
    const [selectedGenre, setSelectedGenre] = useState('all');

    // Handle genre selection change
    const handleGenreChange = (event) => {
        const genreId = event.target.value;
        setSelectedGenre(genreId);
        onGenreChange(genreId);
    };

    return (
        <div className="flex items-center justify-start gap-3 mb-6 mt-6">
            <h4 className="font-medium text-[#fff] text-[15px]">Filter by:</h4>
            <div className="flex items-center relative">
                <select 
                    id="genre-filter"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    className="w-full px-2 py-2 font-plus-jakarta-sans border text-[13px] font-medium border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-[#000112] [&>option:checked]:text-black"
                >
                    <option value="all" className="bg-white text-[13px] font-medium text-gray-400 hover:bg-gray-900">
                        All Genres
                    </option>
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