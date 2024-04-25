import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);

    };

    return (
        <div className={isMenuOpen ? "navbar open" : "navbar"}>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>

            <ul className={isMenuOpen ? "menu" : "menu hidden"}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Lista">Lista</Link></li>
                <li><Link to="/Login">Login</Link></li>
                <li><Link to="/Registro">Registro</Link></li>
                <li><Link to="/Nevera">Nevera</Link></li>
                <li><Link to="/Productos">Productos</Link></li>
            </ul>

        </div>
    );
}

export default Navbar;