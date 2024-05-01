import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SERVER_URL from "../Config/config";

const Home = ({ isLoggedIn }) => {
  const [listas, setListas] = useState([]);
  const [recetaMes, setRecetaMes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
 
    if (isLoggedIn) {
      BuscarListasPorEmail();
    }
    ObtenerRecetaMes();
  }, [isLoggedIn]); 

  const BuscarListasPorEmail = async () => {
    try {
      const email = localStorage.getItem("user");
      if (!email) return; 

      
      const response = await fetch(`${SERVER_URL}/lista/buscar/${email}`);

      if (response.ok) {
        setError(null);

        const data = await response.json();
        
        data.forEach(async list => {
         
          const response2 = await fetch(`${SERVER_URL}/lista/${list}`);
          if (response2.ok) {
            const data2 = await response2.json();
            
            setListas(prevListas => [...prevListas, data2]); 
          } else {
            setError("Error al buscar listas por id");
          }
        });
      } else {
        setError("Error al buscar listas");
      }
    } catch (error) {
      console.error("Error al buscar listas:", error);
      setError("Error al buscar listas");
    }
  };

  const ObtenerRecetaMes = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/recetas/obtener/Top`);
      if (response.ok) {
        const data = await response.json();
        setRecetaMes(data);
        setError(null);
      } else {
        throw new Error("Error al obtener la receta del mes");
      }
    } catch (error) {
      console.error(error);
      setError("Error al obtener la receta del mes");
    }
  };

  return (
    <div>
      <h1>Página de inicio</h1>
      <p>{error}</p>
      {isLoggedIn && (
        <div>
          <h2>Listas de Compras:</h2>
          <ul>
            {listas.map(lista => (
              <li key={lista.id}>
                <div>{lista.NombreLista}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2>Receta del Mes:</h2>
        {recetaMes ? (
          <div>
            <h3>{recetaMes.nombre}</h3>
            <p>{recetaMes.explicacion}</p>
          </div>
        ) : (
          <p>Cargando receta del mes...</p>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Home;
