import { useState } from "react";
import SERVER_URL from "../Config/config";
import "../css/Registro.css"
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
    <div className="center-container">
      <form onSubmit={handleLogin} className="registro-form">
        <div className="input-container">
          <label htmlFor="email">Usuario:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label htmlFor="confirmpassword">Confirmar contraseña:</label>
          <input
            type="password"
            id="confirmpassword"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="button-submit">Registrarse</button>
      </form>
      {error && <p>{error}</p>}
    </div>

  );

};

export default Registro;