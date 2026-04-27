import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = '4c4b1b1d'; 

function DetailPage({ toggleWatchlist, isItemOnWatchlist }) { 
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            
            // Uses the API key defined in this file
            const apiUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (data.Response === "True") {
                    setDetails(data);
                } else {
                    throw new Error(data.Error || "Details not found for this title.");
                }
            } catch (err) {
                setError(err.message);
                toast.error(`Could not load details: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (isLoading) {
        return <div className="text-center text-white text-xl p-20"><p>Fetching full details for ID: {id}... 🎬</p></div>;
    }

    if (error) {
        return <div className="text-center text-red-400 text-xl p-20"><p>Error: {error}</p></div>;
    }

    if (!details) {
        return null;
    }

    const itemAdded = isItemOnWatchlist(details.imdbID);

    const handleToggle = () => {
        toggleWatchlist(details);
    };
    
    const renderRatings = () => {
        if (!details.Ratings || details.Ratings.length === 0 || details.Ratings[0].Source === 'N/A') {
            return <p className="text-gray-400">N/A</p>;
        }
        return (
            <div className="space-y-1">
                {details.Ratings.map((rating, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span className="font-semibold text-indigo-300">{rating.Source}:</span>
                        <span className="text-white">{rating.Value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen text-white p-4 pt-8">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 max-w-4xl mx-auto">
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-6 text-center">
                    {details.Title} ({details.Year})
                </h1>
                
                <div className="text-center mb-8">
                    <button
                        onClick={handleToggle}
                        className={`px-8 py-3 text-lg font-bold rounded-full transition duration-300 shadow-lg ${
                            itemAdded 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        {itemAdded ? '❌ Remove from Watchlist' : '⭐ Add to Watchlist'}
                    </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                    
                    <div className="flex-shrink-0 mx-auto md:mx-0" style={{ width: '300px' }}>
                        {details.Poster && details.Poster !== 'N/A' ? (
                            <img 
                                src={details.Poster} 
                                alt={details.Title} 
                                className="rounded-lg shadow-lg w-full"
                            />
                        ) : (
                            <div className="h-96 w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                                Poster Unavailable
                            </div>
                        )}
                        
                        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                            <h3 className="text-xl font-bold mb-3 text-white border-b border-gray-600 pb-2">Ratings</h3>
                            {renderRatings()}
                        </div>
                    </div>
                    
                    <div className="flex-grow">
                        
                        <div className="mb-6">
                            <p className="text-gray-300 text-lg leading-relaxed mb-4">{details.Plot}</p>
                            <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-full">
                                {details.Rated}
                            </span>
                        </div>
                        
                        <div className="space-y-3 p-4 bg-gray-700/50 rounded-lg">
                            <DetailRow label="Type" value={`${details.Type.charAt(0).toUpperCase() + details.Type.slice(1)}`} />
                            <DetailRow label="Genre" value={details.Genre} />
                            <DetailRow label="Language" value={details.Language} />
                            <DetailRow label="IMDb Rating" value={`${details.imdbRating} / 10`} />
                            <DetailRow label="Awards" value={details.Awards} type="awards" />
                            <DetailRow label="Runtime" value={details.Runtime} />
                            <DetailRow label="Director" value={details.Director} />
                            <DetailRow label="Cast" value={details.Actors} />
                            <DetailRow label="Box Office" value={details.BoxOffice || 'N/A'} />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

const DetailRow = ({ label, value, type }) => {
    const valueClass = type === 'awards' && value !== 'N/A' && value.includes('win') ? 
                       'text-yellow-400 font-bold' : 'text-gray-300';
                       
    const displayValue = value && value !== 'N/A' && value !== 'imdb_not_available' ? value : 'Not Available';

    return (
        <div className="flex border-b border-gray-700 pb-2">
            <span className="font-semibold text-indigo-200 w-32 flex-shrink-0">{label}:</span>
            <span className={`ml-4 ${valueClass}`}>{displayValue}</span>
        </div>
    );
};

export default DetailPage;