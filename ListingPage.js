import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from './MovieCard'; // Ensure this path is correct
import { toast } from 'react-toastify';

// Placeholder values - replace with your actual values if they are props
const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = '4c4b1b1d'; 

function ListingPage({ type }) {
    const location = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const initialLoadRef = useRef(true);

    // Effect 1: Determine the search term and clean up localStorage
    useEffect(() => {
        let initialTerm = localStorage.getItem('listingPageFilter');

        // Check if a specific genre filter was set via "View All"
        if (initialTerm) {
            setSearchTerm(initialTerm);
            // Crucial: Clear the filter immediately after reading it
            localStorage.removeItem('listingPageFilter');
        } else {
            // If no filter, use the generic type ('movie' or 'series')
            setSearchTerm(type);
        }
        
        // Reset state for a new search
        setPage(1); 
        setMovies([]);
        setTotalResults(0);
        initialLoadRef.current = true;
        
    }, [type, location.pathname]); 

    // Effect 2: Data Fetching Logic (runs when searchTerm or page changes)
    useEffect(() => {
        if (!searchTerm) return;

        const fetchContent = async () => {
            setLoading(true);
            const apiUrl = `${OMDB_BASE_URL}?s=${searchTerm}&type=${type}&page=${page}&apikey=${OMDB_API_KEY}`;
            
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.Response === "True" && data.Search) {
                    const newContent = data.Search.filter(item => item.Poster && item.Poster !== 'N/A');
                    
                    // Append new results if page > 1, otherwise replace (for the first page)
                    setMovies(prevMovies => page === 1 ? newContent : [...prevMovies, ...newContent]);
                    setTotalResults(parseInt(data.totalResults, 10));
                } else if (page === 1) {
                    setMovies([]);
                    setTotalResults(0);
                    if (!initialLoadRef.current) {
                        toast.error(`No results found for "${searchTerm}" in ${type}s.`, { theme: "dark" });
                    }
                }
            } catch (error) {
                console.error("Fetch error:", error);
                if (page === 1) {
                    toast.error("An error occurred while fetching content.", { theme: "dark" });
                }
            } finally {
                setLoading(false);
                initialLoadRef.current = false;
            }
        };

        fetchContent();
    }, [searchTerm, type, page]);

    // Function to trigger the next page load
    const handleLoadMore = () => {
        if (!loading && movies.length < totalResults) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Determine the title to display
    const displayTitle = searchTerm === type ? 
        (type === 'movie' ? 'All Movies' : 'All TV Shows') : 
        `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} ${type === 'movie' ? 'Movies' : 'TV Shows'}`;

    return (
        <div className="p-4 text-white min-h-screen">
            <h1 className="text-4xl font-extrabold text-indigo-400 mb-6 border-b border-gray-700 pb-2">
                {displayTitle}
            </h1>

            {loading && initialLoadRef.current ? (
                 <div className="text-center text-xl p-10">Loading results...</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies.map(item => (
                            <MovieCard 
                                key={item.imdbID}
                                title={item.Title}
                                year={item.Year}
                                poster={item.Poster}
                                onClick={() => window.location.href = `/details/${item.imdbID}`}
                            />
                        ))}
                    </div>

                    {movies.length === 0 && !loading && (
                        <p className="text-center text-xl text-gray-400 p-10">
                            No content found. Please try a different search term.
                        </p>
                    )}

                    {/* Load More Button - visible if there are still more results to fetch */}
                    {totalResults > movies.length && (
                        <div className="text-center mt-10">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-500"
                            >
                                {loading ? 'Loading...' : `Load More (${totalResults - movies.length} remaining)`}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ListingPage;