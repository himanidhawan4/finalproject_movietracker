import React from 'react';

function About() {
    return (
        <div className="min-h-screen text-white p-4 flex flex-col items-center justify-center" style={{ background: '#111827' }}>
            {/* Increased horizontal margin (px-8) and vertical padding (py-24) */}
            <div className="max-w-5xl mx-auto py-24 md:py-32 px-8"> 
                {/* Increased internal padding (p-12 md:p-16) */}
                <div className="bg-gray-800/60 p-12 md:p-16 rounded-2xl shadow-2xl border border-indigo-700/60 transform hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden">
                    
                    {/* Decorative background elements (optional, but adds flair) */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                    {/* Increased Font Size: 5xl -> 6xl, 6xl -> 7xl */}
                    <h1 className="text-6xl md:text-7xl font-extrabold text-red-400 mb-10 pb-4 border-b border-indigo-500/40 text-center animate-pulse-slow">
                        WELCOME, VIEWER!
                    </h1>
                    
                    {/* Increased Font Size: 3xl -> 4xl, 4xl -> 5xl */}
                    <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-300 mb-10 text-center leading-tight">
                        Tired of endlessly scrolling? Take back control of your entertainment destiny with our Movie & TV Show Tracker.
                    </h2>
                    
                    {/* Increased Font Size: lg -> xl, xl -> 2xl */}
                    <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed mb-16 text-justify">
                        This isn't just another discovery tool—it's your personal mission control for media. Effortlessly search through millions of titles, get real-time ratings, and organize your queue into a seamless, permanent watchlist. Stop relying on memory or disorganized notes; whether it's a throwback movie or the next big series, it lives here, ready when you are.
                    </p>

                    {/* Visually appealing divider */}
                    <div className="my-12 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                    {/* Increased Font Size: 3xl -> 4xl, 4xl -> 5xl */}
                    <h3 className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-10 text-center leading-snug">
                        Built by binge-watchers, for binge-watchers.
                    </h3>

                    {/* Increased Font Size: lg -> xl */}
                    <div className="text-xl text-gray-300 leading-relaxed space-y-8 text-justify">
                        <p>
                            We are a team of film and TV enthusiasts who understand the joy of discovering the perfect show. Our mission is to build the ultimate digital companion for your viewing journey.
                        </p>

                        <p>
                            We focus on providing <strong className="text-indigo-200">real-time ratings</strong>, <strong className="text-indigo-200">comprehensive details</strong>, and a <strong className="text-indigo-200">streamlined organization system</strong> so you can spend less time scrolling and more time enjoying.
                        </p>

                        {/* Increased Font Size: xl -> 2xl */}
                        <p className="font-semibold text-indigo-100 text-center pt-8 text-2xl">
                            Join our growing community and let's track the best of cinema and television together!
                        </p>
                    </div>
                </div>
            </div>
            
            <footer className="text-center text-gray-500 text-sm py-4 w-full">
                &copy; 2025 Movie Tracker. All rights reserved. Data provided by OMDb.
            </footer>
        </div>
    );
}

export default About;