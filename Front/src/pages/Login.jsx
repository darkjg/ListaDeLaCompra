import React, { useState, useEffect } from "react";
import SERVER_URL from "../Config/config";
import { useNavigate } from "react-router-dom";
function Login({ onLogin ,onLogout}) { // Asegúrate de pasar props como parámetro aquí
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            
            const response = await fetch(`${SERVER_URL}/cuenta/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("user", data.user.email);
                localStorage.setItem("token", data.token);
                setIsLoggedIn(true);
                navigate("/");
                // Llama a la función onLogin pasada como prop
                if (typeof onLogin == "function") {
                    onLogin();
                }
               
            } else {
                const data = await response.json();
                setError(data.message || "Error en el inicio de sesión");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Error en el inicio de sesión");
        }
    };

    const handleLogout = () => {
        if (typeof onLogout == "function") {
            onLogout();
        }
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setEmail("");
        setPassword("");
        setError("")
    };

    return (
        <div className="page-content"> 
            {isLoggedIn ? (
                <div>
                    <h1>Sesión ya iniciada</h1>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
            ) : (
                <div>
                    <h1>Iniciar sesión</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Iniciar sesión</button>
                        {error && <div className="error-message">{error}</div>}
                    </form>
                </div>
            )}
        </div>
    );
}

export default Login;
