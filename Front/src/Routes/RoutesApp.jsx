
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home";
import Lista from "../pages/Lista";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Nevera from "../pages/Nevera";
import Producto from "../pages/Producto";
import Navbar from '../componentes/Nav';
import ListaPagina from "../pages/ListaPagina";

function RoutesApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        console.log("Usuario inició sesión. Estado isLoggedIn:", isLoggedIn);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log("Usuario cerró sesión. Estado isLoggedIn:", isLoggedIn);
    };

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Lista" element={<Lista />} />
                <Route path="/Login" element={<Login onLogin={handleLogin} onLogout={handleLogout} />} />
                <Route path="/Registro" element={<Registro />} />
                <Route path="/Nevera" element={<Nevera />} />
                <Route path="/producto/:nombreProducto" element={<Producto/>} />
                <Route path="/lista/:id" element={<ListaPagina />} />
                
            </Routes>
        </Router>
    );
}

export default RoutesApp;