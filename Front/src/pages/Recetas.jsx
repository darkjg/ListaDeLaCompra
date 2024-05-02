import React, { useState, useEffect } from "react";
import SERVER_URL from "../Config/config";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/Recetas.css"

function RecetasComponent() {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [nombreProducto, setNombreProducto] = useState("");

    const navigate = useNavigate();
    const obtenerTodasRecetas = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas`);
            if (!response.ok) {
                throw new Error("Error al obtener las recetas");
            }
            const data = await response.json();
            setRecetas(data);
        } catch (err) {
            setError(err.message);
        }
    };


    const actualizarReceta = async (id) => {
        navigate(`/CrearRecetas/${id}`);
    };

    const eliminarReceta = async (id) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Error al eliminar la receta");
            }
            obtenerTodasRecetas();
        } catch (err) {
            setError(err.message);
        }
    };


    const buscarRecetasPorProducto = async (nombreProducto) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/obtener/${nombreProducto}`);
            if (!response.ok) {
                throw new Error("Error al buscar recetas por producto");
            }
            const data = await response.json();
            setRecetas(data);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const obtenerRecetasDisponibles = async () => {
        try {
            const userEmail = localStorage.getItem("user");

            const responseNeveraId = await fetch(`${SERVER_URL}/cuenta/nevera`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userEmail }),
            });
            if (!responseNeveraId.ok) {
                throw new Error("Error al obtener el ID de la nevera del usuario");
            }
            const dataNeveraId = await responseNeveraId.json();
            const neveraId = dataNeveraId.nevera;


            if (neveraId) {
                const responseNevera = await fetch(`${SERVER_URL}/nevera/${neveraId}`);
                if (!responseNevera.ok) {
                    throw new Error("Error al cargar la nevera");
                }
                const dataNevera = await responseNevera.json();
                console.log(dataNevera.nevera)
                const nevera = dataNevera.nevera;



                console.log(nevera)

                const ingredientes = nevera.productos.map(item => item.nombre);

                console.log(ingredientes)
                const responseRecetas = await fetch(`${SERVER_URL}/recetas/obtener`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ingredientes: ingredientes }),
                });
                if (!responseRecetas.ok) {
                    throw new Error("Error al obtener las recetas para los ingredientes");
                }
                const recetasResponses = await responseRecetas.json();

                setRecetas(recetasResponses);
            }
        } catch (err) {
            setError(err.message);
        }
    };


    const obtenerMejorRecetaDelMes = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/obtener/Top`);
            if (!response.ok) {
                throw new Error("Error al obtener la mejor receta del mes");
            }
            const data = await response.json();
            setRecetas([data]);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        obtenerTodasRecetas();
    }, []);
    const redirectToCrearRecetas = () => {
        navigate("/CrearRecetas");
    };

    return (
        <div className="page-content">
            <h1>Recetas</h1>
            {error && <p className="error-message">Error: {error}</p>}
            <div className="button-container">
                <button onClick={obtenerTodasRecetas}>Obtener todas las recetas</button>
                <button onClick={obtenerRecetasDisponibles}>Obtener recetas disponibles</button>
                <button onClick={obtenerMejorRecetaDelMes}>Obtener mejor receta del mes</button>
            </div>
            <div className="search-container">
                <input type="text" placeholder="Buscar recetas por producto" value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)} />
                <button onClick={() => buscarRecetasPorProducto(nombreProducto)}>Buscar</button>
            </div>
            <button className="create-button" onClick={redirectToCrearRecetas}>Crear Recetas</button>

            <ul className="recipe-list">
                {recetas.map((receta) => (
                    <li key={receta._id}>
                        {receta.nombre}
                        <div className="button-group">
                            <button onClick={() => actualizarReceta(receta._id)}>
                                <FaEdit /> Actualizar
                            </button>
                            <button onClick={() => eliminarReceta(receta._id)}>
                                <FaTrash /> Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default RecetasComponent;
