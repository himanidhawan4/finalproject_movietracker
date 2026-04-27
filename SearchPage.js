import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MovieCard from './MovieCard';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = '4c4b1b1d'; 

function SearchPage() {
    const { term } = useParams();
    const navigate = useNavigate();
    
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [error, setError] = useState(null);

    const handleCardClick = (imdbID) => {
        navigate(`/details/${imdbID}`);
    };

    useEffect(() => {
        if (!term) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            
            const apiUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${term}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if (data.Response === "True") {
                    const filteredResults = data.Search.filter(item => item.Poster && item.Poster !== 'N/A');
                    setResults(filteredResults);
                    setTotalResults(parseInt(data.totalResults, 10));
                } else {
                    setResults([]);
                    setTotalResults(0);
                    setError(`No results found for "${term}".`);
                    toast.warn(`No results found for "${term}".`, { theme: "dark" });
                }
            } catch (err) {
                setError("Network error. Could not complete search.");
                toast.error("Network error. Could not complete search.", { theme: "dark" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [term]);

    if (isLoading) {
        return <div className="text-center text-white text-xl p-20"><p>Searching for titles matching "{term}"... 🔎</p></div>;
    }

    if (error && results.length === 0) {
        return <div className="text-center text-red-400 text-xl p-20"><p>Error: {error}</p></div>;
    }

    return (
        <div className="min-h-screen text-white p-4">
            <h1 className="text-4xl font-extrabold text-indigo-400 mb-6">
                Search Results for: "{term}" ({results.length} Titles)
            </h1>
            
            {results.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-start">
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
            ) : (
                <div className="text-center p-20 text-gray-400 text-lg">
                    No results with posters were found matching your search. Try a different term.
                </div>
            )}
        </div>
    );
}

export default SearchPage;