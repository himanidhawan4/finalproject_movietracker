import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './component/Header.js'; 
import Home from './component/Home';
import DetailPage from './component/Details.js';
import About from './component/about.js';
import SearchPage from './component/SearchPage.js';
import Watchlist from './component/Watchlist.js';
import ListingPage from './component/ListingPage.js';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = '4c4b1b1d'; 

function NotFoundPage() {
    useEffect(() => {
        toast.error('The page you requested was not found. Please recheck your URL.', {
            position: "top-center", autoClose: 5000, theme: "dark",
        });
    }, []);
    return (
        <div className="p-12 text-center bg-gray-900/80 rounded-lg shadow-xl max-w-lg mx-auto mt-10 border border-gray-700">
            <h2 className="text-8xl font-extrabold text-red-500 mb-4">404</h2>
            <p className="text-2xl text-white mb-6">Page Not Found. 🎬</p>
            <Link to="/" className="inline-block px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md mt-4">
                Start Tracking from Home
            </Link>
        </div>
    );
}

function App() {
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const savedList = localStorage.getItem('movieTrackerWatchlist');
            return savedList ? JSON.parse(savedList) : [];
        } catch (error) {
            console.error("Error loading watchlist from local storage:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('movieTrackerWatchlist', JSON.stringify(watchlist));
        } catch (error) {
            console.error("Error saving watchlist to local storage:", error);
            toast.error("Could not save watchlist changes. Storage is full.", { theme: "dark" });
        }
    }, [watchlist]);
    
    const toggleWatchlist = (movie) => {
        const isAdded = watchlist.some(item => item.imdbID === movie.imdbID);

        if (isAdded) {
            setWatchlist(prevList => {
                const newList = prevList.filter(item => item.imdbID !== movie.imdbID);
                toast.info(`Removed "${movie.Title}" from Watchlist.`, { theme: "dark" });
                return newList;
            });
            return false;
        } else {
            const newItem = {
                Title: movie.Title,
                Year: movie.Year,
                Poster: movie.Poster,
                imdbID: movie.imdbID,
                Type: movie.Type,
                imdbRating: movie.imdbRating || 'N/A'
            };

            setWatchlist(prevList => {
                const newList = [...prevList, newItem];
                toast.success(`Added "${movie.Title}" to Watchlist!`, { theme: "dark" });
                return newList;
            });
            return true;
        }
    };
    
    const isItemOnWatchlist = (imdbID) => {
        return watchlist.some(item => item.imdbID === imdbID);
    };

    return (
        <BrowserRouter>
            <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#111827' }}>
                <ToastContainer position="top-center" theme="dark" />
                <Header /> 
                <div className="container mx-auto" style={{ paddingTop: '80px', paddingBottom: '20px' }}>
                    <Routes>
                        <Route 
                            path="/" 
                            element={<Home omdbApiKey={OMDB_API_KEY} omdbBaseUrl={OMDB_BASE_URL} />} 
                        />
                        <Route 
                            path="/details/:id" 
                            element={<DetailPage 
                                toggleWatchlist={toggleWatchlist} 
                                isItemOnWatchlist={isItemOnWatchlist}
                            />} 
                        /> 
                        <Route 
                            path="/watchlist" 
                            element={<Watchlist 
                                watchlist={watchlist} 
                                toggleWatchlist={toggleWatchlist}
                            />} 
                        /> 
                        <Route path="/search/:term" element={<SearchPage />} />
                        <Route path="/about" element={<About />} />
                        
                        <Route 
                            path="/movies" 
                            element={<ListingPage type="movie" />} 
                        />
                        <Route 
                            path="/tv-shows" 
                            element={<ListingPage type="series" />} 
                        />
                        
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                <footer style={{ marginTop: '20px', padding: '20px', textAlign: 'center', fontSize: '14px', color: '#4B5563' }}>
                    © {new Date().getFullYear()} Movie & TV Tracker. Data provided by OMDb.
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;