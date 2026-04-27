import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const navItems = [ 
    { to: "/", label: "Home" },
    { to: "/movies", label: "Movies" },
    { to: "/tv-shows", label: "TV Shows" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/about", label: "About" },
];

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search/${searchTerm.trim()}`);
            setSearchTerm(''); 
            setIsMenuOpen(false); 
        }
    };

    const navLinkActiveStyle = {
        color: '#FFFFFF', fontWeight: 'bold', borderBottom: '3px solid #6366F1', paddingBottom: '8px',
    };
    const navLinkBaseStyle = {
        marginRight: '25px', color: '#9CA3AF', paddingBottom: '8px', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer',
    };
    const navLinkMobileStyle = {
        color: '#E5E7EB', padding: '12px 0', textAlign: 'center', textDecoration: 'none', borderBottom: '1px solid #374151', transition: 'color 0.2s', display: 'block', 
    };

    const handleHover = (e) => { e.currentTarget.style.color = '#E5E7EB'; };

    const handleLeave = (e, isActive) => {
        if (!isActive) { e.currentTarget.style.color = '#9CA3AF'; }
    };
    
    const renderNavLinks = (isMobile = false) => (
        navItems.map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                onClick={() => isMobile && setIsMenuOpen(false)}
                onMouseEnter={handleHover}
                onMouseLeave={(e) => handleLeave(e, item.to === window.location.pathname)}
                style={({ isActive }) => ({
                    ...(isMobile ? navLinkMobileStyle : navLinkBaseStyle),
                    ...(isMobile && isActive ? { fontWeight: 'bold', color: '#6366F1' } : {}),
                    ...(!isMobile && isActive ? navLinkActiveStyle : {})
                })}
            >
                {item.label}
            </NavLink>
        ))
    );

    return (
        <header 
            style={{ 
                position: 'fixed', top: 0, width: '100%', zIndex: 1000, background: '#1F2937', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
            }}
        >
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <h1 style={{ color: '#6366F1', fontSize: '1.75rem', fontWeight: 'bold', marginRight: '30px' }}>
                    Movie Tracker 🎬
                </h1>
            </Link>

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white md:hidden p-2"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', marginLeft: '15px' }}
            >
                {isMenuOpen ? '✕' : '☰'} 
            </button>

            <nav className="hidden md:flex" style={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                {renderNavLinks(false)}
            </nav>

            <form onSubmit={handleSearchSubmit} className="search-bar hidden md:block" style={{ marginLeft: 'auto' }}>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search titles..."
                    style={{
                        padding: '8px 12px', borderRadius: '6px', border: '1px solid #4B5563', background: '#374151', color: '#E5E7EB', width: '250px',
                    }}
                />
            </form>
            
            {isMenuOpen && (
                <div 
                    className="md:hidden" 
                    style={{
                        position: 'fixed', top: '65px', width: '100%', zIndex: 999, background: '#1F2937', padding: '10px 20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                    }}
                >
                    {renderNavLinks(true)}
                    <form onSubmit={handleSearchSubmit} style={{ marginTop: '10px' }}>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search titles..."
                            style={{
                                padding: '8px 12px', borderRadius: '6px', border: '1px solid #4B5563', background: '#374151', color: '#E5E7EB', width: '100%',
                            }}
                        />
                    </form>
                </div>
            )}
        </header>
    );
}

export default Header;