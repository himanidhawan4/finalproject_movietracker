import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard'; 

function Watchlist({ watchlist, toggleWatchlist }) {
    const navigate = useNavigate();

    const handleCardClick = (imdbID) => {
        navigate(`/details/${imdbID}`); 
    };

    const handleRemove = (item) => {
        toggleWatchlist(item); 
    };

    return (
        <div className="min-h-screen text-white p-4">
            <h1 className="text-5xl font-extrabold text-indigo-400 mb-10 text-center">
                My Watchlist ({watchlist.length} Titles) 
            </h1>

            {watchlist.length === 0 ? (
                <div className="text-center p-20 bg-gray-900/70 rounded-xl max-w-lg mx-auto border border-gray-700">
                    <p className="text-2xl text-gray-400 mb-4">
                        Your watchlist is currently empty.
                    </p>
                    <p className="text-lg text-gray-500">
                        Add movies or shows from their detail pages to start tracking!
                    </p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center">
                    {watchlist.map(item => (
                        <div key={item.imdbID} className="relative group">
                            <MovieCard 
                                title={item.Title} 
                                year={item.Year} 
                                poster={item.Poster}
                                onClick={() => handleCardClick(item.imdbID)}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(item);
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-700/90 text-white 
                                           rounded-full opacity-0 group-hover:opacity-100 
                                           transition duration-200 text-xs font-bold z-10 
                                           hover:bg-red-800"
                                style={{ width: '24px', height: '24px' }}
                                title={`Remove ${item.Title}`}
                            >
                              
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Watchlist;