import { useState } from "react";
import SERVER_URL from "../Config/config";

const Registro = () => {
    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpassword, setConfirmpassword] = useState("");
    const [error, setError] = useState("");

    // Expresión regular para verificar el formato de un correo electrónico
    const isEmailValid = (email) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);

    };


    const handleLogin = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            setError("Las contraseñas no coinciden");
            return;
        } if (!isEmailValid(email)) {
            setError("Por favor, introduce un correo electrónico válido");
            return;
        } else {
            setError("")
            try {
                const response = await fetch(`${SERVER_URL}/cuenta/crear`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    alert("Registro exitoso");
                } else {
                    if (response.status == 409) {
                        setError("El usuario ya está registrado");
                    } else {
                        const data = await response.json();
                        setError(data.message || "Error en el registro");
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                setError("Error en el registro");
            }
        }
    }
    return (
        <>
            <form onSubmit={handleLogin}>
                <div>
                    <label >Usuario:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirmar contraseña:</label>
                    <input
                        type="password"
                        id="confirpassword"
                        value={confirmpassword}
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                </div>
                <button type="submit">Registrase</button>
            </form>
            {error && <p>{error}</p>}
        </>
    );
};

export default Registro;