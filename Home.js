import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard'; 
import { toast } from 'react-toastify'; 

const HOME_SECTIONS = [
    // --- MOVIES: Start with a clear distinction ---
    { title: "Movies: Action Blockbusters", search: "action", type: "movie" },
    { title: "Movies: Romantic Comedies", search: "romance comedy", type: "movie" },
    { title: "Movies: Fantasy Realms", search: "fantasy magic", type: "movie" },
    { title: "Movies: Horror Hits", search: "horror suspense", type: "movie" },
    { title: "Movies: Sci-Fi / Space", search: "space sci-fi", type: "movie" },
    { title: "Movies: Documentary Insights", search: "documentary", type: "movie" },
    { title: "Movies: Classic Drama", search: "classic drama", type: "movie" },
    
    // --- TV SHOWS / SERIES: Separate these distinctly ---
    { title: "TV Shows: Bingeworthy Dramas", search: "series popular", type: "series" },
    { title: "TV Shows: Crime Procedurals", search: "crime investigation", type: "series" },
    { title: "TV Shows: Horror Series", search: "horror series", type: "series" },
    { title: "TV Shows: Historical & Period", search: "historical period", type: "series" },
    { title: "TV Shows: Animated Sitcoms", search: "animation adult comedy", type: "series" },
];

function Home({ omdbBaseUrl, omdbApiKey }) {
    const [genreResults, setGenreResults] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleCardClick = (imdbID) => {
        navigate(`/details/${imdbID}`);
    };

    /**
     * Saves the specific genre search term to localStorage.
     */
    const handleViewAllClick = (sectionSearchTerm) => {
        // This is the key action: it prepares the ListingPage to filter by this genre
        localStorage.setItem('listingPageFilter', sectionSearchTerm);
    };

    const fetchGenreData = async (section) => {
        const { search, type } = section;
        
        const typeParam = type ? `&type=${type}` : ''; 
        // We only fetch page 1 (max 10 results) for the home screen preview
        const apiUrl = `${omdbBaseUrl}?apikey=${omdbApiKey}&s=${search}${typeParam}&page=1`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.Response === "True") {
                // Show all 10 results from the first page
                const filteredResults = data.Search
                    .filter(item => item.Poster && item.Poster !== 'N/A');

                return { 
                    [section.title]: { 
                        results: filteredResults, 
                        searchTerm: section.search, 
                        type: section.type 
                    } 
                };
            } else {
                return { [section.title]: { results: [], searchTerm: section.search, type: section.type } };
            }
        } catch (err) {
            console.error(`Error fetching data for ${section.title}:`, err);
            return { [section.title]: { results: [], searchTerm: section.search, type: section.type } };
        }
    };

    useEffect(() => {
        const loadAllGenres = async () => {
            setIsLoading(true);
            setError(null);

            const resultsArray = await Promise.all(HOME_SECTIONS.map(fetchGenreData));
            const mergedResults = resultsArray.reduce((acc, current) => ({ ...acc, ...current }), {});

            setGenreResults(mergedResults);
            setIsLoading(false);
            
            if (Object.values(mergedResults).every(data => data.results.length === 0)) {
                setError(true); 
            }
        };

        loadAllGenres();
    }, [omdbBaseUrl, omdbApiKey]);

    if (isLoading) {
        return (
            <div className="text-center text-white text-xl p-20">
                <p>Loading a whole lot of entertainment for you... 🍿</p>
                <div className="mt-4 animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 text-xl p-20">
                <p>Error loading content. Please check your network or API key.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white p-4">
            <h1 className="text-5xl font-extrabold text-indigo-400 mb-10 text-center">
                Discover Entertainment By Genre
            </h1>

            {Object.keys(genreResults).map((sectionTitle, index) => {
                const sectionData = genreResults[sectionTitle];
                const results = sectionData.results;
                const searchTerm = sectionData.searchTerm;
                const type = sectionData.type;

                if (!results || results.length === 0) {
                    return null; 
                }

                return (
                    <div key={index} className="mb-12">
                        <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2 flex justify-between items-center">
                            <span>{sectionTitle}</span>
                            
                            {/* The Link routes to the full ListingPage where 'Load More' is available */}
                            <Link 
                                to={type === "series" ? "/tv-shows" : "/movies"} 
                                onClick={() => handleViewAllClick(searchTerm)}
                                className="text-indigo-400 text-sm font-normal hover:text-indigo-300 transition duration-150"
                            >
                                View All (See More) &rarr;
                            </Link>
                        </h2>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            overflowX: 'scroll',
                            gap: '16px',
                            paddingBottom: '16px',
                        }} className="custom-scrollbar">
                            {results.map(item => (
                                <MovieCard
                                    key={item.imdbID}
                                    title={item.Title}
                                    year={item.Year}
                                    poster={item.Poster}
                                    onClick={() => handleCardClick(item.imdbID)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
            
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6366f1; }
            `}</style>
        </div>
    );
}

export default Home;