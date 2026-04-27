import React, { useState } from 'react';

const FALLBACK_POSTER = 'https://via.placeholder.com/300x450?text=Poster+Unavailable'; 

function MovieCard({ title, year, poster, onClick }) {
    const initialPoster = (poster && poster !== 'N/A') ? poster : FALLBACK_POSTER;
    const [imgSrc, setImgSrc] = useState(initialPoster);

    const handleError = (e) => {
        if (e.target.src !== FALLBACK_POSTER) {
            setImgSrc(FALLBACK_POSTER);
        }
    };

    return (
        <div 
            onClick={onClick}
            className="w-40 md:w-52 bg-gray-800 rounded-lg shadow-xl overflow-hidden 
                       transform hover:scale-105 transition duration-300 cursor-pointer 
                       flex flex-col items-center border border-gray-700 hover:border-indigo-500"
            style={{ flexShrink: 0 }}
        >
            <div className="w-full" style={{ height: '300px' }}>
                <img 
                    src={imgSrc} 
                    alt={`${title} poster`} 
                    onError={handleError} 
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className="p-3 text-center w-full flex-grow">
                <h3 className="text-md font-semibold text-white truncate" title={title}>
                    {title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{year}</p>
            </div>
        </div>
    );
}

export default MovieCard;