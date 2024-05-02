// Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function Navbar({ isLoggedIn, handleLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState("");

    useEffect(() => {
        const userName = localStorage.getItem("user");
        if (userName) {
            setUser(userName);
        }
    }, [isLoggedIn]); 
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogoutClick = () => {
        handleLogout();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <div className={isMenuOpen ? "navbar open" : "navbar"}>
            <div className="menu-container">
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>
               
            </div>

            <ul className={isMenuOpen ? "menu" : "menu hidden"}>
                <li><Link to="/">Home</Link></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/Nevera">Nevera</Link></li>
                        <li><Link to="/Lista">Lista</Link></li>
                        <li><Link to="/Recetas">Recetas</Link></li>
                        <li><Link to="/" onClick={handleLogoutClick}>Logout</Link></li>
                    </>
                ) : (
                    <>
                         <li><Link to="/Recetas">Recetas</Link></li>
                        <li><Link to="/Login">Login</Link></li>
                        <li><Link to="/Registro">Registro</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Navbar;
