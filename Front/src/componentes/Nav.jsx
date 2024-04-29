// Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function Navbar({ isLoggedIn, handleLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userName = localStorage.getItem("user");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    const handleLogoutClick = () => {
        handleLogout(); // Llama a la función de cierre de sesión pasada como prop
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <div className={isMenuOpen ? "navbar open" : "navbar"}>
            <div className="menu-container">
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>
                {isLoggedIn && <div className="user">{userName}</div>}
            </div>
            
            <ul className={isMenuOpen ? "menu" : "menu hidden"}>
                <li><Link to="/">Home</Link></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/Nevera">Nevera</Link></li>
                        <li><Link to="/Productos">Productos</Link></li>
                        <li><Link to="/" onClick={handleLogoutClick}>Logout</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/Lista">Lista</Link></li>      
                        <li><Link to="/Login">Login</Link></li>
                        <li><Link to="/Registro">Registro</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Navbar;
