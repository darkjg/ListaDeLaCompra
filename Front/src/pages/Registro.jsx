import { useState } from "react";

const Registro = () => {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");

    // Expresión regular para verificar el formato de un correo electrónico
    const isEmailValid = (email) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);

    };


    const handleLogin = async (e) => {
        e.preventDefault();
        if (pass !== confirmPass) {
            setError("Las contraseñas no coinciden");
            return;
        } if (!isEmailValid(email)) {
            setError('Por favor, introduce un correo electrónico válido');
            return;
        }else {
            setError("")
            try {
                const response = await fetch("http://localhost:3000/cuenta/crear", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, pass }),
                });
                
                if (response.ok) {
                    alert("Registro exitoso");
                } else {
                    const data = await response.json();
                    setError(data.message || "Error en el registro");
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
                        id="pass"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirmar contraseña:</label>
                    <input
                        type="password"
                        id="confirPass"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                </div>
                <button type="submit">Registrase</button>
            </form>
            {error && <p>{error}</p>}
        </>
    );
};

export default Registro;