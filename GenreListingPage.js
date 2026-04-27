import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from './MovieCard'; // Assuming you have a reusable MovieCard component
import { toast } from 'react-toastify';

const GenreListingPage = ({ omdbApiKey, omdbBaseUrl }) => {
    // Extract parameters from the URL: e.g., /genre/movie/action-blockbusters
    const { type, name } = useParams(); 
    
    // Convert the URL slug to a clean, capitalized title for display
    const genreTitle = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Use the genre name as the search term, as OMDb lacks a genre filter
    const searchTerm = genreTitle.replace(/\s(Blockbusters|Thrills)$/i, '').trim(); 

    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            setLoading(true);
            
            // OMDB SEARCH WORKAROUND: Search using the genre name as the title
            const url = `${omdbBaseUrl}?s=${searchTerm}&type=${type}&page=${page}&apikey=${omdbApiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.Response === "True") {
                    setMovies(prevMovies => page === 1 ? data.Search : [...prevMovies, ...data.Search]);
                    setTotalResults(data.totalResults);
                } else {
                    setMovies([]);
                    setTotalResults(0);
                    if (page === 1) {
                         // Only show error toast if it's the first page load
                        toast.error(`No ${type}s found for "${genreTitle}".`, { theme: "dark" });
                    }
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("An error occurred while fetching movies.", { theme: "dark" });
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesByGenre();
    }, [searchTerm, type, page, omdbApiKey, omdbBaseUrl]);


    // Placeholder for a reusable MovieCard component (you should define this)
    const MovieCard = ({ movie }) => (
        <Link to={`/details/${movie.imdbID}`} className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
            <img 
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                alt={movie.Title} 
                className="w-full h-auto object-cover"
            />
            <div className="p-3 text-white text-center">
                <h3 className="text-lg font-semibold truncate">{movie.Title}</h3>
                <p className="text-sm text-gray-400">{movie.Year}</p>
            </div>
        </Link>
    );

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                All {genreTitle} ({type}s)
            </h1>

            {loading && page === 1 ? (
                <p className="text-white text-lg">Loading full list...</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies.map(movie => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>
                    
                    {/* Load More Button */}
                    {totalResults > movies.length && !loading && (
                        <div className="text-center mt-10">
                            <button
                                onClick={() => setPage(prevPage => prevPage + 1)}
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
                            >
                                Load More ({totalResults - movies.length} remaining)
                            </button>
                        </div>
                    )}
                    
                    {loading && page > 1 && (
                         <div className="text-center mt-10 text-white">Loading more...</div>
                    )}

                    {movies.length === 0 && !loading && (
                        <p className="text-white text-center mt-10 text-xl">
                            Sorry, no {type}s matched the search for "{genreTitle}".
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default GenreListingPage;