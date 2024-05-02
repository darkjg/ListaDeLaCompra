import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SERVER_URL from "../Config/config";
import "../css/Home.css";
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
            const newListas = [];
            for (const listId of data) {
                const response2 = await fetch(`${SERVER_URL}/lista/${listId}`);
                if (response2.ok) {
                    const data2 = await response2.json();
                    newListas.push(data2);
                } else {
                    setError("Error al buscar listas por id");
                }
            }
            setListas(newListas);
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
    <div className="page-content">
      <div className="container">
        <p>{error}</p>
  
        {!isLoggedIn && (
          <div className="flex-container">
            <div className="card">
              <h2>Receta del Mes:</h2>
              <div className="center">
                {recetaMes ? (
                  <div>
                    <h3>{recetaMes.nombre}</h3>
                    <p>{recetaMes.explicacion}</p>
                  </div>
                ) : (
                  <p>Cargando receta del mes...</p>
                )}
              </div>
            </div>
          </div>
        )}
        {isLoggedIn && (
          <div className="flex-container">
            <div className="card">
              <h2>Listas de Compras:</h2>
              {listas.map(lista => (
                <div key={lista.id} className="center">
                  <Link to={`/lista/${lista._id}`}>{lista.NombreLista}</Link>
                </div>
              ))}
            </div>
            <div className="card">
              <h2>Receta del Mes:</h2>
              <div className="center">
                {recetaMes ? (
                  <div>
                    <h3>{recetaMes.nombre}</h3>
                    <p>{recetaMes.explicacion}</p>
                  </div>
                ) : (
                  <p>Cargando receta del mes...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Home;
